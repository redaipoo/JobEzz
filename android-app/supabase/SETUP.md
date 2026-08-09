# تركيب قاعدة بيانات JobEzz على Supabase — 10 دقائق

هذا الدليل مُعَدّ للصق مباشرةً. اتبع الترتيب الحرفي.

---

## الخطوة 1 — إنشاء المشروع (دقيقتان)

1. ادخل **https://supabase.com** → *Start your project* → سجّل بحساب GitHub (أوغيره).
2. *New Project* → اختر **اسماً** مثل `jobezz-prod`، قاعدة بيانات في أقرب منطقة (**Frankfurt - West EU** هي الأقرب لـ ليبيا مع الحد الأدنى للـ latency) وأنشئ كلمة مرور قاعدة بيانات قوية (احفظها).
3. انتظر حتى يكتمل الـ provisioning (≈ دقيقتان).

---

## الخطوة 2 — تشغيل المخطط (3 دقائق)

1. من القائمة الجانبية: **SQL Editor** → **New query**.
2. افتح ملف `supabase/schema.sql` من التطبيق، انسخ **كامل** المحتوى والصقه.
3. اضغط **Run** (أو `Ctrl+Enter`). تأكد من ظهور الرسالة الخضراء: `Success. No rows returned`.
4. كرّر نفس الشيء مع `supabase/seed.sql`.

---

## الخطوة 3 — تفعيل مصادقة الهاتف (دقيقتان)

1. **Authentication** → **Providers** → فعّل **Phone**.
2. اختر مزوّد SMS: **Twilio** هو الأكثر استقراراً لليبيا.
3. أدخل `Account SID` و`Auth Token` و`Twilio Phone Number` في الحقول.
4. **Save**.

> إذا لم يكن لديك حساب Twilio بعد — أوقف Phone Auth مؤقتاً وفعّل **Email** كخيار بديل. التطبيق يدعم الاثنين (الكلمة المرور بديل قانوني).

---

## الخطوة 4 — الحصول على المفاتيح (دقيقة)

1. **Project Settings** → **API**.
2. انسخ القيمتين:
   - `Project URL`  (مثال: `https://abcdefgh.supabase.co`)
   - `anon public` key (الطويل جداً الذي يبدأ بـ `eyJ...`)

---

## الخطوة 5 — ربط التطبيق (دقيقة)

أنشئ ملف `.env` في مجلد `android-app/` بجوار `package.json`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

> **لا تضع** `service_role` key في التطبيق — هو للوحة الأدمن فقط (يمر عبر RLS).

أعد تشغيل Metro:
```bash
npx expo start --clear
```

---

## الخطوة 6 — التحقق (دقيقتان)

- **Table Editor** → يجب أن ترى الجداول الجديدة (`profiles`, `service_requests`, `subscriptions` ...).
- **Authentication** → سجّل مستخدماً تجريبياً من التطبيق → ستراه هنا.
- **Database** → **Policies**: كل الجداول مفعّلة بـ RLS (جارٍ).

---

## الأخطاء الشائعة ومراجعتها

| الخطأ | السبب | الحل |
|------|------|-----|
| `type "user_role" already exists` | schema.sql نُفّذ مرتين | آمن — التكرار متوقع بالفعل |
| `Failed to send SMS` | Twilio balance / رقم هاتف | فعّل Email provider كحل بديل |
| `Row Level Security policy violation` | RLS يعمل بشكل صحيح | تأكد أن user أنشئ عبر Trigger (تحقق من سطر on_auth_user_created) |
| `relation "auth.users" does not exist` | مشروع قديم | أنشئ مشروعاً جديداً — `auth.users` موجود دائماً |

---

## الوضع اليدوي مقابل البوابة الآلية

- **يدوي (الحالة الحالية)**: العامل يضغط "تفعيل الاشتراك"، يُدخل رقم التحويل، تظهر حالته `pending` في لوحة الأدمن. الأدمن يراجع التحويل البنكي واقعياً ثم يفعّل أوتوماتيكياً.
- **آلي (Jari lما جاهز)**: بعد التعاقد مع MIZA Pay / Tadawul، أضف `SUPABASE_SERVICE_ROLE_KEY` kبيئة Edge Functions واكتب function واحدة `payment-webhook`. الملف `src/lib/payments.ts` iafdil أنه خانة فارغة.

---

## النسخ الاحتياطي والمراقبة

- **Database → Backups**: النسخ التلقائي المجاني يومي. للإنتاج فعّل Point-in-Time Recovery (مدفوع، رخيص).
- **Reports → API**: راقب `count` على service_requests وsubscriptions عبر الأيام.

انتهيت — قاعدة بياناتك تعمل. وأي بيانات دخل التطبيق ستكون آمنةً بفضل RLS حتى لو أعطيت APK للمستخدمين قبل تفعيل OTP SMS.
