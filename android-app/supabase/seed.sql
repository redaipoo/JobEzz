-- ═══════════════════════════════════════════════════════════════
-- JobEzz — Seed data (safe to re-run — ON CONFLICT DO NOTHING)
-- انسخ هذا الملف في SQL Editor بعد schema.sql
-- ═══════════════════════════════════════════════════════════════

insert into public.service_categories (id, name_ar, name_en, icon, sort_order)
values
  ('plumber',    'سباكة',      'Plumbing',     'wrench',     1),
  ('electrician','كهرباء',     'Electrical',   'zap',        2),
  ('carpenter',  'نجارة',      'Carpentry',    'hammer',     3),
  ('painter',    'دهان',       'Painting',     'brush',      4),
  ('ac',         'تكييف',      'AC & Cooling', 'fan',        5),
  ('cleaning',   'تنظيف',      'Cleaning',     'sparkle',    6),
  ('mover',      'نقل',        'Moving',       'truck',      7),
  ('mechanic',   'ميكانيكا',   'Mechanics',    'gear',       8),
  ('plaster',    'جبس وديكور', 'Gypsum',       'layers',     9),
  ('satellite',  'ستلايت',     'Satellite',    'tv',         10),
  ('locksmith',  'أقفال',      'Locksmith',    'key',        11),
  ('solar',      'طاقة شمسية', 'Solar',        'sun',        12)
on conflict (id) do nothing;

-- ملفّات عيّنة للمزوّدين (بالـ UUID صفر = يُنشأ تلقائياً مع auth، فللاختبار اليدوي)
-- نستخدم هنا gen_random_uuid() لأن auth.users ليست مرتبطة — يُستبدل عند الإطلاق

insert into public.profiles (id, phone, full_name, role, roles, city, bio, skills, is_verified, rating, review_count, price_range)
values
  (gen_random_uuid(), '0910000001', 'محمد السباك',  'provider', array['provider'], 'بنغازي', 'سباك معتمد 12 سنة خبرة', array['plumber','ac'], true, 4.9, 87, '50-80 د.ل'),
  (gen_random_uuid(), '0910000002', 'أحمد الكهربائي', 'provider', array['provider'], 'طرابلس', 'كهربائي منازل ومحلات', array['electrician'], true, 4.8, 64, '40-70 د.ل'),
  (gen_random_uuid(), '0910000003', 'خالد نقل الأثاث','provider', array['provider'],'بنغازي', 'نقل أثاث آمن وسريع', array['mover'], true, 4.7, 52, '80-150 د.ل')
on conflict do nothing;

-- وظائف عيّنة
insert into public.jobs (employer_id, title, company_name, category, type, subtype, salary_min, salary_max, currency, city, description, skills, is_active)
select p.id, v.title, v.company, v.cat, v.type, 'onsite', v.sal_min, v.sal_max, 'LYD', v.city, v.descr, v.skills, true
from public.profiles p
cross join (values
  ('محاسب أول',       'شركة الأفق للتجارة', 'accounting','full_time', 2500, 3800, 'بنغازي', 'مطلوب محاسب خبرة 5 سنوات', array['محاسبة','إكسل']),
  ('مندوب مبيعات',    'شركة النور',         'sales',    'full_time', 1800, 2500, 'طرابلس', 'خبرة في المبيعات الميدانية', array['مبيعات','تواصل']),
  ('مطوّر تطبيقات',   'تك ديف',             'tech',     'remote',    4000, 7000, 'طرابلس', 'React Native / Flutter', array['برمجة','React Native'])
) as v(title, company, cat, type, sal_min, sal_max, city, descr, skills)
where p.role = 'employer'
limit 3;
