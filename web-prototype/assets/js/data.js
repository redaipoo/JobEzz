/* ============================================================
   JobEzz — Mock data store
   All data is local/in-memory for the prototype.
   ============================================================ */

var getCatIco = function(id, size) {
  if (window.catIcon) return window.catIcon(id, size || 26);
  return '';
};

var CATEGORIES = [
  {id:"plumber", name:"سباك", mode:"instant"},
  {id:"electrician", name:"كهربائي", mode:"instant"},
  {id:"carpenter", name:"نجار", mode:"quote"},
  {id:"painter", name:"دهان", mode:"quote"},
  {id:"ac", name:"تكييف وثلاجات", mode:"instant"},
  {id:"mechanic", name:"ميكانيكي", mode:"instant"},
  {id:"appliance", name:"تصليح أجهزة", mode:"instant"},
  {id:"mason", name:"بناء", mode:"quote"},
  {id:"welder", name:"حداد ولحام", mode:"quote"},
  {id:"tiler", name:"بلاط", mode:"quote"},
  {id:"gypsum", name:"جبس وبورد", mode:"quote"},
  {id:"satellite", name:"أطباق لاقطة", mode:"instant"},
  {id:"locksmith", name:"مقاول أقفال", mode:"instant"},
  {id:"aluminum", name:"ألمنيوم وزجاج", mode:"quote"},
  {id:"generator", name:"مولدات", mode:"instant"},
  {id:"solar", name:"طاقة شمسية", mode:"quote"},
  {id:"mover", name:"نقل أثاث", mode:"instant"},
  {id:"water", name:"وايت مياه", mode:"instant"},
  {id:"cargo", name:"بيك أب نقل", mode:"instant"},
  {id:"cleaning", name:"تنظيف منازل", mode:"instant"},
  {id:"pest", name:"مكافحة حشرات", mode:"quote"},
  {id:"garden", name:"حدائق وتنسيق", mode:"quote"},
  {id:"tailor", name:"خياط", mode:"quote"},
  {id:"photo", name:"تصوير وفيديو", mode:"quote"},
  {id:"tutor", name:"مدرس خصوصي", mode:"instant"},
  {id:"driver", name:"سائق خاص", mode:"instant"},
  {id:"chef", name:"طبخ وتقديم", mode:"quote"},
  {id:"event", name:"تنسيق مناسبات", mode:"quote"},
  {id:"barber", name:"حلاق منزلي", mode:"instant"}
];

var PROVIDERS = [
  {id:"p1", name:"أحمد العريبي", cat:"سباك", catId:"plumber", verified:true, rating:4.9, jobs:312, price:"يبدأ من 25 د.ل/ساعة", dist:"1.2 كم", eta:"8 دقائق", online:true, cert:"معتمد من JobEzz"},
  {id:"p2", name:"محمد الفيتوري", cat:"كهربائي", catId:"electrician", verified:true, rating:4.8, jobs:540, price:"يبدأ من 30 د.ل/ساعة", dist:"2.0 كم", eta:"12 دقيقة", online:true, cert:"موثّق الهوية"},
  {id:"p3", name:"سلامة القطراني", cat:"نقل أثاث", catId:"mover", verified:false, rating:4.5, jobs:88, price:"يبدأ من 80 د.ل/رحلة", dist:"3.4 كم", eta:"18 دقيقة", online:false},
  {id:"p4", name:"عبدالسلام بن عيسى", cat:"وايت مياه", catId:"water", verified:true, rating:4.7, jobs:210, price:"120 د.ل/وايت", dist:"0.8 كم", eta:"5 دقائق", online:true, cert:"موثّق الهوية"},
  {id:"p5", name:"إبراهيم الزنتاني", cat:"مكيفات", catId:"ac", verified:true, rating:5.0, jobs:401, price:"يبدأ من 35 د.ل/ساعة", dist:"1.9 كم", eta:"11 دقيقة", online:true, cert:"معتمد من JobEzz"},
  {id:"p6", name:"يوسف المصراتي", cat:"ميكانيكي", catId:"mechanic", verified:true, rating:4.6, jobs:176, price:"يبدأ من 40 د.ل/ساعة", dist:"2.7 كم", eta:"15 دقيقة", online:true}
];

var JOBS = [
  {id:"j1", title:"محاسب مالي", company:"شركة الأفق للتجارة", cat:"مالية ومحاسبة", type:"دوام كامل", loc:"بنغازي - السلماني", salary:"1800 - 2500 د.ل", date:"اليوم", verified:true},
  {id:"j2", title:"مهندس برمجيات", company:"TechLy Valley", cat:"تقنية المعلومات", type:"عن بُعد", loc:"طرابلس", salary:"3000+ د.ل", date:"أمس", verified:true},
  {id:"j3", title:"كهربائي صيانة", company:"مؤسسة النور", cat:"صيانة وفنية", type:"دوام كامل", loc:"البيضاء", salary:"1500 د.ل", date:"قبل يومين", verified:false},
  {id:"j4", title:"مندوب مبيعات", company:"مجموعة الزهراء", cat:"مبيعات وتسويق", type:"جزئي", loc:"مصراتة", salary:"رواتب + عمولة", date:"قبل 3 أيام", verified:true},
  {id:"j5", title:"مصمم جرافيك", company:"استوديو إبداع", cat:"تصميم وفنون", type:"عقد", loc:"طرابلس", salary:"حسب المشروع", date:"قبل 4 أيام", verified:false}
];

var COURSES = [
  {id:"c1", title:"كن سباكاً معتمداً", sub:"دورة احترافية في أعمال السباكة الحديثة", cat:"مهارات حرفية", lessons:18, hours:9, students:1240, rating:4.8, price:"مجاني", level:"مبتدئ→محترف", color:"#E4F1FB", cert:true},
  {id:"c2", title:"أساسيات الكهرباء المنزلية", sub:"التأسيس والصيانة بأمان", cat:"مهارات حرفية", lessons:14, hours:7, students:980, rating:4.7, price:"45 د.ل", level:"مبتدئ", color:"#FEF3C7", cert:true},
  {id:"c3", title:"تطوير الويب للمبتدئين", sub:"HTML, CSS, JavaScript خطوة بخطوة", cat:"تقنية", lessons:32, hours:16, students:3400, rating:4.9, price:"مجاني", level:"مبتدئ", color:"#DBEAFE", cert:true},
  {id:"c4", title:"الإنجليزية للأعمال", sub:"محادثة ولغة مهنية", cat:"لغات", lessons:24, hours:12, students:2100, rating:4.6, price:"60 د.ل", level:"متوسط", color:"#D1FAE5", cert:true},
  {id:"c5", title:"إدارة المشاريع PMP", sub:"تخطيط وتنفيذ المشاريع باحترافية", cat:"أعمال", lessons:20, hours:11, students:760, rating:4.8, price:"90 د.ل", level:"متقدم", color:"#EDE9FE", cert:true},
  {id:"c6", title:"تصميم الديكور الداخلي", sub:"مبادئ وتطبيق عملي", cat:"فنون", lessons:16, hours:8, students:540, rating:4.5, price:"مجاني", level:"مبتدئ", color:"#FEE2E2", cert:true}
];

var CHATS = [
  {id:"m1", name:"أحمد العريبي", role:"سباك • موثّق", catId:"plumber", verified:true, last:"سأكون عندك خلال 8 دقائق", time:"الآن", online:true},
  {id:"m2", name:"شركة الأفق للتجارة", role:"صاحب عمل", iconName:"building", verified:true, last:"شكراً لطلبك، سنراجع سيرتك", time:"10:24", online:false},
  {id:"m3", name:"مدرّب الدورة: خالد", role:"مدرّب • أكاديمية JobEzz", iconName:"school", verified:true, last:"تم رفع الدرس الثالث", time:"أمس", online:true}
];

var NOTIFS = [
  {id:"n1", icon:"bell", title:"طلبك قيد التنفيذ", body:"أحمد العريبي في الطريق إليك الآن.", time:"الآن", unread:true},
  {id:"n2", icon:"jobs", title:"وظيفة جديدة مطابقة", body:"محاسب مالي في بنغازي تطابق مع ملفك.", time:"30 د", unread:true},
  {id:"n3", icon:"star", title:"تقييم جديد", body:"حصلت على 5 نجوم من عميلك الأخير.", time:"ساعة", unread:false},
  {id:"n4", icon:"courses", title:"تذكير بالدورة", body:"درس جديد متاح في دورة السباكة المعتمدة.", time:"أمس", unread:false}
];

/* current user state (prototype) */
var USER = {
  name: "يوسف المنفي",
  phone: "+218 91 234 5678",
  city: "بنغازي",
  roles: ["customer","jobseeker","student"],
  verified: true,
  wallet: 340,
  avatar: null
};

if (typeof window !== 'undefined') {
  window.CATEGORIES = CATEGORIES;
  window.PROVIDERS = PROVIDERS;
  window.JOBS = JOBS;
  window.COURSES = COURSES;
  window.CHATS = CHATS;
  window.NOTIFS = NOTIFS;
  window.USER = USER;
}
