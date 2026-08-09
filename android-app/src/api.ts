/**
 * JobEzz — API layer (Axios + TanStack React Query)
 * -----------------------------------------------------------------------------
 * A complete, offline-first networking stack:
 *
 *  - Configured Axios instance with request/response interceptors
 *  - Automatic access-token injection + 401 refresh flow
 *  - Normalized error handling with typed `ApiErrorShape`
 *  - Exponential-backoff retry logic
 *  - React Query client tuned for offline-first caching
 *  - Typed query/mutation hooks for every domain endpoint
 *  - Optimistic updates (e.g. save/unsave a job) with rollback
 *
 * The base URL is read from `process.env.EXPO_PUBLIC_API_URL` and falls back to
 * a sensible default so the module loads in any environment.
 *
 * @module api
 */
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import {
  QueryClient,
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';

import { storage } from './hooks';
import {
  CATEGORIES,
  PROVIDERS,
  JOBS,
  COURSES,
  CHATS,
  NOTIFS,
  INVOICES,
  MY_APPLICATIONS,
  MY_POSTINGS,
  APPLICANTS,
} from './data';
import type {
  ApiError,
  ApiResponse,
  AuthTokens,
  Category,
  Provider,
  Job,
  Course,
  Chat,
  Notification,
  Invoice,
  LoginRequest,
  LoginResponse,
  MyApplication,
  JobPosting,
  Applicant,
  User,
} from './types';

/* ─────────────────────────────────────────────
 * 1. Configuration + token storage
 * ───────────────────────────────────────────── */

/** Base URL for the JobEzz backend. Override via `EXPO_PUBLIC_API_URL`. */
export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  'https://api.jobezz.example/v1';

/** MMKV keys for persisted auth tokens. */
const TOKEN_KEYS = {
  access: 'auth.accessToken',
  refresh: 'auth.refreshToken',
} as const;

/** Read the stored access token (synchronous via MMKV). */
export function getAccessToken(): string | null {
  return storage.getString(TOKEN_KEYS.access) ?? null;
}

/** Read the stored refresh token. */
export function getRefreshToken(): string | null {
  return storage.getString(TOKEN_KEYS.refresh) ?? null;
}

/** Persist a fresh token pair. */
export function setTokens(tokens: AuthTokens): void {
  storage.set(TOKEN_KEYS.access, tokens.accessToken);
  storage.set(TOKEN_KEYS.refresh, tokens.refreshToken);
}

/** Clear stored credentials (on logout / unrecoverable auth failure). */
export function clearTokens(): void {
  storage.delete(TOKEN_KEYS.access);
  storage.delete(TOKEN_KEYS.refresh);
}

/* ─────────────────────────────────────────────
 * 2. Error normalization
 * ───────────────────────────────────────────── */

/** A normalized, UI-friendly error shape. */
export interface ApiErrorShape {
  /** Machine-readable error code. */
  code: string;
  /** Human-readable message (already localized server-side when possible). */
  message: string;
  /** HTTP status, if available. */
  status?: number;
  /** Per-field validation errors, if any. */
  fields?: Record<string, string[]>;
}

/**
 * Normalize any thrown value (Axios error, network error, or `ApiError` body)
 * into a consistent {@link ApiErrorShape}.
 *
 * @param err - The caught error.
 * @returns A normalized error object.
 */
export function normalizeError(err: unknown): ApiErrorShape {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<ApiError>;
    const body = ax.response?.data;
    if (body && body.success === false && body.error) {
      return {
        code: body.error.code,
        message: body.error.message,
        status: ax.response?.status,
        fields: body.error.fields,
      };
    }
    return {
      code: ax.code ?? 'NETWORK_ERROR',
      message: ax.message || 'Network request failed',
      status: ax.response?.status,
    };
  }
  if (err instanceof Error) {
    return { code: 'UNKNOWN', message: err.message };
  }
  return { code: 'UNKNOWN', message: 'Something went wrong' };
}

/* ─────────────────────────────────────────────
 * 3. Axios instance + interceptors
 * ───────────────────────────────────────────── */

/** The shared, pre-configured Axios instance. */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

/**
 * Request interceptor — attach the bearer token to every outgoing request.
 */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Guards against concurrent refresh attempts. */
let refreshPromise: Promise<AuthTokens> | null = null;

/**
 * Refresh the access token using the stored refresh token. Concurrent callers
 * share a single in-flight promise.
 *
 * @returns The new token pair.
 * @throws When the refresh endpoint rejects (caller should log out).
 */
async function refreshAccessToken(): Promise<AuthTokens> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();
      const { data } = await axios.post<ApiResponse<AuthTokens>>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
      );
      if (data.success) {
        setTokens(data.data);
        return data.data;
      }
      throw new Error('Token refresh failed');
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Response interceptor — on a 401, attempt a single token refresh and replay
 * the original request. Any other error is re-thrown for React Query to handle.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;

    if (status === 401 && original && !original._retry && getRefreshToken()) {
      original._retry = true;
      try {
        const tokens = await refreshAccessToken();
        if (original.headers) original.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return apiClient(original);
      } catch {
        clearTokens();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

/* ─────────────────────────────────────────────
 * 4. Generic request helpers
 * ───────────────────────────────────────────── */

/**
 * Unwrap an `ApiResponse<T>` envelope, throwing the normalized error on failure.
 *
 * @param promise - A promise resolving to an Axios response with an envelope.
 * @returns The unwrapped `data` payload.
 */
async function unwrap<T>(promise: Promise<AxiosResponse<ApiResponse<T>>>): Promise<T> {
  const { data } = await promise;
  if (data.success) return data.data;
  throw (data as ApiError).error;
}

/** GET helper that returns the unwrapped payload. */
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(apiClient.get<ApiResponse<T>>(url, config));
}

/** POST helper that returns the unwrapped payload. */
export async function apiPost<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(apiClient.post<ApiResponse<T>>(url, body, config));
}

/** PUT helper that returns the unwrapped payload. */
export async function apiPut<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(apiClient.put<ApiResponse<T>>(url, body, config));
}

/** DELETE helper that returns the unwrapped payload. */
export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return unwrap<T>(apiClient.delete<ApiResponse<T>>(url, config));
}

/* ─────────────────────────────────────────────
 * 5. Query keys (single source of truth)
 * ───────────────────────────────────────────── */

/** Centralized, hierarchical React Query keys for predictable invalidation. */
export const queryKeys = {
  all: ['jobezz'] as const,
  categories: () => [...queryKeys.all, 'categories'] as const,
  providers: (cat?: string) => [...queryKeys.all, 'providers', { cat }] as const,
  provider: (id: string) => [...queryKeys.all, 'provider', id] as const,
  jobs: (filters?: Record<string, unknown>) => [...queryKeys.all, 'jobs', { ...filters }] as const,
  job: (id: string) => [...queryKeys.all, 'job', id] as const,
  courses: () => [...queryKeys.all, 'courses'] as const,
  course: (id: string) => [...queryKeys.all, 'course', id] as const,
  chats: () => [...queryKeys.all, 'chats'] as const,
  notifications: () => [...queryKeys.all, 'notifications'] as const,
  invoices: () => [...queryKeys.all, 'invoices'] as const,
  applications: () => [...queryKeys.all, 'applications'] as const,
  postings: () => [...queryKeys.all, 'postings'] as const,
  applicants: (postingId?: string) => [...queryKeys.all, 'applicants', { postingId }] as const,
  me: () => [...queryKeys.all, 'me'] as const,
} as const;

/* ─────────────────────────────────────────────
 * 6. QueryClient (offline-first defaults)
 * ───────────────────────────────────────────── */

/**
 * The app-wide React Query client. Defaults are tuned for offline-first:
 *  - generous `staleTime` so cached data renders instantly
 *  - `retry: 2` with exponential backoff
 *  - keep previous data on refetch for smooth UX
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      gcTime: 1000 * 60 * 60 * 24, // 24 h cache retention (formerly cacheTime)
      retry: (failureCount, error) => {
        const status = (error as unknown as ApiErrorShape)?.status;
        // Don't retry 4xx client errors (except 408/429).
        if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000), // exponential backoff
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

/* ─────────────────────────────────────────────
 * 7. Offline fallbacks (seed from bundled data)
 * ───────────────────────────────────────────── */

/**
 * Wrap a network fetch so that, when offline or on failure, it returns bundled
 * seed data instead of throwing — delivering a true offline-first experience.
 *
 * @param fetcher  - The real network call.
 * @param fallback - Seed data to return when the network is unavailable.
 * @returns The network result, or the fallback on failure.
 */
async function withOfflineFallback<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetcher();
  } catch {
    return fallback;
  }
}

/* ─────────────────────────────────────────────
 * 8. Query hooks — reads
 * ───────────────────────────────────────────── */

/** Fetch + cache service categories. */
export function useCategories(options?: UseQueryOptions<Category[], ApiErrorShape>) {
  return useQuery<Category[], ApiErrorShape>({
    queryKey: queryKeys.categories(),
    queryFn: () => withOfflineFallback(() => apiGet<Category[]>('/categories'), CATEGORIES as Category[]),
    ...options,
  });
}

/** Fetch + cache providers, optionally filtered by category. */
export function useProviders(category?: string, options?: UseQueryOptions<Provider[], ApiErrorShape>) {
  return useQuery<Provider[], ApiErrorShape>({
    queryKey: queryKeys.providers(category),
    queryFn: () =>
      withOfflineFallback(
        () => apiGet<Provider[]>('/providers', { params: { category } }),
        PROVIDERS as Provider[],
      ),
    ...options,
  });
}

/** Fetch + cache a single provider by id. */
export function useProvider(id: string, options?: UseQueryOptions<Provider, ApiErrorShape>) {
  return useQuery<Provider, ApiErrorShape>({
    queryKey: queryKeys.provider(id),
    queryFn: () => apiGet<Provider>(`/providers/${id}`),
    enabled: !!id,
    ...options,
  });
}

/** Fetch + cache job listings with optional filters. */
export function useJobs(filters?: Record<string, unknown>, options?: UseQueryOptions<Job[], ApiErrorShape>) {
  return useQuery<Job[], ApiErrorShape>({
    queryKey: queryKeys.jobs(filters),
    queryFn: () => withOfflineFallback(() => apiGet<Job[]>('/jobs', { params: filters }), JOBS as Job[]),
    ...options,
  });
}

/** Fetch + cache a single job by id. */
export function useJob(id: string, options?: UseQueryOptions<Job, ApiErrorShape>) {
  return useQuery<Job, ApiErrorShape>({
    queryKey: queryKeys.job(id),
    queryFn: () => apiGet<Job>(`/jobs/${id}`),
    enabled: !!id,
    ...options,
  });
}

/** Fetch + cache courses. */
export function useCourses(options?: UseQueryOptions<Course[], ApiErrorShape>) {
  return useQuery<Course[], ApiErrorShape>({
    queryKey: queryKeys.courses(),
    queryFn: () => withOfflineFallback(() => apiGet<Course[]>('/courses'), COURSES as Course[]),
    ...options,
  });
}

/** Fetch + cache a single course by id. */
export function useCourse(id: string, options?: UseQueryOptions<Course, ApiErrorShape>) {
  return useQuery<Course, ApiErrorShape>({
    queryKey: queryKeys.course(id),
    queryFn: () => apiGet<Course>(`/courses/${id}`),
    enabled: !!id,
    ...options,
  });
}

/** Fetch + cache chat threads. */
export function useChats(options?: UseQueryOptions<Chat[], ApiErrorShape>) {
  return useQuery<Chat[], ApiErrorShape>({
    queryKey: queryKeys.chats(),
    queryFn: () => withOfflineFallback(() => apiGet<Chat[]>('/chats'), CHATS as Chat[]),
    ...options,
  });
}

/** Fetch + cache notifications. */
export function useNotifications(options?: UseQueryOptions<Notification[], ApiErrorShape>) {
  return useQuery<Notification[], ApiErrorShape>({
    queryKey: queryKeys.notifications(),
    queryFn: () => withOfflineFallback(() => apiGet<Notification[]>('/notifications'), NOTIFS as Notification[]),
    ...options,
  });
}

/** Fetch + cache invoices. */
export function useInvoices(options?: UseQueryOptions<Invoice[], ApiErrorShape>) {
  return useQuery<Invoice[], ApiErrorShape>({
    queryKey: queryKeys.invoices(),
    queryFn: () => withOfflineFallback(() => apiGet<Invoice[]>('/invoices'), INVOICES as Invoice[]),
    ...options,
  });
}

/** Fetch + cache the current user's applications. */
export function useApplications(options?: UseQueryOptions<MyApplication[], ApiErrorShape>) {
  return useQuery<MyApplication[], ApiErrorShape>({
    queryKey: queryKeys.applications(),
    queryFn: () =>
      withOfflineFallback(() => apiGet<MyApplication[]>('/applications'), MY_APPLICATIONS as MyApplication[]),
    ...options,
  });
}

/** Fetch + cache the current employer's job postings. */
export function usePostings(options?: UseQueryOptions<JobPosting[], ApiErrorShape>) {
  return useQuery<JobPosting[], ApiErrorShape>({
    queryKey: queryKeys.postings(),
    queryFn: () => withOfflineFallback(() => apiGet<JobPosting[]>('/postings'), MY_POSTINGS as JobPosting[]),
    ...options,
  });
}

/** Fetch + cache applicants for a posting. */
export function useApplicants(postingId?: string, options?: UseQueryOptions<Applicant[], ApiErrorShape>) {
  return useQuery<Applicant[], ApiErrorShape>({
    queryKey: queryKeys.applicants(postingId),
    queryFn: () =>
      withOfflineFallback(
        () => apiGet<Applicant[]>('/applicants', { params: { postingId } }),
        APPLICANTS as Applicant[],
      ),
    ...options,
  });
}

/* ─────────────────────────────────────────────
 * 9. Mutation hooks — writes
 * ───────────────────────────────────────────── */

/**
 * Authenticate with phone + password/OTP. Persists tokens on success.
 */
export function useLogin(options?: UseMutationOptions<LoginResponse, ApiErrorShape, LoginRequest>) {
  return useMutation<LoginResponse, ApiErrorShape, LoginRequest>({
    mutationFn: async (payload) => {
      const res = await apiPost<LoginResponse, LoginRequest>('/auth/login', payload);
      setTokens(res.tokens);
      return res;
    },
    onError: (e) => normalizeError(e),
    ...options,
  });
}

/** Log out: clear tokens and invalidate all cached queries. */
export function useLogout(options?: UseMutationOptions<void, ApiErrorShape, void>) {
  const qc = useQueryClient();
  return useMutation<void, ApiErrorShape, void>({
    mutationFn: async () => {
      try {
        await apiPost('/auth/logout');
      } finally {
        clearTokens();
      }
    },
    onSuccess: () => qc.removeQueries({ queryKey: queryKeys.all }),
    ...options,
  });
}

/** Apply to a job. */
export function useApplyToJob(options?: UseMutationOptions<void, ApiErrorShape, { jobId: string }>) {
  const qc = useQueryClient();
  return useMutation<void, ApiErrorShape, { jobId: string }>({
    mutationFn: ({ jobId }) => apiPost<void>(`/jobs/${jobId}/apply`),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.applications() }),
    ...options,
  });
}

/**
 * Save / unsave a job with an OPTIMISTIC update. The UI toggles immediately and
 * rolls back automatically if the server request fails.
 *
 * @returns The React Query mutation.
 */
export function useToggleSaveJob() {
  const qc = useQueryClient();

  return useMutation<void, ApiErrorShape, { jobId: string; saved: boolean }>({
    // Optimistic update happens in onMutate; the server call is the mutationFn.
    mutationFn: ({ jobId, saved }) =>
      saved ? apiDelete<void>(`/jobs/${jobId}/save`) : apiPost<void>(`/jobs/${jobId}/save`),

    onMutate: async ({ jobId, saved }) => {
      const key = queryKeys.job(jobId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<Job>(key);
      // Optimistically patch the cached job (using a `saved` flag if present).
      if (previous) {
        qc.setQueryData<Job & { saved?: boolean }>(key, { ...previous, saved: !saved });
      }
      return { previous, key };
    },

    onError: (_err, _vars, context: any) => {
      // Roll back to the previous cache snapshot.
      if (context?.previous) qc.setQueryData(context.key, context.previous);
    },

    onSettled: (_data, _err, { jobId }) => {
      void qc.invalidateQueries({ queryKey: queryKeys.job(jobId) });
    },
  });
}

/** Update the current user's profile (optimistic). */
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation<User, ApiErrorShape, Partial<User>>({
    mutationFn: (patch) => apiPut<User, Partial<User>>('/me', patch),
    onMutate: async (patch) => {
      const key = queryKeys.me();
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<User>(key);
      if (previous) qc.setQueryData<User>(key, { ...previous, ...patch });
      return { previous, key };
    },
    onError: (_e, _v, ctx: any) => {
      if (ctx?.previous) qc.setQueryData(ctx.key, ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.me() }),
  });
}

/* ─────────────────────────────────────────────
 * 10. Re-exports
 * ───────────────────────────────────────────── */

export { useQuery, useMutation, useQueryClient };
export type { UseQueryOptions, UseMutationOptions };
