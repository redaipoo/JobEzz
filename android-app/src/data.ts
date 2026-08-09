export const JOB_FILTERS = [
  { id: 'all', name: 'الكل', icon: 'all' },
  { id: 'fulltime', name: 'دوام كامل', icon: 'jobs' },
  { id: 'parttime', name: 'دوام جزئي', icon: 'clock' },
  { id: 'remote', name: 'عن بُعد', icon: 'pin' },
  { id: 'contract', name: 'عقد', icon: 'doc' },
];

export const CATEGORIES = [
  { id: 'plumber', name: 'سباك', icon: 'wrench', mode: 'instant' },
  { id: 'electrician', name: 'كهربائي', icon: 'bolt', mode: 'instant' },
  { id: 'carpenter', name: 'نجار', icon: 'hammer', mode: 'quote' },
  { id: 'painter', name: 'دهان', icon: 'brush', mode: 'quote' },
  { id: 'ac', name: 'تكييف وثلاجات', icon: 'snowflake', mode: 'instant' },
  { id: 'mechanic', name: 'ميكانيكي', icon: 'car', mode: 'instant' },
  { id: 'appliance', name: 'تصليح أجهزة', icon: 'fridge', mode: 'instant' },
  { id: 'mason', name: 'بناء', icon: 'grid', mode: 'quote' },
  { id: 'welder', name: 'حداد ولحام', icon: 'fire', mode: 'quote' },
  { id: 'tiler', name: 'بلاط', icon: 'grid', mode: 'quote' },
  { id: 'gypsum', name: 'جبس وبورد', icon: 'building', mode: 'quote' },
  { id: 'satellite', name: 'أطباق لاقطة', icon: 'satellite', mode: 'instant' },
  { id: 'locksmith', name: 'مقاول أقفال', icon: 'lock', mode: 'instant' },
  { id: 'aluminum', name: 'ألمنيوم وزجاج', icon: 'aluminum', mode: 'quote' },
  { id: 'generator', name: 'مولدات', icon: 'settings', mode: 'instant' },
  { id: 'solar', name: 'طاقة شمسية', icon: 'sun', mode: 'quote' },
  { id: 'mover', name: 'نقل أثاث', icon: 'box', mode: 'instant' },
  { id: 'water', name: 'وايت مياه', icon: 'truck', mode: 'instant' },
  { id: 'cargo', name: 'بيك أب نقل', icon: 'truck', mode: 'instant' },
  { id: 'cleaning', name: 'تنظيف منازل', icon: 'broom', mode: 'instant' },
  { id: 'pest', name: 'مكافحة حشرات', icon: 'bug', mode: 'quote' },
  { id: 'garden', name: 'حدائق وتنسيق', icon: 'leaf', mode: 'quote' },
  { id: 'tailor', name: 'خياط', icon: 'scissors', mode: 'quote' },
  { id: 'photo', name: 'تصوير وفيديو', icon: 'camera', mode: 'quote' },
  { id: 'tutor', name: 'مدرس خصوصي', icon: 'book', mode: 'instant' },
  { id: 'driver', name: 'سائق خاص', icon: 'car', mode: 'instant' },
  { id: 'chef', name: 'طبخ وتقديم', icon: 'chef', mode: 'quote' },
  { id: 'event', name: 'تنسيق مناسبات', icon: 'sparkle', mode: 'quote' },
  { id: 'barber', name: 'حلاق منزلي', icon: 'scissors', mode: 'instant' }
];

export const PROVIDERS = [
  { id: 'p1', name: 'أحمد العريبي', cat: 'سباك', icon: 'wrench', verified: true, rating: 4.9, jobs: 312, price: 'يبدأ من 25 د.ل/ساعة', dist: '1.2 كم', eta: '8 دقائق', online: true, cert: 'معتمد من JobEzz', trustBadges: ['موثّق الهوية', 'سريع الاستجابة', 'موثوق'], responseTime: '< 5 دقائق', completionRate: 98 },
  { id: 'p2', name: 'محمد الفيتوري', cat: 'كهربائي', icon: 'bolt', verified: true, rating: 4.8, jobs: 540, price: 'يبدأ من 30 د.ل/ساعة', dist: '2.0 كم', eta: '12 دقيقة', online: true, cert: 'موثّق الهوية', trustBadges: ['موثّق الهوية', 'أكثر من 500 مهمة'], responseTime: '< 10 دقائق', completionRate: 96 },
  { id: 'p3', name: 'سلامة القطراني', cat: 'نقل أثاث', icon: 'box', verified: false, rating: 4.5, jobs: 88, price: 'يبدأ من 80 د.ل/رحلة', dist: '3.4 كم', eta: '18 دقيقة', online: false, trustBadges: [], responseTime: '15-30 دقيقة', completionRate: 92 },
  { id: 'p4', name: 'عبدالسلام بن عيسى', cat: 'وايت مياه', icon: 'truck', verified: true, rating: 4.7, jobs: 210, price: '120 د.ل/وايت', dist: '0.8 كم', eta: '5 دقائق', online: true, cert: 'موثّق الهوية', trustBadges: ['موثّق الهوية', 'سريع الاستجابة'], responseTime: '< 3 دقائق', completionRate: 99 },
  { id: 'p5', name: 'إبراهيم الزنتاني', cat: 'مكيفات', icon: 'snowflake', verified: true, rating: 5.0, jobs: 401, price: 'يبدأ من 35 د.ل/ساعة', dist: '1.9 كم', eta: '11 دقيقة', online: true, cert: 'معتمد من JobEzz', trustBadges: ['موثّق الهوية', 'سريع الاستجابة', 'موثوق', 'أكثر من 400 مهمة'], responseTime: '< 5 دقائق', completionRate: 100 },
  { id: 'p6', name: 'يوسف المصراتي', cat: 'ميكانيكي', icon: 'car', verified: true, rating: 4.6, jobs: 176, price: 'يبدأ من 40 د.ل/ساعة', dist: '2.7 كم', eta: '15 دقيقة', online: true, trustBadges: ['موثّق الهوية'], responseTime: '< 15 دقيقة', completionRate: 95 }
];

/**
 * TECHNICIANS · rich profile data for the premium Services experience.
 * Linked to CATEGORIES via `catId`.
 */
export const TECHNICIANS = [
  { id: 't1', name: 'أحمد العريبي', cat: 'سباك', catId: 'plumber', icon: 'wrench', verified: true, rating: 4.9, reviews: 312, jobs: 540, years: 8, price: '25 د.ل/ساعة', priceMin: 25, dist: '1.2 كم', distKm: 1.2, eta: '8 دقائق', etaMin: 8, online: true, availability: 'متاح اليوم', emergency: true, gender: 'm', responseTime: '< 5 دقائق', responseMin: 5, completionRate: 98, cert: 'معتمد من JobEzz', trustBadges: ['موثّق الهوية', 'سريع الاستجابة', 'موثوق'], languages: ['العربية', 'الإنجليزية'], skills: ['تمديدات مياه', 'صيانة عامة', 'تسليك مجاري'], bio: 'سباك معتمد بخبرة 8 سنوات في أعمال التمديدات والصيانة المنزلية والتجارية. ألتزم بالمواعيد وأضمن جودة العمل حتى رضاك التام.', city: 'بنغازي', workingHours: '7:00 ص - 9:00 م', cover: '#1A5276' },
  { id: 't2', name: 'محمد الفيتوري', cat: 'كهربائي', catId: 'electrician', icon: 'bolt', verified: true, rating: 4.8, reviews: 540, jobs: 860, years: 12, price: '30 د.ل/ساعة', priceMin: 30, dist: '2.0 كم', distKm: 2.0, eta: '12 دقيقة', etaMin: 12, online: true, availability: 'متاح اليوم', emergency: true, gender: 'm', responseTime: '< 10 دقائق', responseMin: 10, completionRate: 96, cert: 'موثّق الهوية', trustBadges: ['موثّق الهوية', 'أكثر من 800 مهمة'], languages: ['العربية'], skills: ['تأسيس كهرباء', 'صيانة لوحات', 'إنارة'], bio: 'مهندس كهربائي بأكثر من 12 سنة خبرة. أعمل على التأسيسات الجديدة وإصلاح الأعطال بجميع أنواعها مع فحص شامل للسلامة.', city: 'بنغازي', workingHours: '8:00 ص - 10:00 م', cover: '#1B4F72' },
  { id: 't3', name: 'إبراهيم الزنتاني', cat: 'مكيفات', catId: 'ac', icon: 'snowflake', verified: true, rating: 5.0, reviews: 401, jobs: 620, years: 10, price: '35 د.ل/ساعة', priceMin: 35, dist: '1.9 كم', distKm: 1.9, eta: '11 دقيقة', etaMin: 11, online: true, availability: 'متاح اليوم', emergency: true, gender: 'm', responseTime: '< 5 دقائق', responseMin: 5, completionRate: 100, cert: 'معتمد من JobEzz', trustBadges: ['موثّق الهوية', 'سريع الاستجابة', 'موثوق', 'أكثر من 600 مهمة'], languages: ['العربية'], skills: ['تركيب مكيفات', 'صيانة وغاز', 'تكييف مركزي'], bio: 'متخصص في تركيب وصيانة جميع أنواع المكيفات (شباك، سبليت، مركزي) مع شحن غاز وفحص شامل بعد كل زيارة.', city: 'بنغازي', workingHours: '8:00 ص - 8:00 م', cover: '#0E4B6E' },
  { id: 't4', name: 'سلامة القطراني', cat: 'نقل أثاث', catId: 'mover', icon: 'box', verified: true, rating: 4.5, reviews: 88, jobs: 150, years: 4, price: '80 د.ل/رحلة', priceMin: 80, dist: '3.4 كم', distKm: 3.4, eta: '18 دقيقة', etaMin: 18, online: false, availability: 'متاح غداً', emergency: false, gender: 'm', responseTime: '15-30 دقيقة', responseMin: 22, completionRate: 92, trustBadges: ['أدوات كاملة'], languages: ['العربية'], skills: ['نقل فك وتركيب', 'تغليف', 'رفع وتحزيل'], bio: 'فريق نقل أثاث منظم · فك وتركيب وتغليف آمن مع سيارات مجهزة وتأمين على المقتنيات.', city: 'بنغازي', workingHours: '9:00 ص - 7:00 م', cover: '#6E3A0E' },
  { id: 't5', name: 'عبدالسلام بن عيسى', cat: 'وايت مياه', catId: 'water', icon: 'truck', verified: true, rating: 4.7, reviews: 210, jobs: 380, years: 6, price: '120 د.ل/وايت', priceMin: 120, dist: '0.8 كم', distKm: 0.8, eta: '5 دقائق', etaMin: 5, online: true, availability: 'متاح اليوم', emergency: true, gender: 'm', responseTime: '< 3 دقائق', responseMin: 3, completionRate: 99, cert: 'موثّق الهوية', trustBadges: ['موثّق الهوية', 'سريع الاستجابة'], languages: ['العربية'], skills: ['وايت مياه عذب', 'تعبئة فورية'], bio: 'توصيل مياه عذبة نقية بجميع الأحياء، أوقات مرنة واستجابة سريعة خلال دقائق.', city: 'بنغازي', workingHours: 'على مدار اليوم', cover: '#0E5C4E' },
  { id: 't6', name: 'يوسف المصراتي', cat: 'ميكانيكي', catId: 'mechanic', icon: 'car', verified: true, rating: 4.6, reviews: 176, jobs: 290, years: 9, price: '40 د.ل/ساعة', priceMin: 40, dist: '2.7 كم', distKm: 2.7, eta: '15 دقيقة', etaMin: 15, online: true, availability: 'متاح اليوم', emergency: true, gender: 'm', responseTime: '< 15 دقيقة', responseMin: 15, completionRate: 95, trustBadges: ['موثّق الهوية'], languages: ['العربية'], skills: ['صيانة عامة', 'كشف أعطال', 'ديزل وبنزين'], bio: 'ميكانيكي محترف في صيانة السيارات الخفيفة والشاحنات مع جهاز كشف أعطال حديث.', city: 'بنغازي', workingHours: '9:00 ص - 9:00 م', cover: '#2C3E50' },
  { id: 't7', name: 'خالد السويعي', cat: 'نجار', catId: 'carpenter', icon: 'hammer', verified: true, rating: 4.6, reviews: 89, jobs: 140, years: 7, price: '30 د.ل/ساعة', priceMin: 30, dist: '4.1 كم', distKm: 4.1, eta: '22 دقيقة', etaMin: 22, online: false, availability: 'متاح غداً', emergency: false, gender: 'm', responseTime: '< 20 دقيقة', responseMin: 20, completionRate: 94, cert: 'معتمد من JobEzz', trustBadges: ['معتمد من JobEzz'], languages: ['العربية'], skills: ['أثاث مخصص', 'أبواب وشبابيك', 'تشطيبات'], bio: 'نجار ماهر في الأثاث المخصص والتركيبات الخشبية بجودة عالية وأسعار منافسة.', city: 'بنغازي', workingHours: '9:00 ص - 6:00 م', cover: '#7A5C12' },
  { id: 't8', name: 'منى العبيدي', cat: 'تنظيف منازل', catId: 'cleaning', icon: 'broom', verified: true, rating: 4.9, reviews: 203, jobs: 320, years: 5, price: '20 د.ل/ساعة', priceMin: 20, dist: '1.5 كم', distKm: 1.5, eta: '10 دقائق', etaMin: 10, online: true, availability: 'متاح اليوم', emergency: false, gender: 'f', responseTime: '< 5 دقائق', responseMin: 5, completionRate: 99, cert: 'معتمد من JobEzz', trustBadges: ['موثّق الهوية', 'سريعة الاستجابة', 'موثوقة'], languages: ['العربية'], skills: ['تنظيف عميق', 'تعقيم', 'تنظيف بعد الصيانة'], bio: 'فريق تنظيف نسائي محترف · تنظيف عميق للمنازل والمكاتب بمواد آمنة وضمان رضا كامل.', city: 'بنغازي', workingHours: '9:00 ص - 6:00 م', cover: '#0E5C4E' },
  { id: 't9', name: 'طارق الأوجلي', cat: 'طاقة شمسية', catId: 'solar', icon: 'sun', verified: true, rating: 4.8, reviews: 67, jobs: 95, years: 6, price: '50 د.ل/ساعة', priceMin: 50, dist: '5.2 كم', distKm: 5.2, eta: '25 دقيقة', etaMin: 25, online: false, availability: 'متاح غداً', emergency: false, gender: 'm', responseTime: '< 30 دقيقة', responseMin: 30, completionRate: 97, cert: 'معتمد من JobEzz', trustBadges: ['معتمد من JobEzz'], languages: ['العربية', 'الإنجليزية'], skills: ['تركيب ألواح', 'أنظمة متكاملة', 'صيانة بطاريات'], bio: 'مهندس طاقة شمسية · تصميم وتركيب أنظمة المنازل والمزارع مع توفير الطاقة حتى 80%.', city: 'بنغازي', workingHours: '8:00 ص - 5:00 م', cover: '#1B4F72' },
  { id: 't10', name: 'هند الفلاح', cat: 'خياط', catId: 'tailor', icon: 'scissors', verified: true, rating: 4.7, reviews: 120, jobs: 260, years: 11, price: '15 د.ل/قطعة', priceMin: 15, dist: '2.3 كم', distKm: 2.3, eta: '14 دقيقة', etaMin: 14, online: true, availability: 'متاح اليوم', emergency: false, gender: 'f', responseTime: '< 10 دقائق', responseMin: 10, completionRate: 98, cert: 'موثّق الهوية', trustBadges: ['موثّق الهوية'], languages: ['العربية'], skills: ['تفصيل أزياء', 'تعديلات', 'خياطة يدوية'], bio: 'خياطة محترفة · تفصيل أزياء نسائية ورجالية وتعديلات سريعة بجودة عالية.', city: 'بنغازي', workingHours: '10:00 ص - 8:00 م', cover: '#7A1256' },
  { id: 't11', name: 'عمر الساعدي', cat: 'بناء', catId: 'mason', icon: 'grid', verified: true, rating: 4.4, reviews: 45, jobs: 70, years: 14, price: '45 د.ل/ساعة', priceMin: 45, dist: '3.9 كم', distKm: 3.9, eta: '20 دقيقة', etaMin: 20, online: false, availability: 'متاح بعد غد', emergency: false, gender: 'm', responseTime: '< 40 دقيقة', responseMin: 40, completionRate: 90, trustBadges: ['خبرة 14 سنة'], languages: ['العربية'], skills: ['بناء حوائط', 'تقسيمات', 'تشطيب خشن'], bio: 'معلم بناء بخبرة تزيد عن 14 سنة في أعمال البناء والتقسيمات والتشطيبات الخشنة.', city: 'بنغازي', workingHours: '7:00 ص - 4:00 م', cover: '#5D6D7E' },
  { id: 't12', name: 'سالم التواتي', cat: 'مكافحة حشرات', catId: 'pest', icon: 'bug', verified: true, rating: 4.8, reviews: 155, jobs: 240, years: 7, price: '60 د.ل/زيارة', priceMin: 60, dist: '2.8 كم', distKm: 2.8, eta: '16 دقيقة', etaMin: 16, online: true, availability: 'متاح اليوم', emergency: true, gender: 'm', responseTime: '< 8 دقائق', responseMin: 8, completionRate: 96, cert: 'معتمد من JobEzz', trustBadges: ['معتمد من JobEzz', 'مواد آمنة'], languages: ['العربية'], skills: ['مبيدات آمنة', 'رش ضباب', 'مكافحة القوارض'], bio: 'متخصص مكافحة حشرات بمواد آمنة للعائلات والحيوانات الأليفة · ضمان 6 أشهر.', city: 'بنغازي', workingHours: '8:00 ص - 8:00 م', cover: '#7A2E12' },
  { id: 't13', name: 'محمد بن عمر', cat: 'مدرّس خصوصي', catId: 'tutor', icon: 'book', verified: true, rating: 4.9, reviews: 87, jobs: 130, years: 6, price: '20 د.ل/حصة', priceMin: 20, dist: '1.0 كم', distKm: 1.0, eta: '6 دقائق', etaMin: 6, online: true, availability: 'متاح اليوم', emergency: false, gender: 'm', responseTime: '< 5 دقائق', responseMin: 5, completionRate: 100, cert: 'معتمد من JobEzz', trustBadges: ['موثّق الهوية', 'معدل تقييم 4.9'], languages: ['العربية', 'الإنجليزية', 'الفرنسية'], skills: ['رياضيات', 'فيزياء', 'لغات'], bio: 'مدرّس خصوصي للرياضيات والفيزياء لجميع المراحل · شرح مبسط ونتائج مضمونة.', city: 'بنغازي', workingHours: '4:00 م - 10:00 م', cover: '#1B4F72' },
  { id: 't14', name: 'نور الهدى', cat: 'تصوير وفيديو', catId: 'photo', icon: 'camera', verified: true, rating: 4.7, reviews: 64, jobs: 90, years: 5, price: '120 د.ل/جلسة', priceMin: 120, dist: '4.5 كم', distKm: 4.5, eta: '21 دقيقة', etaMin: 21, online: false, availability: 'متاح غداً', emergency: false, gender: 'f', responseTime: '< 25 دقيقة', responseMin: 25, completionRate: 95, cert: 'موثّق الهوية', trustBadges: ['موثّق الهوية'], languages: ['العربية'], skills: ['جلسات تصوير', 'تصوير منتجات', 'مونتاج'], bio: 'مصوّرة محترفة للجلسات الشخصية والمنتجات مع مونتاج وتسليم سريع بجودة عالية.', city: 'بنغازي', workingHours: '10:00 ص - 7:00 م', cover: '#5B1267' },
  { id: 't15', name: 'عبدالرحمن الشريف', cat: 'ألمنيوم وزجاج', catId: 'aluminum', icon: 'aluminum', verified: true, rating: 4.5, reviews: 52, jobs: 85, years: 9, price: '35 د.ل/ساعة', priceMin: 35, dist: '3.2 كم', distKm: 3.2, eta: '17 دقيقة', etaMin: 17, online: true, availability: 'متاح اليوم', emergency: false, gender: 'm', responseTime: '< 15 دقيقة', responseMin: 15, completionRate: 93, trustBadges: ['ورشة خاصة'], languages: ['العربية'], skills: ['شبابيك', 'مطابخ', 'واجهات زجاجية'], bio: 'متخصص أعمال الألمنيوم والزجاج · شبابيك ومطابخ وواجهات بقياسات دقيقة وضمان.', city: 'بنغازي', workingHours: '9:00 ص - 7:00 م', cover: '#0E3D6E' },
  { id: 't16', name: 'حسام الفرجاني', cat: 'حلاق منزلي', catId: 'barber', icon: 'scissors', verified: true, rating: 4.9, reviews: 233, jobs: 410, years: 6, price: '15 د.ل/زيارة', priceMin: 15, dist: '1.7 كم', distKm: 1.7, eta: '9 دقائق', etaMin: 9, online: true, availability: 'متاح اليوم', emergency: false, gender: 'm', responseTime: '< 5 دقائق', responseMin: 5, completionRate: 99, cert: 'معتمد من JobEzz', trustBadges: ['موثّق الهوية', 'سريع الاستجابة'], languages: ['العربية'], skills: ['قصة عصرية', 'حلاقة لحية', 'تنظيف بشرة'], bio: 'حلاق منزلي بأدوات معقمة · وصول لمنزلك في دقائق بأجواء راقية ونتيجة احترافية.', city: 'بنغازي', workingHours: '10:00 ص - 11:00 م', cover: '#0E4B3E' },
];

export const JOBS = [
  { id: 'j1', title: 'محاسب مالي', company: 'شركة الأفق للتجارة', logo: 'أ', cat: 'مالية ومحاسبة', type: 'دوام كامل', loc: 'بنغازي - السلماني', salary: '1800 - 2500 د.ل', date: 'اليوم', verified: true, skills: ['محاسبة', 'Excel', 'QBO'], color: '#1A5276', matchScore: 78, expLevel: 'متوسط', deadline: '2026/08/15', saved: false, applicants: 8 },
  { id: 'j2', title: 'مهندس برمجيات', company: 'TechLy Valley', logo: 'T', cat: 'تقنية المعلومات', type: 'عن بُعد', loc: 'طرابلس', salary: '3000+ د.ل', date: 'أمس', verified: true, skills: ['React', 'Node.js', 'TypeScript'], color: '#1B4F72', matchScore: 92, expLevel: 'متقدم', deadline: '2026/08/01', saved: true, applicants: 15 },
  { id: 'j3', title: 'كهربائي صيانة', company: 'مؤسسة النور', logo: 'ن', cat: 'صيانة وفنية', type: 'دوام كامل', loc: 'البيضاء', salary: '1500 د.ل', date: 'قبل يومين', verified: false, skills: ['تمديدات كهربائية', 'صيانة', 'أمان'], color: '#1A5276', matchScore: 65, expLevel: 'مبتدئ', deadline: '2026/08/20', saved: false, applicants: 3 },
  { id: 'j4', title: 'مندوب مبيعات', company: 'مجموعة الزهراء', logo: 'ز', cat: 'مبيعات وتسويق', type: 'جزئي', loc: 'مصراتة', salary: 'رواتب + عمولة', date: 'قبل 3 أيام', verified: true, skills: ['مبيعات', 'تسويق', 'علاقات عامة'], color: '#1B4F72', matchScore: 55, expLevel: 'مبتدئ', deadline: '2026/08/10', saved: false, applicants: 12 },
  { id: 'j5', title: 'مصمم جرافيك', company: 'استوديو إبداع', logo: 'إ', cat: 'تصميم وفنون', type: 'عقد', loc: 'طرابلس', salary: 'حسب المشروع', date: 'قبل 4 أيام', verified: false, skills: ['Figma', 'Photoshop', 'تصميم هوية'], color: '#1A5276', matchScore: 42, expLevel: 'متوسط', deadline: '2026/08/25', saved: false, applicants: 6 },
  { id: 'j6', title: 'سباك صيانة', company: 'مؤسسة الإنشاءات', logo: 'س', cat: 'صيانة وفنية', type: 'دوام كامل', loc: 'بنغازي', salary: '1200 - 1800 د.ل', date: 'اليوم', verified: true, skills: ['أعمال سباكة', 'تمديدات مياه', 'صيانة'], color: '#1B4F72', matchScore: 95, expLevel: 'متوسط', deadline: '2026/08/12', saved: true, applicants: 5 },
  { id: 'j7', title: 'ميكانيكي سيارات', company: 'ورشة البركة', logo: 'ب', cat: 'صيانة وفنية', type: 'دوام كامل', loc: 'طرابلس', salary: '1600 - 2200 د.ل', date: 'اليوم', verified: true, skills: ['صيانة ميكانيكية', 'كشف أعطال', 'ديزل'], color: '#1A5276', matchScore: 38, expLevel: 'متقدم', deadline: '2026/08/05', saved: false, applicants: 9 },
];

export const COURSES = [
  { id: 'c1', title: 'كن سباكاً معتمداً', sub: 'دورة احترافية في أعمال السباكة الحديثة', cat: 'مهارات حرفية', lessons: 18, hours: 9, students: 1240, rating: 4.8, price: 'مجاني', icon: 'wrench', cert: true, level: 'مبتدئ - متوسط', color: '#1A5276' },
  { id: 'c2', title: 'أساسيات الكهرباء المنزلية', sub: 'التأسيس والصيانة بأمان', cat: 'مهارات حرفية', lessons: 14, hours: 7, students: 980, rating: 4.7, price: '45 د.ل', icon: 'bolt', cert: true, level: 'مبتدئ', color: '#1B4F72' },
  { id: 'c3', title: 'تطوير الويب للمبتدئين', sub: 'HTML, CSS, JavaScript خطوة بخطوة', cat: 'تقنية', lessons: 32, hours: 16, students: 3400, rating: 4.9, price: 'مجاني', icon: 'monitor', cert: true, level: 'مبتدئ', color: '#1A5276' },
  { id: 'c4', title: 'الإنجليزية للأعمال', sub: 'محادثة ولغة مهنية', cat: 'لغات', lessons: 24, hours: 12, students: 2100, rating: 4.6, price: '60 د.ل', icon: 'globe', cert: true, level: 'متوسط', color: '#1B4F72' },
  { id: 'c5', title: 'إدارة المشاريع PMP', sub: 'تخطيط وتنفيذ المشاريع باحترافية', cat: 'أعمال', lessons: 20, hours: 11, students: 760, rating: 4.8, price: '90 د.ل', icon: 'chart', cert: true, level: 'متقدم', color: '#1A5276' },
  { id: 'c6', title: 'تصميم الديكور الداخلي', sub: 'مبادئ وتطبيق عملي', cat: 'فنون', lessons: 16, hours: 8, students: 540, rating: 4.5, price: 'مجاني', icon: 'sparkle', cert: true, level: 'مبتدئ', color: '#1B4F72' },
  { id: 'c7', title: 'اللحمة والحدادة المتقدمة', sub: 'تقنيات اللحام الكهربائي والغاز', cat: 'مهارات حرفية', lessons: 22, hours: 12, students: 680, rating: 4.7, price: '55 د.ل', icon: 'fire', cert: true, level: 'متوسط - متقدم', color: '#1A5276' },
  { id: 'c8', title: 'صيانة مكيفات وتكييف مركزي', sub: 'تشخيص وإصلاح الأعطال', cat: 'مهارات حرفية', lessons: 12, hours: 6, students: 920, rating: 4.8, price: '40 د.ل', icon: 'snowflake', cert: true, level: 'متوسط', color: '#1B4F72' },
];

export const FEATURED_ARTISANS = [
  { id: 'fa1', name: 'يوسف المنفي', skill: 'سباك معتمد', rating: 4.8, reviews: 127, color: '#1A5276', initial: 'ي' },
  { id: 'fa2', name: 'أحمد العريبي', skill: 'كهربائي', rating: 4.9, reviews: 312, color: '#1B4F72', initial: 'أ' },
  { id: 'fa3', name: 'محمد الفيتوري', skill: 'ميكانيكي', rating: 4.7, reviews: 198, color: '#1A5276', initial: 'م' },
  { id: 'fa4', name: 'خالد السويعي', skill: 'نجار', rating: 4.6, reviews: 89, color: '#1B4F72', initial: 'خ' },
  { id: 'fa5', name: 'إبراهيم الزنتاني', skill: 'مكيفات', rating: 5.0, reviews: 401, color: '#1A5276', initial: 'إ' },
];

export const CHATS = [
  { id: 'm1', name: 'أحمد العريبي', role: 'سباك • موثّق', icon: 'wrench', verified: true, last: 'سأكون عندك خلال 8 دقائق ', time: 'الآن', online: true },
  { id: 'm2', name: 'شركة الأفق للتجارة', role: 'صاحب عمل', icon: 'building', verified: true, last: 'شكراً لطلبك، سنراجع سيرتك', time: '10:24', online: false },
  { id: 'm3', name: 'مدرّب الدورة: خالد', role: 'مدرّب • أكاديمية JobEzz', icon: 'school', verified: true, last: 'تم رفع الدرس الثالث', time: 'أمس', online: true }
];

export const NOTIFS = [
  { id: 'n1', icon: 'bell', title: 'طلبك قيد التنفيذ', body: 'أحمد العريبي في الطريق إليك الآن.', time: 'الآن' },
  { id: 'n2', icon: 'jobs', title: 'وظيفة جديدة مطابقة', body: 'محاسب مالي في بنغازي تطابق مع ملفك.', time: '30 د' },
  { id: 'n3', icon: 'star', title: 'تقييم جديد', body: 'حصلت على 5 نجوم من عميلك الأخير.', time: 'ساعة' },
  { id: 'n4', icon: 'school', title: 'تذكير بالدورة', body: 'درس جديد متاح في دورة السباكة المعتمدة.', time: 'أمس' }
];

export const USER = {
  id: 'u1',
  name: 'يوسف المنفي', phone: '+218 91 234 5678', city: 'بنغازي',
  roles: ['customer', 'jobseeker', 'student'], verified: true, wallet: 340, avatar: null,
  bio: 'سباك محترف وطالب في تكنولوجيا المعلومات',
  skills: ['سباكة', 'صيانة', 'HTML', 'CSS', 'Excel'],
  experience: '3 سنوات',
  education: 'بكالوريوس هندسة',
  profileCompletion: 72,
  totalReviews: 24,
  avgRating: 4.8,
  completedJobs: 12,
  savedJobs: ['j1', 'j2'],
};

export const MY_POSTINGS = [
  { id: 'mj1', title: 'محاسب مالي', cat: 'مالية ومحاسبة', loc: 'بنغازي', status: 'نشط', applicants: 8, type: 'دوام كامل' },
  { id: 'mj2', title: 'مندوب مبيعات', cat: 'مبيعات', loc: 'بنغازي', status: 'نشط', applicants: 5, type: 'جزئي' }
];

export const APPLICANTS = [
  { id: 'a1', name: 'عمر الساعدي', exp: '3 سنوات', verified: true, rating: 4.7, status: 'review' },
  { id: 'a2', name: 'منى العبيدي', exp: 'سنة واحدة', verified: true, rating: 4.5, status: 'shortlisted' },
  { id: 'a3', name: 'خالد التريكي', exp: '5 سنوات', verified: false, rating: 4.2, status: 'applied' },
  { id: 'a4', name: 'هند الفلاح', exp: 'سنتان', verified: true, rating: 4.8, status: 'rejected' }
];

export const APPLICATION_STATUS = {
  applied: { label: 'تم التقديم', color: '#8A97A3', bg: '#E7EBEF' },
  review: { label: 'قيد المراجعة', color: '#c97e10', bg: '#FEF4E3' },
  shortlisted: { label: 'مقصور عليك', color: '#2E8BD0', bg: '#E4F1FB' },
  rejected: { label: 'مرفوض', color: '#E74C3C', bg: '#FDECEA' },
  accepted: { label: 'مقبول', color: '#1e9c54', bg: '#E7F9EF' }
};

export const MY_APPLICATIONS = [
  { id: 'ja1', job: 'محاسب مالي', company: 'شركة الأفق', logo: 'أ', status: 'shortlisted', date: 'منذ يومين' },
  { id: 'ja2', job: 'مصمم جرافيك', company: 'استوديو إبداع', logo: 'إ', status: 'review', date: 'منذ 3 أيام' },
  { id: 'ja3', job: 'مندوب مبيعات', company: 'مجموعة الزهراء', logo: 'ز', status: 'applied', date: 'منذ أسبوع' },
  { id: 'ja4', job: 'كاتب محتوى', company: 'منصة نون', logo: 'ن', status: 'rejected', date: 'منذ أسبوعين' }
];

export const QUIZ = [
  { q: 'ما هو أول إجراء عند اكتشاف تسريب تحت الحوض؟', opts: ['إغلاق مصدر المياه', 'فتح الصنبور', 'تركه', 'إزالة الأرضية'], ans: 0 },
  { q: 'أي أداة تُستخدم لفك وصلات المواسير؟', opts: ['المفك', 'الشاقور', 'المطرقة', 'المقص'], ans: 1 }
];

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'الدفع عند الإنجاز', icon: 'money', desc: 'الافتراضي · الدفع نقداً عند الاكتمال', enabled: true },
  { id: 'bank', name: 'تحويل بنكي + إيصال', icon: 'bank', desc: 'يرفع العميل صورة الإيصال للمطابقة', enabled: true },
  { id: 'gateway', name: 'بوابة دفع إلكترونية', icon: 'card', desc: 'قابلة للتوصيل لاحقاً (pluggable)', enabled: false }
];

export const INVOICES = [
  { id: 'INV-2041', type: 'خدمة سباكة', amount: 60, date: '2026/07/18', method: 'نقدي', pct: 12 },
  { id: 'INV-2033', type: 'دورة: السباكة المعتمدة', amount: 45, date: '2026/07/12', method: 'تحويل بنكي', pct: 10 },
  { id: 'INV-2028', type: 'نشر وظيفة (مدفوعة)', amount: 30, date: '2026/07/05', method: 'بوابة (تجريبي)', pct: 0 }
];

export const PLATFORM_SETTINGS = { commission: 12, featured: ['سباكة', 'كهرباء', 'وايت مياه'] };

export const MY_COURSES = [
  { courseId: 'c1', progress: 60, lastLesson: 11, enrolled: true, streak: 5, xp: 340 },
  { courseId: 'c3', progress: 25, lastLesson: 8, enrolled: true, streak: 2, xp: 120 },
];

export const ACHIEVEMENTS = [
  { id: 'a1', icon: 'fire', title: 'مشعل النار', desc: 'سلسلة 5 أيام متتالية', unlocked: true },
  { id: 'a2', icon: 'school', title: 'خريج متميز', desc: 'أكمل أول دورة', unlocked: false },
  { id: 'a3', icon: 'bolt', title: 'سريع التعلم', desc: 'أكمل 3 دروس في يوم', unlocked: true },
  { id: 'a4', icon: 'shield', title: 'محصّن المهارات', desc: 'احصل على 3 شهادات', unlocked: false },
  { id: 'a5', icon: 'starFill', title: 'نجم المجتمع', desc: 'شارك 10 مراجعات', unlocked: false },
  { id: 'a6', icon: 'trophy', title: 'محترف موثّق', desc: 'أكمل 5 دورات معتمدة', unlocked: false },
];

export const XP_LEVELS = [
  { level: 1, label: 'مبتدئ', minXp: 0 },
  { level: 2, label: 'متعلم', minXp: 200 },
  { level: 3, label: 'متمكّن', minXp: 500 },
  { level: 4, label: 'خبير', minXp: 1000 },
  { level: 5, label: 'محترف', minXp: 2000 },
];

export const LEADERBOARD = [
  { rank: 1, name: 'أحمد العريبي', xp: 1240, badge: 'crown' },
  { rank: 2, name: 'محمد الفيتوري', xp: 980, badge: 'star' },
  { rank: 3, name: 'يوسف المنفي', xp: 460, badge: 'trophy' },
];
