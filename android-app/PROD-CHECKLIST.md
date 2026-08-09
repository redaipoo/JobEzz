# JobEzz — قائمة فحص الإنتاج (Production Checklist)

آخر تحديث: 2026/08/04 — الحالة: **جاهز للتسليم بعد فحص الجهاز النهائي**.

## 1. الإعداد (مرة واحدة)

- [ ] إنشاء مشروع Supabase جديد
- [ ] تنفيذ `supabase/schema.sql` في SQL Editor (جداول + RLS + views)
- [ ] (اختياري) تنفيذ `supabase/seed.sql` للبيانات التجريبية
- [ ] نسخ `.env.example` → `.env` وملء القيم:
  - `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  - `EXPO_PUBLIC_PAYMENT_GATEWAY=manual` (حالياً: تحويل بنكي يدوي)
  - `EXPO_PUBLIC_BANK_TRANSFER_INFO` (JSON: البنك/الحساب/المرسل إليه)
- [ ] إعادة تشغيل Metro بعد التعديل (`npx expo start --clear`)

## 2. البوابة والدفع (اختبار الأدمن)

- [ ] كمزوّد: فتح ProviderDashboard → Paywall (25 د.ل/شهرياً) → "اشترك الآن" → نسخ بيانات الحوالة
- [ ] تسجيل تحويل → تظهر حالة "معلّق" في Wallet ولوحة الأدمن
- [ ] الأدمن: More → أدوات الأدمن → تفعيل الاشتراك → يعود المزوّد "نشط"
- [ ] بعد التفعيل: يظهر المزوّد في نتائج البحث (view `active_providers`)
- [ ] إنهاء/انتهاء الاشتراك → يختفي من النتائج (RLS + RPC للتعطيل التلقائي — يُفعَّل في Supabase عند الحاجة)

## 3. البيانات الحية (بعد ربط Supabase)

- [ ] الوظائف: قائمة + تفاصيل تعرض بيانات الخادم (لا الوهمية)
- [ ] الدردشة: إرسال رسالة من جهازين → تصل لحظياً عبر Realtime
- [ ] الإشعارات: تُحمَّل وتُعلَّم كمقروءة
- [ ] طلب خدمة: يظهر في `service_requests` ويصل للمزوّدين عبر Realtime
- [ ] التحقق: عند غياب `.env` كل الشاشات تعمل بالبيانات المضمّنة (وضع التطوير)

## 4. الجودة (قبل كل إصدار)

- [ ] `npm run typecheck` — صفر أخطاء
- [ ] `npx eslint App.tsx src` — صفر أخطاء
- [ ] `npm test` — 16/16 دخان
- [ ] `npx expo export --platform android` — بنجاح
- [ ] بناء EAS production (`eas build --platform android --profile production`) واختباره على جهاز حقيقي:
  - إقلاع سليم + تنقل كامل (Onboarding → Home → Jobs → Services → Profile → Wallet)
  - تدفق الاشتراك + تدفق طلب الخدمة + الدردشة
- [ ] ملء تدقيق `AUDIT.md` بآخر الفحوصات

## 5. الإصدار للمتاجر

- [ ] تحديث `app.json`: version/versionCode (autoIncrement في eas.json يضبطها)
- [ ] نطاق إنتاج فعلي بدل `jobezz.example` في eas.json + `linking`
- [ ] إبطال `EXPO_TOKEN` القديم المكشوف وتوليد جديد (C1 في AUDIT)
- [ ] سياسة الخصوصية/الشروط نشرة على رابط ثابت (شاشة Legal موجودة)
- [ ] رفع AAB إلى Play Console (نسخة داخلية أولاً)

## ملاحظات معروفة

- OTP: وضع التطوير يقبل أي رقم — يحل محله التحقق عبر الخادم عند إتاحة SMS (Twilio).
- `listProviderSubscriptions('*')` للأدمن لا يضم `profiles` (بدون اسم/هاتف حياً) — يُضاف join عند الحاجة.
- الاشتراك لا يزال يدوياً (تحويل بنكي) — بوابة رقمية (Mizapay/Tadawul) جاهزة عبر `getActiveGateway()`.
