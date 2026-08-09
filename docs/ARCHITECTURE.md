# JobEzz — Architecture & Technical Documentation

> البنية التقنية الكاملة لمنصة JobEzz

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Schema](#database-schema)
5. [Real-time Infrastructure](#real-time-infrastructure)
6. [Security](#security)
7. [Performance](#performance)
8. [Deployment](#deployment)
9. [Monitoring](#monitoring)

---

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Android    │  │     iOS     │  │      Web (PWA)          │  │
│  │  (Expo/RN)  │  │  (Expo/RN)  │  │  (Vanilla JS + PWA)     │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                      │                │
│         └────────────────┴──────────────────────┘                │
│                          │                                       │
│                    ┌─────▼─────┐                                 │
│                    │  API GW   │                                 │
│                    │ (Kong/    │                                 │
│                    │  Nginx)   │                                 │
│                    └─────┬─────┘                                 │
└──────────────────────────┼──────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────────┐
│                    SERVICE LAYER                                 │
├──────────────────────────┼──────────────────────────────────────┤
│                          │                                       │
│  ┌──────────┐  ┌─────────▼────────┐  ┌──────────────────────┐   │
│  │  Auth    │  │   Core API       │  │   Real-time          │   │
│  │ Service  │  │   (Node.js/      │  │   (WebSocket/        │   │
│  │ (OTP)    │  │    Express)      │  │    Socket.io)        │   │
│  └──────────┘  └──────────────────┘  └──────────────────────┘   │
│                                                                  │
│  ┌──────────┐  ┌──────────────────┐  ┌──────────────────────┐   │
│  │ Payment  │  │  Notification    │  │   Search             │   │
│  │ Service  │  │  Service         │  │   (Elasticsearch)    │   │
│  └──────────┘  └──────────────────┘  └──────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────────┐
│                    DATA LAYER                                    │
├──────────────────────────┼──────────────────────────────────────┤
│                          │                                       │
│  ┌──────────┐  ┌─────────▼────────┐  ┌──────────────────────┐   │
│  │PostgreSQL│  │     Redis        │  │   S3/MinIO           │   │
│  │(Supabase)│  │   (Cache/        │  │   (File Storage)     │   │
│  │          │  │    Sessions)     │  │                      │   │
│  └──────────┘  └──────────────────┘  └──────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📱 Frontend Architecture

### Web Prototype (PWA)

```
web-prototype/
├── index.html                 # Main app entry
├── admin.html                 # Admin dashboard
├── manifest-legendary.json    # PWA manifest
├── sw-legendary.js            # Service Worker
├── assets/
│   ├── css/
│   │   ├── style-legendary.css    # Design System v3.0
│   │   └── admin-legendary.css    # Admin styles
│   ├── js/
│   │   ├── app-legendary.js       # Main app logic
│   │   ├── animations-legendary.js # Animation engine
│   │   ├── admin-legendary.js     # Admin logic
│   │   ├── data.js                # Mock data
│   │   └── icons.js               # SVG icons
│   └── img/                       # Images
└── docs/                          # Documentation
```

### Key Features

| Feature | Implementation |
|---------|----------------|
| **State Management** | Custom Store pattern with pub/sub |
| **Routing** | Hash-based routing with history API |
| **Animations** | Spring physics, 3D transforms, parallax |
| **PWA** | Service Worker, Background Sync, Push |
| **Offline** | IndexedDB, Cache API, optimistic UI |
| **Accessibility** | ARIA, keyboard nav, reduced motion |
| **i18n** | RTL/LTR, ar/en translations |

### Android App (React Native)

```
android-app/
├── App.tsx                    # Root component
├── src/
│   ├── types.ts               # TypeScript types
│   ├── store.tsx              # Zustand store
│   ├── theme.ts               # Light/dark themes
│   ├── i18n.ts                # Translations
│   ├── animations.ts          # Reanimated 3
│   ├── hooks.ts               # Custom hooks
│   ├── api.ts                 # React Query
│   ├── navigation.tsx         # Navigation config
│   ├── utils.ts               # Utilities
│   ├── ErrorBoundary.tsx      # Error handling
│   ├── components/
│   │   └── AnimatedComponents.tsx
│   └── screens/
│       ├── Core.tsx
│       └── More.tsx
└── package.json
```

### Key Libraries

| Library | Purpose |
|---------|---------|
| `react-native-reanimated` | 60fps animations |
| `react-native-gesture-handler` | Native gestures |
| `@shopify/react-native-skia` | 2D graphics |
| `react-native-mmkv` | Fast storage |
| `@tanstack/react-query` | Server state |
| `zustand` | Client state |
| `expo-haptics` | Haptic feedback |
| `expo-av` | Sound effects |
| `sentry-expo` | Error monitoring |

---

## 🖥️ Backend Architecture

### Recommended Stack: Supabase

```
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Auth     │  │  Database   │  │     Realtime        │  │
│  │  (Phone     │  │ (PostgreSQL │  │   (WebSocket)       │  │
│  │   OTP)      │  │  + RLS)     │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Storage    │  │   Edge      │  │   Vector            │  │
│  │  (S3-like)  │  │  Functions  │  │   (pgvector)        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Why Supabase?

| Feature | Benefit |
|---------|---------|
| **Phone OTP Auth** | Built-in Libyan phone support |
| **PostgreSQL** | Relational data + JSON flexibility |
| **Row Level Security** | Database-level access control |
| **Realtime** | WebSocket channels out of the box |
| **Storage** | CVs, certificates, images |
| **Edge Functions** | Serverless compute (Deno) |
| **Auto-generated API** | REST + GraphQL instantly |

### API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full reference.

---

## 🗄️ Database Schema

### Core Tables

```sql
-- Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  city VARCHAR(50),
  bio TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  wallet_balance DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Roles (many-to-many)
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- customer, jobseeker, employer, provider, instructor, student
  PRIMARY KEY (user_id, role)
);

-- Service Categories
CREATE TABLE service_categories (
  id VARCHAR(50) PRIMARY KEY,
  name_ar VARCHAR(50) NOT NULL,
  name_en VARCHAR(50) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  mode VARCHAR(20) NOT NULL, -- instant, quote
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- Service Providers
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id VARCHAR(50) REFERENCES service_categories(id),
  description TEXT,
  price_per_hour DECIMAL(10,2),
  service_radius_km INTEGER DEFAULT 10,
  is_available BOOLEAN DEFAULT TRUE,
  current_lat DECIMAL(10,8),
  current_lng DECIMAL(10,8),
  completed_jobs INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Requests
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES providers(id),
  category_id VARCHAR(50) REFERENCES service_categories(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, searching, accepted, en_route, in_progress, completed, cancelled
  description TEXT,
  location_lat DECIMAL(10,8) NOT NULL,
  location_lng DECIMAL(10,8) NOT NULL,
  location_address TEXT,
  images TEXT[], -- array of URLs
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  final_price DECIMAL(10,2),
  rating INTEGER, -- 1-5
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES users(id),
  company_name VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  location VARCHAR(50),
  job_type VARCHAR(20), -- full_time, part_time, remote, contract
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active', -- active, closed, expired
  applicants_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES users(id),
  cv_url TEXT NOT NULL,
  cover_letter TEXT,
  status VARCHAR(20) DEFAULT 'applied', -- applied, review, shortlisted, rejected, accepted
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  level VARCHAR(20), -- beginner, intermediate, advanced
  price DECIMAL(10,2) DEFAULT 0,
  thumbnail_url TEXT,
  duration_hours INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  students_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Lessons
CREATE TABLE course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  section VARCHAR(100),
  title VARCHAR(200) NOT NULL,
  content_type VARCHAR(20), -- video, text, quiz
  content_url TEXT,
  duration_minutes INTEGER,
  sort_order INTEGER,
  is_free BOOLEAN DEFAULT FALSE
);

-- Course Enrollments
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id),
  progress_percent INTEGER DEFAULT 0,
  completed_lessons UUID[], -- array of lesson IDs
  certificate_url TEXT,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Payments & Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  type VARCHAR(30) NOT NULL, -- service_payment, course_payment, withdrawal, refund, commission
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'LYD',
  reference_id UUID,
  reference_type VARCHAR(30), -- service_request, course, withdrawal
  payment_method VARCHAR(30), -- wallet, cash, bank_transfer, card
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1 UUID REFERENCES users(id),
  participant_2 UUID REFERENCES users(id),
  reference_id UUID, -- service_request or job ID
  reference_type VARCHAR(30),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- text, image, file, system
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  type VARCHAR(30), -- service, job, course, payment, system
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews & Ratings
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID REFERENCES users(id),
  reviewee_id UUID REFERENCES users(id),
  service_request_id UUID REFERENCES service_requests(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disputes
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  raised_by UUID REFERENCES users(id),
  against UUID REFERENCES users(id),
  service_request_id UUID REFERENCES service_requests(id),
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open', -- open, investigating, resolved, closed
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
  resolution TEXT,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
```

### Indexes

```sql
-- Performance indexes
CREATE INDEX idx_providers_category ON providers(category_id) WHERE is_available = TRUE;
CREATE INDEX idx_providers_location ON providers USING GIST (
  ll_to_earth(current_lat, current_lng)
);
CREATE INDEX idx_service_requests_status ON service_requests(status) WHERE status != 'completed';
CREATE INDEX idx_jobs_status ON jobs(status) WHERE status = 'active';
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_transactions_user ON transactions(user_id, created_at DESC);
```

### Row Level Security

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
-- ... etc

-- Policies
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Customers can view own requests"
  ON service_requests FOR SELECT
  USING (
    customer_id = auth.uid() OR
    provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
  );

CREATE POLICY "Providers can update assigned requests"
  ON service_requests FOR UPDATE
  USING (
    provider_id IN (SELECT id FROM providers WHERE user_id = auth.uid())
  );
```

---

## ⚡ Real-time Infrastructure

### WebSocket Channels

```javascript
// Supabase Realtime channels
const channels = {
  // Service request updates
  serviceRequest: (id) => `service_request:${id}`,

  // Provider location updates
  providerLocation: (providerId) => `provider_location:${providerId}`,

  // Chat messages
  chat: (conversationId) => `chat:${conversationId}`,

  // Notifications
  notifications: (userId) => `notifications:${userId}`,

  // Admin dashboard
  adminAnalytics: 'admin:analytics'
};
```

### Event Types

```typescript
// Service Request Events
type ServiceRequestEvent =
  | { type: 'status_changed'; status: string }
  | { type: 'provider_assigned'; provider: Provider }
  | { type: 'location_updated'; lat: number; lng: number }
  | { type: 'price_updated'; price: number };

// Chat Events
type ChatEvent =
  | { type: 'message_sent'; message: Message }
  | { type: 'message_read'; messageIds: string[] }
  | { type: 'typing'; userId: string };

// Notification Events
type NotificationEvent =
  | { type: 'new_notification'; notification: Notification }
  | { type: 'notifications_read'; count: number };
```

---

## 🔒 Security

### Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │────▶│  App    │────▶│ Supabase│────▶│  SMS    │
│         │     │         │     │  Auth   │     │ Gateway │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │               │               │               │
     │  1. Enter     │               │               │
     │     phone     │               │               │
     │──────────────▶│               │               │
     │               │  2. Send OTP  │               │
     │               │──────────────▶│               │
     │               │               │  3. Send SMS  │
     │               │               │──────────────▶│
     │               │               │               │
     │  4. Receive   │               │               │
     │     OTP       │               │               │
     │◀──────────────────────────────────────────────│
     │               │               │               │
     │  5. Enter OTP │               │               │
     │──────────────▶│               │               │
     │               │  6. Verify    │               │
     │               │──────────────▶│               │
     │               │               │               │
     │               │  7. JWT Token │               │
     │               │◀──────────────│               │
     │               │               │               │
     │  8. Logged in │               │               │
     │◀──────────────│               │               │
```

### Security Measures

| Layer | Measure |
|-------|---------|
| **Transport** | HTTPS/TLS 1.3 everywhere |
| **Authentication** | Phone OTP + JWT (15min access, 7d refresh) |
| **Authorization** | Row Level Security (RLS) in PostgreSQL |
| **Input Validation** | Zod schemas on client + server |
| **Rate Limiting** | 100 req/min per user, 1000/min per IP |
| **CORS** | Whitelist specific origins |
| **CSP** | Strict Content Security Policy |
| **Storage** | Signed URLs for file access (1hr expiry) |
| **Secrets** | Environment variables, never in code |
| **Monitoring** | Sentry for errors, audit logs for admin |

---

## 🚀 Performance

### Web Performance Budget

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |
| First Input Delay | < 100ms |

### Optimization Strategies

1. **Code Splitting**: Lazy load admin dashboard
2. **Image Optimization**: WebP/AVIF, responsive srcset
3. **Caching**: Service Worker + HTTP cache headers
4. **CDN**: Static assets on Cloudflare/CloudFront
5. **Compression**: Brotli for text, gzip fallback
6. **Preloading**: Critical resources, fonts, hero images
7. **Virtual Scrolling**: For long lists (jobs, providers)
8. **Debouncing**: Search input (300ms)
9. **Memoization**: React.memo, useMemo, useCallback

### Database Performance

- Connection pooling (PgBouncer)
- Query optimization with EXPLAIN ANALYZE
- Materialized views for analytics
- Read replicas for heavy reads
- Partitioning for large tables (transactions, messages)

---

## 📦 Deployment

### Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                      PRODUCTION                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Vercel/    │  │  Supabase   │  │   Cloudflare        │  │
│  │  Netlify    │  │  (Managed)  │  │   (CDN + WAF)       │  │
│  │  (Web PWA)  │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  EAS Build  │  │  Sentry     │  │   PostHog           │  │
│  │  (Mobile)   │  │  (Errors)   │  │   (Analytics)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build with EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform android --non-interactive
```

### Environment Variables

```bash
# .env.production
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SENTRY_DSN=https://...@sentry.io/...
POSTHOG_KEY=phc_...
EXPO_PUBLIC_API_URL=https://api.jobezz.ly
```

---

## 📊 Monitoring

### Error Tracking (Sentry)

```typescript
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: false,
  tracesSampleRate: 1.0,
  environment: __DEV__ ? 'development' : 'production'
});

// Capture errors
Sentry.captureException(error);

// Breadcrumbs
Sentry.addBreadcrumb({
  category: 'navigation',
  message: 'Navigated to Services',
  level: 'info'
});
```

### Analytics (PostHog)

```typescript
import PostHog from 'posthog-react-native';

// Track events
posthog.capture('service_requested', {
  category: 'plumber',
  mode: 'instant',
  location: 'بنغازي'
});

// Identify users
posthog.identify(userId, {
  name: userName,
  roles: userRoles
});
```

### Health Checks

```typescript
// /health endpoint
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    storage: await checkStorage()
  };

  const healthy = Object.values(checks).every(c => c.status === 'ok');

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks
  });
});
```

---

## 📈 Scaling Strategy

### Phase 1: MVP (0-10K users)
- Supabase Free/Pro tier
- Vercel Hobby/Pro
- Single region (EU-West)

### Phase 2: Growth (10K-100K users)
- Supabase Team tier
- Read replicas
- CDN for static assets
- Redis for caching

### Phase 3: Scale (100K+ users)
- Dedicated PostgreSQL
- Kubernetes cluster
- Multi-region deployment
- Microservices architecture
- Message queue (RabbitMQ/Kafka)

---

## 📚 Additional Resources

- [Design System Documentation](./DESIGN_SYSTEM.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Project Brief](../web-prototype/docs/00_project_brief.md)
- [Information Architecture](../web-prototype/docs/02_information_architecture.md)

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | 2026-07-20 | Legendary Edition: Full architecture docs |
| 2.0 | 2026-07-15 | Added database schema, security section |
| 1.0 | 2026-07-01 | Initial architecture |
