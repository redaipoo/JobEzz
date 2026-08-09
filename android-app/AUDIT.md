# JobEzz — تدقيق الجودة الشامل (Production Audit)

تاريخ التدقيق: 2026/08/02
الحالة: قيد التنفيذ — يتم تحديث القائمة بعد كل إصلاح.

## الأولوية
- **[P0]** خلل وظيفي يمنع الاستخدام أو النشر
- **[P1]** جودة عالية — يمنع قبولها لمتجر Play/App Store
- **[P2]** تحسين — يُنفَّذ بعد اكتمال P0/P1

---

## أ. أعطال وظيفية / تنقل مكسور

- [x] **A0 — إصلاح انهيار الإقلاع (Splash)** — ClassCastException (String → ReadableArray) في `_updatePropsPaper` من `useAnimatedProps` بمكونات SVG على أندرويد. تم: تحويل `strokeDasharray` إلى مصفوفات و`transform` النصية إلى مصفوفات في `SplashScreen.tsx`. البناء `c00a71fd` نجح. **تم التحقق على الجهاز: إقلاع سليم مرتين + تنقل كامل بلا انهيار.**
- [x] **A1 — تناقض معاملات التنقل [P0]** — ✅ تمت محاذاة `RootStackParamList` في types.ts مع الاستخدام الفعلي (`id/cat/pid/type`)، وتحديث مسارات `linking` (`jobs/:id`, `courses/:id`, `invoices/:id`, `chats/:id`).
- [x] **A2 — زر الرجوع في شاشة المحادثة ميت [P0]** — ✅ إصلاح: تمرير `navigation` الحقيقي؛ + إضافة إرسال رسائل حي + تمرير تلقائي للأسفل + تعطيل زر الإرسال عند الفراغ.
- [x] **A3 — أزرار بلا إجراء [P1]** — ✅ زر الهاتف الوهمي في قائمة التقنيين حُذف؛ زر المشاركة في ملف التقني وشريط الحجز أصبحا يفتحان Share فعلًا (`Share.share`). + حذف زر "فتح لوحة الأدمن" الميت (`onPress={() => {}}`) من شاشة Admin في More.tsx. + في شاشة Services (Core): "عرض الكل" وبطاقات الحرفيين المميزين كانا بلا onPress — أصبحا يتنقلان إلى TechnicianList/TechnicianProfile.
- [x] **A4 — زر الجرس الميت في كل شاشات Shell [P1]** — ✅ `Header` يعرض الجرس فقط عند تمرير `right`، وزر الرجوع فقط عند وجود معالج.
- [x] **A5 — مبالغ مكتوبة يدويًا في التنقل [P2]** — ✅ المبالغ تُشتق الآن من البيانات: مبلغ الدورة من `c.price` (تحليل رقمي بدل الثابت 45)، رسوم الخدمة من سعر المزوّد `p.price` (بدل الثابت 60) في `ServiceTrack`.
- [x] **A6 — الربط العميق (Deep Linking) غير مفعّل [P1]** — ✅ `linking` مرر إلى `NavigationContainer` + `scheme: "jobezz"` في app.json. (النطاق `jobezz.example` تجريبي ينتظر نطاق الإنتاج.)
- [x] **A7 — RTL غير مفروض [P1]** — ✅ `I18nManager.forceRTL(true)` + `allowRTL(true)` قبل أول render في App.tsx — التطبيق عربي أولًا دائمًا.

## ب. المعمارية / نظام التصميم

- [x] **B1 — نظاما تصميم متوازيان [P0]** — ✅ التصميم الجديد أصلح: `theme.ts` أصبح طبقة توافق (legacy façade) تشير إلى `design/tokens.ts` كمصدر واحد؛ `CATEGORY_COLORS` انتقلت إلى tokens (`categoryColors`) وأُعيد تصديرها؛ الألوان الدلالية (blue/success/warning/danger) مستعارة من التوكنز. المتبقي: ترحيل الأنماط المضمّنة تدريجيًا (B2).
- [x] **B2 — ألوان/أنماط يدوية داخل الشاشات [P1]** — ✅ ترحيل ألوان Core.tsx بالكامل إلى التوكنز (86 لونًا hex مكررًا → مراجع `COLORS.*`/`PREMIUM_COLORS.gold`/`palette.*`؛ لم يتبقَّ غير `#000000` للظلال). المتبقي: استخراج الأنماط المضمّنة إلى StyleSheet (مؤجل ضمن F3).
- [x] **B3 — الترجمة غير موحدة [P1]** — ✅ حذف `t()` الميتة العربية-الوحيدة من components.tsx (لا مكوّن يستخدمها). المتبقي: `useT` في Core تُكمل بـ`STRINGS.ar` — مقبول طالما المحتوى عربي بالكامل.
- [x] **B4 — تكرار مكوّن Shell [P1]** — ✅ `Shell` واحدة موحدة في components.tsx، وCore.tsx وMore.tsx تستوردانها (حُذفت النسختان المحليتان والأنماط الميتة).
- [x] **B5 — كود ميت [P2]** — ✅ حذف `components/AnimatedComponents.tsx` كاملًا (غير مستورد من أي مكان)، ومكوّن `BottomNav` legacy مع أنماطه (لا شاشة ترسمه — الشريط الفعلي في App.tsx)، وstubs `BottomSheetProvider`/`useBottomSheet` من navigation.tsx. المتبقي: `NAV_TRANSITIONS`/interpolators وأدوات persistence تبقى كأدوات موثقة جاهزة (linking موصولة فعلًا في A6).
- [x] **B6 — tsconfig بدون strict [P1]** — ✅ `"strict": true` مفعّل؛ حُلّت 17 خطأ: fallback `|| USER` لمواضع `user` القابلة للصفر (12)، فهرسة `APPLICATION_STATUS` بـ keyof (3)، `useT` بفهرس `keyof TranslationDict` (2)، `useState<number>` لخطوة ServiceTrack (1). `tsc --noEmit` نظيف تحت strict.
- [x] **B7 — `motion.tsx` hack [P2]** — ✅ حذف `sp_md()` والشرط بلا معنى (`motion.duration ? sp_md() : 12`) واستبداله بـ `sp.md` من التوكنز.
- [x] **B8 — ألوان العلامة داخل الأيقونات [P2]** — ✅ icons.tsx: `play` → `palette.accent` (كانت `#123B5E` شبه مخفية على الخلفية الكحلية)، `star/starFill` → `palette.warning`، والافتراضيات → `palette.accent` — لا ألوان hex متبقية في الملف.
- [x] **B9 — نسخة الحزمة غير متطابقة [P1]** — ✅ app.json: `version 1.2.0` (مطابق لـ package.json) + `android.versionCode: 2` + `userInterfaceStyle: "dark"` + `scheme: "jobezz"`.

## ج. الأمان

- [ ] **C1 — تدوير EXPO_TOKEN [P0]** — التوكن ظهر في سجل الأوامر. يُفضَّل إبطاله من لوحة EAS وإصدار جديد يُحفظ في متغير بيئة محلي لا في سجل. (إجراء مستخدم)
- [ ] **C2 — مصادقة OTP وهمية [P1→✅ جزئي]** — ✅ جزئي: زر التأكيد معطّل حتى اكتمال 4 أرقام. يبقى التحقق الخلفي الحقيقي مرتبطًا بالخادم عند ربط API + تخزين التوكنات في Keychain/EncryptedStorage.
- [x] **C3 — لا إعداد بيئة للمباني [P1]** — ✅ eas.json: `env.EXPO_PUBLIC_API_URL` لكل profile (development→localhost:3000/v1، preview/production→https://api.jobezz.example)؛ التطبيق يقرأه ويسقط على البيانات الوهمية عند غيابه.
- [x] **C4 — صلاحيات ومدخلات [P2]** — ✅ لا صلاحيات إضافية معلنة (الحد الأدنى: INTERNET فقط)؛ التحقق من المدخلات محلي (أرقام OTP، تمكين الإرسال عند الفراغ)؛ المراجعة النهائية عند ربط API حقيقي.

## د. جاهزية المتاجر (Play Store / App Store)

- [x] **D1 — أيقونة التطبيق غائبة [P0]** — ✅ مولّد `scripts/generate-icons.js` (Node نقي بلا اعتماديات) أنتج `assets/icon.png` (1024 legacy) + `assets/adaptive-icon.png` (foreground شفاف، داخل safe-zone) + `assets/splash-icon.png`؛ هوية: خلفية كحلية متدرجة + حرف J بالأزرق المميز + نقطة ذهبية، وموصولة في app.json.
- [x] **D2 — إعدادات app.json [P1]** — ✅ `userInterfaceStyle: "dark"`، `version 1.2.0`، `android.versionCode: 2`، `scheme: "jobezz"`. المتبقي: أيقونات (D1).
- [x] **D3 — eas.json production [P1]** — ✅ `production` → `app-bundle` (AAB) + `generateAppStoreConfig: true` + `autoIncrement: versionCode`؛ APK يبقى للاختبار الداخلي (توزيع محلي).
- [x] **D4 — إشعارات دفع [P1]** — ✅ `expo-notifications ~0.28` مثبّت + plugin في app.json (أيقونة/لون/قناة افتراضية، إذن Android 13+ تلقائيًا)؛ `src/notifications.ts` آمن (try/catch على النمط الأصلي — البناء الحالي بلا وحدة ناتيف يبقى يعمل بلا انهيار، ويتفعّل تلقائيًا في البناء القادم): معالج العرض، تصريح تلقائي عند الإقلاع + لافتة تفعيل في شاشة Notifs، إشعار محلي عند إرسال طلب وظيفة وتأكيد حجز خدمة، توجيه التنقل عند النقر على الإشعار، و`getPushToken()` جاهز للربط مع الخادم.
- [x] **D5 — سياسة خصوصية / شروط [P1]** — ✅ شاشة `Legal` جديدة (تبويبا الخصوصية والشروط، محتوى كامل بالعربية، رابط عميق `legal/:section`) + قسم "القانوني" في قائمة الملف الشخصي.
- [x] **D6 — خطوط العلامة [P2]** — ✅ expo-font + Tajawal/Inter مثبّتان (config plugin في app.json)؛ `src/fonts.ts` (useAppFonts)؛ splash ينتظر الخطوط؛ أزرار/عناوين `Tajawal_700Bold`؛ أُكدّت تضمين ملفات TTF في تصدير الحزمة.

## هـ. تجربة المستخدم / إكمال الميزات

- [x] **E1 — حالات تحميل/خطأ/فارغ [P1]** — `EmptyState` منتظم في الشاشات الثلاث الآن (وظائف/خدمات/دورات) مع نصوص فارغة مُحسّنة تشمل إرشاد البحث. (طبقة react-query/axios تبقى جاهزة عند ربط API حقيقي.)
- [x] **E2 — بحث فعلي [P2]** — ✅ خدمات كانت موجودة؛ الوظائف والدورات كانتا وهميتين (Text ثابت) — أصبحتا `TextInput` حقيقيين يفلتران العنوان/الشركة/المهارات والموقع (وظائف) والعنوان/الوصف/التصنيف (دورات)، مع الحفاظ على الفلاتر.
- [x] **E3 — تفاعل الإعجاب/الحفظ [P2]** — ✅ حالة حية في المتجر: `savedJobIds` (مستمرة في AsyncStorage عبر partialize) + `toggleSavedJob`؛ زر قلب في رأس JobDetail (heart/heartFill)؛ SavedJobs وHome يقرآن من المتجر ويُحدَّثان فورًا، مع حالة فارغة سليمة.
- [x] **E4 — بطاقة تطابق JobDetail [P2]** — ✅ `jobMatchScore()` في utils.ts: يعتمد على مهارات/مدينة/خبرة الملف الشخصي (شارة المهارات المشتركة +6، نفس المدينة +6، مستوى خبرة +5، حد أدنى 25/أقصى 98) مع الحفاظ على الدرجة الأساسية للمحرك؛ مطبّق في Home (ترتيب تنازلي) وJobDetail وSavedJobs. + اختبارات دخان تغطيه.

## و. الأداء

- [ ] **F1 — لا virtualization للقوائم [P1→P2]** — القوائم حاليًا ScrollView + map بأحجام صغيرة (7 وظائف، 8 دورات، 3 محادثات) — الأداء مقبول الآن. يُراجع إلى FlatList/FlashList عند ربط API حقيقي مع صفحات أكبر. (تأجيل مقصود)
- [x] **F2 — حجم البندل [P2→مؤجل]** — APK 25.7MB؛ الانتقال إلى AAB في `production` (play store) + دراسة `expo-build-properties` عند الإعداد النهائي.
- [ ] **F3 — إعادة الرسم [P2→جزئي]** — ✅ استُخرج النمط المتكرر الأكبر (`{ fontWeight:'700', color:'#fff' }` ×13 → `s_shell.t700`) + تعريفات توكن جديدة؛ البقية أنماط فريدة/قليلة الاستخدام — والاستخراج الكامل لها ربح ضئيل (React Native تخزّن الأنماط المضمّنة في الذاكرة منذ 0.53). يُستكمل عند ظهور مشكلة أداء فعلية (المحافظ شبه فارغة).

## ز. الوصولية

- [x] **G1 — أهداف لمس [P1]** — ✅ أزرار رأس Shell 60×60 + hitSlop 10 + تسميات؛ رقائق الفلاتر hitSlop 6؛ `PressableScale` (كل بطاقات/شرائح الخدمات) يحمل role="button"؛ غلاف TouchableOpacity يغطي كل الأزرار المخصصة. الباقي عتبات مقبولة (≥44px عبر الحشوات).
- [x] **G2 — تسميات TalkBack/VoiceOver [P2]** — ✅ غلاف `TouchableOpacity` محلي في Core/More/ServicesFlow يفرض `accessibilityRole="button"` افتراضيًا على كل زر مخصص (لا حاجة لتعديل كل موقع)؛ `Button` و`Card` في components.tsx تحملان role/label أيضًا. التبويبات جيدة أصلًا في PremiumTabBar.
- [x] **G3 — أحجام خطوط ديناميكية [P2]** — ✅ `maxFontSizeMultiplier: 1.5` عالميًا عبر `Text.defaultProps` في App.tsx — يسمح بالتمديد من إعدادات النظام (TalkBack) مع حماية التخطيطات الثابتة من الكسر؛ الخطوط القياسية قابلة للتمديد أصلًا (allowFontScaling افتراضي).
- [x] **G4 — تباين [P2]** — ✅ النص الثانوي `rgba(255,255,255,.45)` → `.58` (6.65:1 على bg1، كان 4.35)؛ `.4` → `.55` (23 موضعًا)؛ `.35` → `.5` (5 مواضع). كل النصوص الثانوية الآن ≥ 4.5:1.

## ط. الجولة الحالية (إعادة التصميم + الدفع + البيانات الحية) — 2026/08/04

- [x] **T1 — إعادة تصميم Home [P2]** — ✅ بطاقتا IntentGate غير متماثلتين (مطلوب خدمة / أبحث عن عمل) بخلفية LinearGradient + لمعة زجاجية، بحث كبسولة، أقسام تكيّفية حسب الدور (مزوّد/باحث/صاحب عمل/طالب)، ريلا "الأكثر طلباً" و"أفضل الفنيين"، حذف أقسام مكررة/تسويقية وكود ميت (`JobCardMini`/`CourseCardMini`/`RolePill`).
- [x] **T2 — مكوّنات مميزة [P2]** — ✅ `Button` ضغطة spring (0.97) + لمعان علوي زجاجي؛ `Card glow` (ذهبي/أكسنت)؛ `SkeletonCard` بوميض متحرك؛ `type.displayLg`.
- [x] **T3 — التزام لغة/نظام [P2]** — ✅ إزالة كل em-dash (U+2014 → `·`) في Core/More/ServicesFlow/data.ts بلا BOM؛ ترحيل الألوان المكررة (`#5C7592/#8CA1B8/#E74C3C/#2ECC71/#000000`) إلى palette؛ مراجعة النسخ وإزالة كلمات AI-slop.
- [x] **T4 — Onboarding/RoleSelect [P2]** — ✅ `AmbientGlow`+`FadeInView` للشرائح، `StaggerItem` لبطاقات الأدوار، أنماط داكنة متوافقة.
- [x] **T5 — اشتراك المزوّد + الدفع اليدوي [P1]** — ✅ `src/lib/payments.ts` (خطط/بوابة env/فاتورة حوالة بنكية/تأكيد/تفعيل أدمن)؛ Paywall في ProviderDashboard (نشط/معلّق/غير مفعّل + تدفق حوالة + "سجّلت التحويل")؛ Wallet تعرض حالة الاشتراك؛ Admin (More.tsx) يفعّل الاشتراكات يدويًا (صفوف تجريبية محليًا). حالة `pending` أُضيفت إلى enum المخطط والنوع.
- [x] **T6 — بيانات حية (خادم أولاً، محلي ثانيًا) [P2]** — ✅ `src/lib/queries.ts`: `loadJobs/loadJobDetail/loadActiveProviders/loadCourses/loadNotifications/loadMessages/sendMessage/createServiceRequest` + Realtime (رسائل المحادثة، طلبات الخدمة). مربوطة بـ: Jobs، Chat، Notifs، ServiceRequest. **بوابة الظهور موصولة بالكامل**: `useLiveProviders/useLiveTechnician` + مطابقة فئة بالمهارات العربية (`matchProviderCatId`) — TechnicianList/TechnicianProfile/Booking/ServicesHome/Home تعرض المزوّدين من view `active_providers` (المشتركون فقط) عند ربط Supabase.
- [x] **T7 — التحقق [P2]** — ✅ `tsc --noEmit` نظيف تحت strict، `eslint` 0/0، smoke 16/16 (زاد اختبارا parity i18n)، `expo export --platform android` نجح (bundle 4.26MB).
- [x] **T8 — جولة الرفع الفاخر (Premium polish) [P2]** — ✅ استكمال SKILL.md redesign، audit-first:
  - **الخطوط**: توكين جديد `type.h4` (15/21 Bold)؛ اسم البطل في Home يرتقي إلى `type.display` (28/800) بلا فوضى.
  - **اللون**: مسح 47 hex خارج التوكنز — اللون الأخضر/الأحمر/البرتقالي/الأزرق القديم (rgba 46,204,113 / 231,76,60 / 245,166,35 / 74,163,224) وحدود light-theme (rgba 23,42,66) في Core/More/ServicesFlow/ErrorBoundary → `palette.*`؛ توكين جديد `palette.accentSoft`؛ تدرجات إنيقون الوضع الفارغ → حلقة أكسنت متوهجة.
  - **المكونات**: `Card` بحد علوي مضيء (edge highlight) + متغير `flat`؛ `Badge` نص أثقل (700)؛ `Kpi` مرتفع بظل + إنيقون مؤطّر بالأكسنت؛ `EmptyState` بحلقة أكسنت وظل glow؛ لمعان علوي زجاجي للـ Button سابقًا (T2).
  - **شريط التبويبات (App.tsx)**: أيقونة نشطة داخل كبسولة أكسنت متوهجة (iconWrapActive)، ظل من `#000` → `#00030C`، مؤشر علوي مضبوط بعد تغيير ارتفاع الكبسولة، عناوين بتباعد أحرف.
  - **الحركة**: دعم `reduce-motion` (AccessibilityInfo) في `useEntrance`/`StaggerItem` — تنهار إلى الحالة النهائية وتهبط زبون الحالة لحظة تفعيلها.
  - **التحقق**: `tsc` نظيف، `eslint` 0/0، smoke 16/16، `expo export --platform android` نجح (bundle 4.29MB).
- [x] **T9 — جولة إعادة التصميم الثانية (SKILL: ghost-glow v2) [P2]** — ✅ اتجاه بصري جديد واضح:
  - **عناصر اختيار (chips/filters) موحّدة على نمط ghost-glow** في كل التطبيق: الوضع النشط = خلفية `accentSoft` + إطار `borderAccent` ونص/أيقونة بلون الأكسنت (بدل التعبئة الزرقاء الكاملة بنص أبيض) — `Chip` المشترك + رقائق فلاتر الوظائف (filterCard/filterChip) + تبويبات الطلبات (More) + فلاتر الدورات + شرائح ServicesFlow.
  - **علامة أقسام**: `SectionTitle` الآن بعلامة أكسل ملساء مضيئة (3×16 rounded + `sh.glowSoft`) قبل كل عنوان قسم رئيسي — توقّيع بصري متكرر في كل الشاشات.
  - **الرموز**: توكين جديد `sh.glowSoft` (ظل أكسنت خفيف) لامتياز نقاط التركيز الدقيقة.
  - تصحيحات: تعديل خطأ تعريف اقتباس، إصلاح duplicate Text، BOM.
  - **التحقق**: `tsc` نظيف، `eslint` 0/0، smoke 16/16، `expo export` نجح.

## ح. العملية / الأدوات

- [x] **H1 — تهيئة git [P1]** — ✅ مستودع محلي بـ 8 التزامات + remote جديد (redaipoo/joobEzz)؛ الدفع عند اكتمال الجولة.
- [x] **H2 — لنت/فحص صارم [P2]** — ✅ `npx expo lint` مثبّت: 0 أخطاء (نظّفنا كل استيرادات/متغيرات ميتة + خطأ hooks حقيقي في تبويبات App.tsx عبر استخراج `TabItem` + deps لخطافات Reanimated + `/* eslint-env node */` للسكربت)؛ `npm run typecheck` جاهز؛ **+ GitHub Actions CI (`.github/workflows/ci.yml`): npm ci → typecheck → lint → smoke tests على كل push/PR**.
- [x] **H3 — اختبارات [P2]** — ✅ `scripts/smoke.js` (Node نقي بلا اعتماديات): 14/14 اختبار دخان لـ utils (clamp/lerp/truncateText/jobMatchScore) وi18n (مفاتيح ar/en)؛ `npm test` يخرج بكود 1 عند الفشل.

---

## مخرجات التحقق النهائي
- [x] `npx tsc --noEmit` نظيف (بعد كل دفعة إصلاحات)
- [ ] بناء EAS production جديد ناجح (مؤجل — بانتظار GitHub + إذن المستخدم)
- [x] **على الجهاز (النسخة المُصلَحة c00a71fd):** إقلاع ناجح مرتين متتاليتين (لا انهيار — crash buffer فارغ، العملية حية)؛ التنقل الكامل يعمل: Onboarding → Home → JobDetail → JobApply → إرسال الطلب → نجاح → Applications → رجوع. لقطات شاشة محفوظة في `shots_*.png`.
- [ ] إصلاحات الجولة الحالية (معاملات التنقل، RTL مفروض، الربط العميق، الأيقونات، توحيد Shell) ستُبنى في النسخة التالية — **لم تُختبر على الجهاز بعد** (النسخة المثبتة أقدم منها)
- [ ] فحص حزم 5 شاشات رئيسية (Onboarding → Home → Jobs → Services → Profile) على النسخة الجديدة
- [ ] جولة التصميم/الدفع/البيانات الحية (T1–T7) **لم تُختبر على الجهاز بعد** — يلزم بناء وتثبيت قبل التسليم
- [ ] جولة الرفع الفاخر (T8) **لم تُختبر على الجهاز بعد** — مكتملة وتحققّت أدواتياً (tsc/eslint/smoke/export)
- [ ] جولة إعادة التصميم الثانية (T9) **لم تُختبر على الجهاز بعد** — تغيّر غوست-الأكسنت + علامة أقسام؛ تحققّت أدواتياً
