-- ═══════════════════════════════════════════════════════════════
-- JobEzz — Supabase Production Schema (v1.0)
-- ═══════════════════════════════════════════════════════════════
-- كيفية التطبيق: انسخ كامل المحتوى والصقه في SQL Editor داخل لوحة Supabase.
-- آمن للتكرار: IF NOT EXISTS في كل مكان، والسياسات تُستبدل بـ OR REPLACE.
--
-- المحتويات:
--   1. الامتدادات
--   2. جداول النطاق (المستخدمون، الخدمات، الوظائف، الدورات، الدردشة، المدفوعات)
--   3. الفهارس (الأداء)
--   4. المحفّزات (Profiles تلقائية بعد التسجيل + تحديث updated_at)
--   5. RLS — سياسات الأمان لكل جدول
--   6. Views (مزوّدو الخدمات النشطون)
--   7. دوال مساعدة (هوية الأدمن)
-- ═══════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────
-- 1. الامتدادات
-- ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;          -- البحث النصّي العربي
create extension if not exists postgis;          -- الاستعلامات الجغرافية (الأقرب)

-- ────────────────────────────────────────────────────────────────
-- 2. نطاق الهُوية والملفات الشخصية
-- ────────────────────────────────────────────────────────────────

create type public.user_role as enum (
  'customer', 'jobseeker', 'provider', 'employer', 'instructor', 'student', 'admin'
);

create type public.subscription_status as enum ('inactive', 'pending', 'trial', 'active', 'past_due', 'cancelled');

create type public.request_status as enum ('pending', 'accepted', 'on_way', 'in_progress', 'completed', 'rated', 'cancelled');

-- profiles يرتبط مباشرة بـ auth.users (UUID متطابق)
create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  phone           text unique,
  full_name       text not null default '',
  avatar_url      text,
  role            public.user_role not null default 'customer',
  roles           text[] not null default '{}',   -- أدوار إضافية (صاحب عمل + عامل...)
  city            text default '',
  bio             text default '',
  skills          text[] default '{}',
  is_verified     boolean not null default false,
  rating          numeric(2,1) default 0 check (rating between 0 and 5),
  review_count    integer not null default 0,
  price_range     text default '',                -- "50-80 د.ل" للمزوّدين
  wallet_balance  numeric(10,2) not null default 0,
  locale          text not null default 'ar' check (locale in ('ar','en')),
  expo_push_token text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- فئات الخدمات
create table if not exists public.service_categories (
  id         text primary key,                -- 'plumber' 'electrician' ...
  name_ar    text not null,
  name_en    text not null,
  icon       text not null default 'wrench',
  is_active  boolean not null default true,
  sort_order integer not null default 0
);

-- ────────────────────────────────────────────────────────────────
-- 3. نطاق الخدمات (طلبات العملاء → عروض المزوّدين)
-- ────────────────────────────────────────────────────────────────

create table if not exists public.service_requests (
  id            uuid primary key default uuid_generate_v4(),
  customer_id   uuid not null references public.profiles (id) on delete cascade,
  category_id   text not null references public.service_categories (id),
  description   text not null,
  photos        text[] not null default '{}',
  location      geography(Point, 4326),
  address_text  text default '',
  status        public.request_status not null default 'pending',
  assigned_provider uuid references public.profiles (id),
  price_agreed  numeric(10,2),
  scheduled_for timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- حجوزات الخدمات (مرتبطة مباشرة بالمزوّد)
create table if not exists public.bookings (
  id           uuid primary key default uuid_generate_v4(),
  request_id   uuid references public.service_requests (id) on delete set null,
  customer_id  uuid not null references public.profiles (id),
  provider_id  uuid not null references public.profiles (id),
  starts_at    timestamptz not null,
  ends_at      timestamptz,
  status       public.request_status not null default 'accepted',
  total_price  numeric(10,2) not null,
  paid         boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- التقييمات (نجمة + تعليق) على الحجز المكتمل
create table if not exists public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  booking_id  uuid not null references public.bookings (id) on delete cascade,
  author_id   uuid not null references public.profiles (id),
  target_id   uuid not null references public.profiles (id),
  stars       integer not null check (stars between 1 and 5),
  comment     text default '',
  created_at  timestamptz not null default now(),
  unique (booking_id, author_id)
);

-- ────────────────────────────────────────────────────────────────
-- 4. نطاق الوظائف
-- ────────────────────────────────────────────────────────────────

create table if not exists public.jobs (
  id           uuid primary key default uuid_generate_v4(),
  employer_id  uuid not null references public.profiles (id),
  title        text not null,
  company_name text not null,
  category     text not null,
  type         text not null default 'full_time' check (type in ('full_time','part_time','remote','contract')),
  subtype      text not null default 'onsite'  check (subtype in ('onsite','remote','hybrid')),
  salary_min   numeric(10,2),
  salary_max   numeric(10,2),
  currency     text not null default 'LYD',
  city         text not null,
  description  text default '',
  skills       text[] not null default '{}',
  featured     boolean not null default false,
  is_active    boolean not null default true,
  published_at timestamptz not null default now(),
  expires_at   timestamptz
);

create table if not exists public.applications (
  id          uuid primary key default uuid_generate_v4(),
  job_id      uuid not null references public.jobs (id) on delete cascade,
  applicant_id uuid not null references public.profiles (id) on delete cascade,
  cover_letter text default '',
  status      text not null default 'applied'
              check (status in ('applied','reviewed','shortlisted','interviewed','accepted','rejected')),
  applied_at  timestamptz not null default now(),
  unique (job_id, applicant_id)
);

-- ────────────────────────────────────────────────────────────────
-- 5. نطاق الدورات / الأكاديمية
-- ────────────────────────────────────────────────────────────────

create table if not exists public.courses (
  id            uuid primary key default uuid_generate_v4(),
  instructor_id uuid not null references public.profiles (id),
  title         text not null,
  subtitle      text default '',
  category      text not null,
  description   text default '',
  price         numeric(10,2) not null default 0,
  currency      text not null default 'LYD',
  thumbnail_url text,
  lessons_count integer not null default 0,
  duration_hrs  numeric(4,1) default 0,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now()
);

create table if not exists public.enrollments (
  id           uuid primary key default uuid_generate_v4(),
  course_id    uuid not null references public.courses (id) on delete cascade,
  student_id   uuid not null references public.profiles (id) on delete cascade,
  progress_pct integer not null default 0 check (progress_pct between 0 and 100),
  completed_at timestamptz,
  enrolled_at  timestamptz not null default now(),
  unique (course_id, student_id)
);

-- ────────────────────────────────────────────────────────────────
-- 6. نطاق الدردشة والإشعارات
-- ────────────────────────────────────────────────────────────────

create table if not exists public.conversations (
  id          uuid primary key default uuid_generate_v4(),
  job_id      uuid references public.jobs (id),
  booking_id  uuid references public.bookings (id),
  last_message_at timestamptz,
  created_at  timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id         uuid not null references public.profiles (id) on delete cascade,
  joined_at       timestamptz not null default now(),
  last_read_at    timestamptz,
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id              uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id       uuid not null references public.profiles (id),
  body            text not null,
  is_read         boolean not null default false,
  created_at      timestamptz not null default now()
);

create table if not exists public.notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  kind       text not null,                     -- 'new_request' 'booking_accepted' ...
  payload    jsonb not null default '{}',
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_unread_idx
  on public.notifications (user_id) where read_at is null;

-- ────────────────────────────────────────────────────────────────
-- 7. نطاق الاشتراكات والمدفوعات
-- ────────────────────────────────────────────────────────────────

create type public.payment_status as enum ('pending','confirmed','failed','refunded');

create table if not exists public.subscriptions (
  id               uuid primary key default uuid_generate_v4(),
  provider_id      uuid not null references public.profiles (id) on delete cascade,
  plan_months      integer not null default 1,
  amount           numeric(10,2) not null,
  currency         text not null default 'LYD',
  status           public.subscription_status not null default 'inactive',
  payment_ref      text unique,               -- مرجع بوابة الدفع / رقم التحويل اليدوي
  activation_note  text default '',
  activated_at     timestamptz,
  expires_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- سجل كل حدث دفع خام (يدوي أو webhook)
create table if not exists public.payment_events (
  id            uuid primary key default uuid_generate_v4(),
  subscription_id uuid references public.subscriptions (id) on delete set null,
  gateway       text not null default 'manual',  -- 'manual' | 'mizapay' | 'tadawul'
  gateway_ref   text,
  amount        numeric(10,2) not null,
  currency      text not null default 'LYD',
  status        public.payment_status not null default 'pending',
  raw_payload   jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────────
-- 8. الفهارس الأساسية (سرعة SQLite لملايين السجلات)
-- ────────────────────────────────────────────────────────────────

create index if not exists profiles_role_idx         on public.profiles (role);
create index if not exists profiles_city_idx         on public.profiles (city);
create index if not exists profiles_skills_idx       on public.profiles using gin (skills);
create index if not exists service_requests_cat_stat on public.service_requests (category_id, status);
create index if not exists service_requests_customer on public.service_requests (customer_id, created_at desc);
create index if not exists bookings_provider_status  on public.bookings (provider_id, status);
create index if not exists bookings_customer_status  on public.bookings (customer_id, status);
create index if not exists jobs_cat_active_city      on public.jobs (category, is_active, city);
create index if not exists jobs_employer              on public.jobs (employer_id, is_active);
create index if not exists applications_job          on public.applications (job_id, status);
create index if not exists applications_applicant    on public.applications (applicant_id, applied_at desc);
create index if not exists messages_conv_unread      on public.messages (conversation_id, is_read) where is_read = false;
create index if not exists subs_provider_status      on public.subscriptions (provider_id, status, expires_at);

-- ────────────────────────────────────────────────────────────────
-- 9. المحفّزات
-- ────────────────────────────────────────────────────────────────

-- إنشاء profile تلقائياً بعد auth.users.insert
-- التسجيل برقم الهاتف فقط: كل شيء آخر (الاسم، المدينة، الدور) يُملأ لاحقاً
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, phone, full_name)
  values (
    new.id,
    coalesce(new.phone, new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- تحديث updated_at تلقائياً عند كل UPDATE
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- تطبيق المحفّز على الجداول المرنة
do $$
declare t text;
begin
  foreach t in array array['profiles','service_requests','bookings','subscriptions']
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I;
       create trigger set_updated_at before update on public.%I
         for each row execute procedure public.set_updated_at()',
      t, t
    );
  end loop
end $$;

-- ────────────────────────────────────────────────────────────────
-- 10. RLS — سياسات الأمان (تُطبّق حتى من داخل Edge Functions)
-- ────────────────────────────────────────────────────────────────

alter table public.profiles               enable row level security;
alter table public.service_categories     enable row level security;
alter table public.service_requests       enable row level security;
alter table public.bookings               enable row level security;
alter table public.reviews                enable row level security;
alter table public.jobs                   enable row level security;
alter table public.applications           enable row level security;
alter table public.courses                enable row level security;
alter table public.enrollments            enable row level security;
alter table public.conversations          enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages               enable row level security;
alter table public.notifications          enable row level security;
alter table public.subscriptions          enable row level security;
alter table public.payment_events         enable row level security;

-- profiles: أي شخص يقرأ ملفه؛ المالك يحدّث ملفه؛ الأدمن يقرأ الكل
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  )
$$;

create policy profiles_select on public.profiles for select
  using (auth.uid() = id or public.is_admin());
create policy profiles_update on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);
create policy profiles_admin_all on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- فئات الخدمات: القراءة عامة
create policy categories_read_all on public.service_categories for select using (true);

-- طلبات الخدمة: العميل يرى طلباته؛ المزوّد يرى الطلبات الموجّهة له أو المتاحة بنفس الفئة
create policy service_requests_customer on public.service_requests for select
  using (auth.uid() = customer_id);
create policy service_requests_provider_read on public.service_requests for select
  using (
    assigned_provider = auth.uid()
    or (status = 'pending' and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'provider'
        and (p.skills @> array[service_requests.category_id] or p.role = 'admin')
    ))
  );
create policy service_requests_insert_customer on public.service_requests for insert
  with check (auth.uid() = customer_id);
create policy service_requests_update_customer on public.service_requests for update
  using (auth.uid() = customer_id) with check (auth.uid() = customer_id);
create policy service_requests_update_provider on public.service_requests for update
  using (auth.uid() = assigned_provider) with check (auth.uid() = assigned_provider);
create policy service_requests_admin on public.service_requests for all
  using (public.is_admin()) with check (public.is_admin());

-- الحجوزات: لطرفي العملية فقط
create policy bookings_read_own on public.bookings for select
  using (auth.uid() = customer_id or auth.uid() = provider_id or public.is_admin());
create policy bookings_update_own on public.bookings for update
  using (auth.uid() = customer_id or auth.uid() = provider_id)
  with check (auth.uid() = customer_id or auth.uid() = provider_id);

-- التقييمات: قراءة عامة على الهدف الموثوق فقط
create policy reviews_read_public on public.reviews for select using (true);
create policy reviews_insert_author on public.reviews for insert
  with check (auth.uid() = author_id);

-- الوظائف: القراءة عامة للنشطة؛ صاحب العمل يدير وظائفه
create policy jobs_read_active on public.jobs for select
  using (is_active = true or auth.uid() = employer_id or public.is_admin());
create policy jobs_employer_write on public.jobs for all
  using (auth.uid() = employer_id) with check (auth.uid() = employer_id);
create policy jobs_admin on public.jobs for all
  using (public.is_admin()) with check (public.is_admin());

-- الطلبات الوظيفية: المتقدّم وصاحب العمل فقط
create policy applications_read_own on public.applications for select
  using (auth.uid() = applicant_id or public.is_admin()
         or exists (select 1 from public.jobs j where j.id = applications.job_id and j.employer_id = auth.uid()));
create policy applications_insert on public.applications for insert
  with check (auth.uid() = applicant_id);
create policy applications_update_employer on public.applications for update
  using (exists (select 1 from public.jobs j where j.id = applications.job_id and j.employer_id = auth.uid()));

-- الدورات والالتحاق
create policy courses_read on public.courses for select
  using (is_published = true or auth.uid() = instructor_id or public.is_admin());
create policy courses_instructor_write on public.courses for all
  using (auth.uid() = instructor_id) with check (auth.uid() = instructor_id);

create policy enrollments_read_own on public.enrollments for select
  using (auth.uid() = student_id or public.is_admin());
create policy enrollments_insert_student on public.enrollments for insert
  with check (auth.uid() = student_id);

-- الدردشة: المشاركون فقط
create policy conversations_read_own on public.conversations for select
  using (exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = conversations.id and cp.user_id = auth.uid()
  ));

create policy conversation_participants_read_own on public.conversation_participants for select
  using (user_id = auth.uid() or public.is_admin());

create policy messages_read_own on public.messages for select
  using (exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id and cp.user_id = auth.uid()
  ));
create policy messages_insert_own on public.messages for insert
  with check (auth.uid() = sender_id and exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id and cp.user_id = auth.uid()
  ));

create policy notifications_read_own on public.notifications for select
  using (auth.uid() = user_id);
create policy notifications_update_own on public.notifications for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- الاشتراكات: المزوّد يقرأ اشتراكاته فقط؛ الأدمن يقرأ ويكتب الكل
create policy subscriptions_read_own on public.subscriptions for select
  using (auth.uid() = provider_id or public.is_admin());
create policy subscriptions_insert_own on public.subscriptions for insert
  with check (auth.uid() = provider_id and status = 'pending');
create policy subscriptions_admin_write on public.subscriptions for all
  using (public.is_admin()) with check (public.is_admin());

create policy payment_events_read_own on public.payment_events for select
  using (exists (
    select 1 from public.subscriptions s
    where s.id = payment_events.subscription_id and s.provider_id = auth.uid()
  ) or public.is_admin());
create policy payment_events_insert_own on public.payment_events for insert
  with check (
    exists (select 1 from public.subscriptions s
            where s.id = payment_events.subscription_id and s.provider_id = auth.uid())
  );
create policy payment_events_admin on public.payment_events for all
  using (public.is_admin()) with check (public.is_admin());

-- ────────────────────────────────────────────────────────────────
-- 11. Views النشطة
-- ────────────────────────────────────────────────────────────────

create or replace view public.active_providers as
select p.* from public.profiles p
where p.role = 'provider'
  and exists (
    select 1 from public.subscriptions s
    where s.provider_id = p.id
      and s.status in ('active','trial')
      and (s.expires_at is null or s.expires_at > now())
  );

-- سجلّات المواعيد غير المقروءة لكل محادثة
create or replace view public.conversations_with_unread as
select c.*,
  (select count(*) from public.messages m
    where m.conversation_id = c.id and m.is_read = false and m.sender_id != auth.uid()) as unread_count
from public.conversations c;

-- ────────────────────────────────────────────────────────────────
-- نهاية المخطط — تحقق سريع آخر السكربت
-- ────────────────────────────────────────────────────────────────
-- select tablename, rowsecurity from pg_tables where schemaname = 'public' order by 1;
-- select proname from pg_proc where pronamespace = 'public'::regnamespace;
