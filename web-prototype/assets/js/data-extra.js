/* ============================================================
   JobEzz — Extra mock data (employer / academy / trust / admin)
   ============================================================ */

var MY_POSTINGS = [
  {id:"mj1", title:"محاسب مالي", cat:"مالية ومحاسبة", loc:"بنغازي", status:"نشط", applicants:8, type:"دوام كامل"},
  {id:"mj2", title:"مندوب مبيعات", cat:"مبيعات", loc:"بنغازي", status:"نشط", applicants:5, type:"جزئي"}
];

var APPLICANTS = [
  {id:"a1", name:"عمر الساعدي", role:"باحث عن عمل", cat:"مالية", exp:"3 سنوات", verified:true, rating:4.7, status:"review", cv:"السيرة_الذاتية.pdf"},
  {id:"a2", name:"منى العبيدي", role:"باحث عن عمل", cat:"مالية", exp:"سنة واحدة", verified:true, rating:4.5, status:"shortlisted", cv:"CV_Mona.pdf"},
  {id:"a3", name:"خالد التريكي", role:"باحث عن عمل", cat:"مالية", exp:"5 سنوات", verified:false, rating:4.2, status:"applied", cv:"CV_Khaled.pdf"},
  {id:"a4", name:"هند الفلاح", role:"باحث عن عمل", cat:"مالية", exp:"سنتان", verified:true, rating:4.8, status:"rejected", cv:"CV_Hind.pdf"}
];

var APPLICATION_STATUS = {
  applied:    {label:"تم التقديم",   color:"var(--gray-500)",  bg:"var(--gray-200)"},
  review:     {label:"قيد المراجعة", color:"#c97e10",         bg:"var(--warning-bg)"},
  shortlisted:{label:"مقصور عليك",   color:"var(--blue-600)", bg:"var(--blue-100)"},
  rejected:   {label:"مرفوض",       color:"var(--danger)",   bg:"var(--danger-bg)"},
  accepted:   {label:"مقبول",       color:"#1e9c54",         bg:"var(--success-bg)"}
};

var MY_APPLICATIONS = [
  {id:"ja1", job:"محاسب مالي", company:"شركة الأفق", logo:"أ", status:"shortlisted", date:"منذ يومين"},
  {id:"ja2", job:"مصمم جرافيك", company:"استوديو إبداع", logo:"إ", status:"review", date:"منذ 3 أيام"},
  {id:"ja3", job:"مندوب مبيعات", company:"مجموعة الزهراء", logo:"ز", status:"applied", date:"منذ أسبوع"},
  {id:"ja4", job:"كاتب محتوى", company:"منصة نون", logo:"ن", status:"rejected", date:"منذ أسبوعين"}
];

var SAVED_JOBS = [JOBS[1], JOBS[3]];

var COURSE_REVIEWS = [
  {id:"cr1", name:"ليلى بوخميس", verified:true, rating:5, text:"دورة ممتازة وشرح واضح، استفدت منها كثيراً في عملي.", date:"منذ أسبوع"},
  {id:"cr2", name:"سفيان الغرياني", verified:true, rating:4, text:"محتوى قيّم، أتمنى المزيد من الأمثلة العملية.", date:"منذ أسبوعين"},
  {id:"cr3", name:"ريم الفيتوري", verified:false, rating:5, text:"الشهادة ساعدتني أحصل على وظيفة سباك معتمد.", date:"منذ شهر"}
];

var PROVIDER_REVIEWS = [
  {id:"pr1", name:"محمد العماري", verified:true, rating:5, text:"سباك محترف ووصل في الوقت، أنصح به.", date:"منذ يومين"},
  {id:"pr2", name:"أسماء بن ناصر", verified:true, rating:4, text:"شغل نظيف وسعر منطقي، شكراً.", date:"منذ أسبوع"}
];

var QUIZ = [
  {q:"ما هو أول إجراء عند اكتشاف تسريب تحت الحوض؟", opts:["إغلاق مصدر المياه","فتح الصنبور","تركه","إزالة الأرضية"], ans:0},
  {q:"أي أداة تُستخدم لفك وصلات المواسير؟", opts:["المفك","الشاقور (الكانة)","المطرقة","المقص"], ans:1},
  {q:"متى يجب استبدال الوصلة التالفة؟", opts:["عند التسريب فوراً","بعد سنة","لا يهم","عند الطلب فقط"], ans:0}
];

var INSTRUCTOR_COURSES = [
  {id:"ic1", title:"أساسيات السباكة", students:1240, rating:4.8, revenue:540, status:"منشور"},
  {id:"ic2", title:"صيانة الخلاطات", students:430, rating:4.6, revenue:180, status:"بانتظار المراجعة"}
];

var INSTRUCTOR_QA = [
  {id:"q1", student:"نور الدين", q:"هل الدورة تشمل شهادة معتمدة؟", a:"نعم، Upon completion تصدر شهادة معتمدة من JobEzz.", status:"answered"},
  {id:"q2", student:"فاطمة", q:"ما هي الأدوات المطلوبة في البداية؟", a:"", status:"pending"}
];

var PAYMENT_METHODS = [
  {id:"cash", name:"الدفع عند الإنجاز", icon:"💵", desc:"الافتراضي — الدفع نقداً عند اكتمال الخدمة", enabled:true},
  {id:"bank", name:"تحويل بنكي + إيصال", icon:"🏦", desc:"يرفع العميل صورة الإيصال للمطابقة اليدوية", enabled:true},
  {id:"gateway", name:"بوابة دفع إلكترونية", icon:"💳", desc:"قابلة للتوصيل لاحقاً (تصميم مجرّد – pluggable)", enabled:false}
];

var INVOICES = [
  {id:"INV-2041", type:"خدمة سباكة", amount:60, date:"2026/07/18", method:"نقدي", pct:12},
  {id:"INV-2033", type:"دورة: السباكة المعتمدة", amount:45, date:"2026/07/12", method:"تحويل بنكي", pct:10},
  {id:"INV-2028", type:"نشر وظيفة (مدفوعة)", amount:30, date:"2026/07/05", method:"بوابة (تجريبي)", pct:0}
];

var DISPUTES = [
  {id:"d1", title:"لم يكتمل العمل كما اتفق", by:"أحمد العريبي", against:"عميل", status:"مفتوح", date:"اليوم", priority:"عالية"},
  {id:"d2", title:"تأخر المزوّد أكثر من ساعة", by:"سلامة القطراني", against:"مزوّد", status:"قيد المراجعة", date:"أمس", priority:"متوسطة"}
];

/* ---- ADMIN dataset ---- */
var ADMIN_USERS = [
  {id:"u1", name:"أحمد العريبي", role:"مزوّد خدمة", cat:"سباك", verified:true, status:"نشط", joined:"2026/03"},
  {id:"u2", name:"شركة الأفق", role:"صاحب عمل", cat:"تجارة", verified:true, status:"نشط", joined:"2026/02"},
  {id:"u3", name:"خالد المنصوري", role:"مدرّب", cat:"أكاديمية", verified:true, status:"نشط", joined:"2026/01"},
  {id:"u4", name:"ناصر الديب", role:"مزوّد خدمة", cat:"كهربائي", verified:false, status:"موقوف", joined:"2026/05"},
  {id:"u5", name:"منى العبيدي", role:"باحث عن عمل", cat:"مالية", verified:true, status:"نشط", joined:"2026/06"}
];

var ADMIN_JOBS = [
  {id:"aj1", title:"محاسب مالي", company:"شركة الأفق", status:"منشور", flag:false},
  {id:"aj2", title:"سائق خاص", company:"عائلة آل زيدان", status:"بانتظار المراجعة", flag:true},
  {id:"aj3", title:"مبرمج تطبيقات", company:"TechLy", status:"منشور", flag:false}
];

var ADMIN_COURSES = [
  {id:"ac1", title:"كن سباكاً معتمداً", instructor:"خالد المنصوري", status:"منشور"},
  {id:"ac2", title:"تصميم مواقع للمبتدئين", instructor:"سارة الحاسي", status:"بانتظار المراجعة"}
];

var ANALYTICS = {
  kpis: { activeUsers: 12840, bookings: 3240, applications: 1870, revenue: 48200 },
  revenueByModule: [ {m:"خدمات", v:26000, c:"#123B5E"}, {m:"دورات", v:14200, c:"#4AA3E0"}, {m:"وظائف", v:8000, c:"#2ECC71"} ],
  growth: [12, 18, 15, 22, 28, 26, 34, 31, 40, 45, 42, 52],
  topCategories: [ {n:"سباكة", v:612}, {n:"كهرباء", v:540}, {n:"نقل أثاث", v:430}, {n:"وايت مياه", v:388}, {n:"مكيفات", v:301} ]
};

var PLATFORM_SETTINGS = { commission: 12, featured:["سباكة","كهرباء","وايت مياه"], broadcast:"مرحباً بكم في JobEzz!" };
