/* ============================================================
   JobEzz — App Logic v2.0
   Enhanced: State management, transitions, search, dark mode,
   loading states, accessibility, ripple effects
   ============================================================ */

/* ---------- State Management ---------- */
const Store = {
  _state: {
    screen: 'home',
    params: {},
    lang: 'ar',
    theme: 'light',
    providerMode: false,
    roles: ['customer', 'jobseeker', 'student'],
    user: { name: 'يوسف المنفي', phone: '+218 91 234 5678', city: 'بنغازي', verified: true, wallet: 340 },
    searchQuery: '',
    searchResults: null,
    loading: false,
    history: [],
    toasts: []
  },
  _listeners: [],

  get(key) { return this._state[key]; },
  set(key, value) {
    this._state[key] = value;
    this._notify();
  },
  update(partial) {
    Object.assign(this._state, partial);
    this._notify();
  },
  subscribe(fn) { this._listeners.push(fn); return () => { this._listeners = this._listeners.filter(l => l !== fn); }; },
  _notify() { this._listeners.forEach(fn => fn(this._state)); }
};

/* ---------- i18n ---------- */
let lang = Store.get('lang');
const T = {
  ar: {
    app:"JobEzz", home:"الرئيسية", jobs:"وظائف", services:"خدمات", courses:"دورات", profile:"حسابي",
    search:"ابحث عن وظيفة، خدمة أو دورة...", bookJob:"انشر وظيفة", requestSvc:"اطلب خدمة", browseCourses:"تصفّح الدورات",
    jobsP:"وظائف", servicesP:"خدمات", coursesP:"دورات", messages:"الرسائل", notifs:"الإشعارات",
    verified:"موثّق", online:"متصل الآن", offline:"غير متصل", wallet:"المحفظة", settings:"الإعدادات",
    lang:"اللغة", logout:"تسجيل الخروج", apply:"تقدّم الآن", details:"التفاصيل", book:"احجز",
    start:"ابدأ", next:"التالي", back:"رجوع", continue:"متابعة", send:"إرسال", confirm:"تأكيد",
    instant:"مطابقة فورية", quotes:"عروض أسعار", requestSent:"تم إرسال طلبك", tracking:"تتبّع المزوّد",
    pay:"ادفع الآن", rate:"قيّم التجربة", providerMode:"وضع مزوّد الخدمة", customerMode:"وضع العميل",
    filter:"تصفية", all:"الكل", newest:"الأحدث", rating:"التقييم", en:"English", ar:"العربية",
    employerDash:"لوحة صاحب العمل", instructorDash:"لوحة المدرّب", myApps:"طلباتي الوظيفية", saved:"المحفوظة",
    admin:"لوحة الأدمن (ويب)", darkMode:"الوضع الداكن", lightMode:"الوضع الفاتح",
    noResults:"لا توجد نتائج", tryAgain:"جرّب كلمات بحث مختلفة", loading:"جارٍ التحميل...",
    emptyJobs:"لا توجد وظائف متاحة حالياً", emptyCourses:"لا توجد دورات متاحة حالياً",
    emptyNotifs:"لا توجد إشعارات جديدة", emptyChats:"لا توجد محادثات بعد",
    searchPlaceholder:"ابحث هنا...", cancel:"إلغاء", seeAll:"عرض الكل",
    welcomeBack:"مرحباً بعودتك", goodMorning:"صباح الخير", goodEvening:"مساء الخير"
  },
  en: {
    app:"JobEzz", home:"Home", jobs:"Jobs", services:"Services", courses:"Courses", profile:"Account",
    search:"Search job, service or course...", bookJob:"Post a job", requestSvc:"Request a service", browseCourses:"Browse courses",
    jobsP:"Jobs", servicesP:"Services", coursesP:"Courses", messages:"Messages", notifs:"Notifications",
    verified:"Verified", online:"Online now", offline:"Offline", wallet:"Wallet", settings:"Settings",
    lang:"Language", logout:"Log out", apply:"Apply now", details:"Details", book:"Book",
    start:"Get started", next:"Next", back:"Back", continue:"Continue", send:"Send", confirm:"Confirm",
    instant:"Instant match", quotes:"Get quotes", requestSent:"Request sent", tracking:"Track provider",
    pay:"Pay now", rate:"Rate experience", providerMode:"Provider mode", customerMode:"Customer mode",
    filter:"Filter", all:"All", newest:"Newest", rating:"Rating", en:"English", ar:"العربية",
    employerDash:"Employer dashboard", instructorDash:"Instructor dashboard", myApps:"My applications", saved:"Saved",
    admin:"Admin (web)", darkMode:"Dark mode", lightMode:"Light mode",
    noResults:"No results found", tryAgain:"Try different search terms", loading:"Loading...",
    emptyJobs:"No jobs available right now", emptyCourses:"No courses available right now",
    emptyNotifs:"No new notifications", emptyChats:"No conversations yet",
    searchPlaceholder:"Search here...", cancel:"Cancel", seeAll:"See all",
    welcomeBack:"Welcome back", goodMorning:"Good morning", goodEvening:"Good evening"
  }
};
const t = (k) => (T[lang] && T[lang][k]) || T.ar[k] || k;

/* ---------- Theme Management ---------- */
function setTheme(theme) {
  Store.set('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('jobezz-theme', theme);
}
function initTheme() {
  const saved = localStorage.getItem('jobezz-theme');
  if (saved) { setTheme(saved); }
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { setTheme('dark'); }
  else { setTheme('light'); }
}
function toggleTheme() {
  const current = Store.get('theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
  toast(Store.get('theme') === 'dark' ? t('darkMode') : t('lightMode'));
}

/* ---------- SVG icons ---------- */
if (typeof window.ico !== 'function') {
  window.ico = function(name, size, color, sw) { return ''; };
}
if (typeof window.catIcon !== 'function') {
  window.catIcon = function(id, size, color) { return ''; };
}
const S = window.ICONS || {};

/* ---------- Reusable Components ---------- */
function verifiedBadge(){ return `<span class="verified" title="${t('verified')}" aria-label="${t('verified')}">${S.check || '✔'}</span>`; }

function stars(n){
  let s = '<span class="stars" role="img" aria-label="' + n + ' من 5">';
  for(let i=1;i<=5;i++){ s+=`<span class="star ${i<=Math.round(n)?'':'empty'}">★</span>`; }
  return s + '</span>';
}

function avatar(name, cls='', online=false){
  const c = (name||'؟').trim().charAt(0);
  return `<div class="avatar ${cls} ${online?'avatar-online':''}" aria-hidden="true">${c}</div>`;
}

function badge(txt, cls='badge-navy'){ return `<span class="badge ${cls}">${txt}</span>`; }

function skeletonCard(){
  return `<div class="card" style="padding:16px">
    <div class="row gap-12">
      <div class="skeleton skeleton-avatar"></div>
      <div style="flex:1">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text" style="width:80%"></div>
        <div class="skeleton skeleton-text" style="width:50%"></div>
      </div>
    </div>
  </div>`;
}

function emptyState(icon, title, desc){
  return `<div class="empty-state">
    <div class="empty-icon">${icon}</div>
    <div class="empty-title">${title}</div>
    <div class="empty-desc">${desc}</div>
  </div>`;
}

function searchBar(placeholder, action='do-search'){
  return `<div class="search-bar" role="search">
    <span class="search-icon">${window.ico('search', 16, 'var(--gray-400)')}</span>
    <input type="text" placeholder="${placeholder || t('search')}" 
           data-action="${action}" aria-label="${placeholder || t('search')}"
           value="${Store.get('searchQuery') || ''}">
  </div>`;
}

function sectionTitle(title, seeAllAction, seeAllLabel){
  return `<div class="section-title">
    <span>${title}</span>
    ${seeAllAction ? `<span class="see-all" data-action="${seeAllAction}" role="button" tabindex="0">${seeAllLabel || t('seeAll')}</span>` : ''}
  </div>`;
}

/* ---------- Ripple Effect ---------- */
function addRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

/* ---------- Toast ---------- */
const toastEl = document.getElementById('toast');
let toastTimer;
function toast(msg){
  if(!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toastEl.classList.remove('show'), 2600);
}

/* ---------- Navigation ---------- */
const state = Store._state;

function go(screen, params={}){
  state.history.push(state.screen);
  state.screen = screen;
  state.params = params;
  Store.set('searchQuery', '');
  Store.set('searchResults', null);
  render('forward');
}

function goBack(){
  const prev = state.history.pop() || 'home';
  state.screen = prev;
  state.params = {};
  render('back');
}

/* ---------- Search ---------- */
function performSearch(query) {
  if (!query || query.trim().length < 2) {
    Store.set('searchResults', null);
    return;
  }
  const q = query.trim().toLowerCase();
  const results = { jobs: [], services: [], courses: [] };

  JOBS.forEach(j => {
    if (j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.loc.toLowerCase().includes(q)) {
      results.jobs.push(j);
    }
  });
  CATEGORIES.forEach(c => {
    if (c.name.toLowerCase().includes(q)) {
      results.services.push(c);
    }
  });
  PROVIDERS.forEach(p => {
    if (p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)) {
      results.services.push(p);
    }
  });
  COURSES.forEach(c => {
    if (c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q)) {
      results.courses.push(c);
    }
  });

  Store.set('searchQuery', query);
  Store.set('searchResults', results);
}

function renderSearchResults() {
  const results = Store.get('searchResults');
  if (!results) return '';

  const total = results.jobs.length + results.services.length + results.courses.length;
  if (total === 0) {
    return emptyState(window.ico('search', 48, 'var(--gray-300)'), t('noResults'), t('tryAgain'));
  }

  let html = '<div class="stagger" style="padding:16px">';

  if (results.jobs.length) {
    html += sectionTitle(`${t('jobs')} (${results.jobs.length})`);
    results.jobs.forEach(j => {
      html += `<div class="job-card mb-12" data-action="job-detail" data-id="${j.id}" role="button" tabindex="0">
        <div class="row gap-12">
          <div class="avatar" style="background:${j.color||'var(--blue-100)'}">${j.logo||j.title.charAt(0)}</div>
          <div style="flex:1">
            <div class="fw-700">${j.title}</div>
            <div class="sub">${j.company} • ${j.loc}</div>
          </div>
          ${badge(j.type, 'badge-blue')}
        </div>
      </div>`;
    });
  }

  if (results.services.length) {
    html += sectionTitle(`${t('services')} (${results.services.length})`);
    results.services.forEach(s => {
      if (s.id && s.name && s.cat) {
        html += `<div class="provider-card mb-12" data-action="svc-track" data-id="${s.id}" role="button" tabindex="0">
          <div class="row gap-12">
            <div class="cat-icon" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center">${window.catIcon(s.id||'plumber', 22, 'var(--navy)')}</div>
            <div style="flex:1">
              <div class="fw-700">${s.name} ${s.verified?verifiedBadge():''}</div>
              <div class="sub">${s.cat} • ${s.dist||''}</div>
            </div>
            ${stars(s.rating||4.5)}
          </div>
        </div>`;
      } else {
        html += `<div class="cat-item mb-8" data-action="svc-request" data-id="${s.id}" role="button" tabindex="0" style="flex-direction:row;gap:10px;padding:12px">
          <span style="font-size:24px">${s.icon}</span>
          <span class="fw-600">${s.name}</span>
        </div>`;
      }
    });
  }

  if (results.courses.length) {
    html += sectionTitle(`${t('courses')} (${results.courses.length})`);
    results.courses.forEach(c => {
      html += `<div class="course-card mb-12" data-action="course-detail" data-id="${c.id}" role="button" tabindex="0">
        <div class="row gap-12">
          <div class="avatar" style="background:${c.color||'var(--blue-100)'};display:flex;align-items:center;justify-content:center">${window.ico('courses', 22, 'var(--navy)')}</div>
          <div style="flex:1">
            <div class="fw-700">${c.title}</div>
            <div class="sub">${c.instructor} • ${c.students||0} طالب</div>
          </div>
          ${stars(c.rating||4.5)}
        </div>
      </div>`;
    });
  }

  html += '</div>';
  return html;
}

/* ---------- Screen Renderers ---------- */
const app = document.getElementById('app');

function render(direction) {
  const screen = state.screen;
  let html = '';

  switch(screen) {
    case 'onboarding': html = renderOnboarding(); break;
    case 'role': html = renderRoleSelect(); break;
    case 'auth': html = renderAuth(); break;
    case 'otp': html = renderOtp(); break;
    case 'home': html = renderHome(); break;
    case 'jobs': html = renderJobs(); break;
    case 'services': html = renderServices(); break;
    case 'courses': html = renderCourses(); break;
    case 'profile': html = renderProfile(); break;
    case 'job-detail': html = renderJobDetail(); break;
    case 'job-apply': html = renderJobApply(); break;
    case 'svc-request': html = renderSvcRequest(); break;
    case 'svc-match': html = renderSvcMatch(); break;
    case 'svc-track': html = renderSvcTrack(); break;
    case 'svc-rate': html = renderSvcRate(); break;
    case 'course-detail': html = renderCourseDetail(); break;
    case 'course-learn': html = renderCourseLearn(); break;
    case 'course-quiz': html = renderCourseQuiz(); break;
    case 'certificate': html = renderCertificate(); break;
    case 'wallet': html = renderWallet(); break;
    case 'settings': html = renderSettings(); break;
    case 'chat-list': html = renderChatList(); break;
    case 'chat': html = renderChat(); break;
    case 'notifs': html = renderNotifs(); break;
    case 'provider': html = renderProvider(); break;
    case 'provider-active': html = renderProviderActive(); break;
    case 'employer-jobs': html = renderEmployerJobs(); break;
    case 'employer-post': html = renderEmployerPost(); break;
    case 'employer-applicants': html = renderEmployerApplicants(); break;
    case 'applications': html = renderApplications(); break;
    case 'saved-jobs': html = renderSavedJobs(); break;
    case 'instructor-dashboard': html = renderInstructorDash(); break;
    case 'reviews': html = renderReviews(); break;
    case 'report': html = renderReport(); break;
    case 'checkout': html = renderCheckout(); break;
    case 'invoice': html = renderInvoice(); break;
    default: html = renderHome();
  }

  const animClass = direction === 'back' ? 'anim-slide-l' : 'anim-fade-up';
  app.innerHTML = `<div class="screen ${animClass}" style="min-height:100vh">${html}</div>`;

  // Attach ripple to buttons
  app.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', addRipple, { once: false });
  });
}

/* ---------- Onboarding ---------- */
let onbSlide = 0;
function renderOnboarding(){
  const slides = [
    { id:'jobs', icon: window.ico('jobs', 64, '#FFFFFF', 1.8), t:'وظائف', d:'ابحث وتقدّم على أحدث الوظائف في ليبيا، أو انشر فرصتك كصاحب عمل.' },
    { id:'services', icon: window.ico('services', 64, '#FFFFFF', 1.8), t:'خدمات عند الطلب', d:'اطلب فنياً موثّقاً — سباك، كهربائي، نقال أثاث، وايت مياه — يصلك فوراً.' },
    { id:'courses', icon: window.ico('courses', 64, '#FFFFFF', 1.8), t:'أكاديمية JobEzz', d:'تعلّم مهارات جديدة واحصل على شهادات معتمدة ترفع موثوقيتك.' }
  ];
  const sl = slides[onbSlide];
  const last = onbSlide === slides.length - 1;
  return `
  <div class="hero-gradient" style="min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;padding:32px 24px">
    <div class="row between">
      <div style="font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.02em">JobEzz</div>
      <button class="btn btn-ghost btn-sm" style="background:rgba(255,255,255,.18);color:#fff;border-color:rgba(255,255,255,.3);border-radius:99px;padding:6px 14px" data-action="go-home">التجربة المباشرة ⚡</button>
    </div>
    <div style="text-align:center" class="anim-scale">
      <div style="margin-bottom:20px;display:flex;justify-content:center">${sl.icon}</div>
      <div class="h1" style="color:#fff;margin-bottom:12px">${sl.t}</div>
      <div style="color:rgba(255,255,255,.8);font-size:15px;line-height:1.7;max-width:300px;margin:0 auto">${sl.d}</div>
    </div>
    <div>
      <div style="display:flex;justify-content:center;gap:8px;margin-bottom:24px">
        ${slides.map((_,i)=>`<div style="width:${i===onbSlide?'24px':'8px'};height:8px;border-radius:99px;background:${i===onbSlide?'#fff':'rgba(255,255,255,.35)'};transition:all .3s"></div>`).join('')}
      </div>
      <button class="btn btn-accent btn-lg mb-10" data-action="go-home">دخول منصة JobEzz المباشر 🚀</button>
      <div class="row gap-12">
        <button class="btn btn-ghost" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.25);flex:1" data-action="go-role">إعداد الحساب</button>
        ${!last ? `<button class="btn btn-ghost" style="background:rgba(255,255,255,.25);color:#fff;border-color:#fff;flex:1" data-action="onb-next">التالي ←</button>` : ''}
      </div>
    </div>
  </div>`;
}

/* ---------- Role Select ---------- */
const selectedRoles = new Set(['customer','jobseeker','student']);
function renderRoleSelect(){
  const roles = [
    {id:'jobseeker', icon: window.ico('jobs', 32, 'var(--navy)'), n:'باحث عن عمل'},
    {id:'employer', icon: window.ico('building', 32, 'var(--navy)'), n:'صاحب عمل'},
    {id:'provider', icon: window.ico('services', 32, 'var(--navy)'), n:'مزوّد خدمة'},
    {id:'customer', icon: window.ico('user', 32, 'var(--navy)'), n:'عميل'},
    {id:'instructor', icon: window.ico('school', 32, 'var(--navy)'), n:'مدرّب'},
    {id:'student', icon: window.ico('courses', 32, 'var(--navy)'), n:'طالب'}
  ];
  return `
  <div style="min-height:100vh;background:var(--gray-bg);padding:24px 16px">
    <div class="anim-fade-up">
      <div class="h1 mb-8">اختر أدوارك</div>
      <div class="sub mb-20">يمكنك اختيار أكثر من دور — حساب واحد، أدوار متعددة.</div>
      <div class="cat-grid stagger" style="grid-template-columns:repeat(3,1fr);gap:12px">
        ${roles.map(r=>`
          <div class="cat-item ${selectedRoles.has(r.id)?'active':''}" data-action="toggle-role" data-id="${r.id}"
               style="padding:20px 12px;${selectedRoles.has(r.id)?'border-color:var(--blue);background:var(--blue-50);box-shadow:var(--sh-md)':''}"
               role="checkbox" aria-checked="${selectedRoles.has(r.id)}" tabindex="0">
            <div style="display:flex;justify-content:center">${r.icon}</div>
            <span class="cat-name" style="font-size:12px;margin-top:6px">${r.n}</span>
          </div>`).join('')}
      </div>
      <button class="btn btn-primary btn-lg mt-24" data-action="go-auth">${t('continue')}</button>
    </div>
  </div>`;
}

/* ---------- Auth ---------- */
function renderAuth(){
  return `
  <div style="min-height:100vh;background:var(--gray-bg);padding:24px 16px">
    <div class="anim-fade-up">
      <button class="btn btn-ghost btn-sm mb-16" data-action="go-back" style="width:auto">← ${t('back')}</button>
      <div class="h1 mb-8">تسجيل الدخول</div>
      <div class="sub mb-20">أدخل رقم هاتفك الليبي للمتابعة</div>
      <div class="card" style="padding:20px">
        <label class="fw-700" style="font-size:13px;color:var(--gray-700);display:block;margin-bottom:8px">رقم الهاتف</label>
        <div class="input-group">
          <input class="input" type="tel" placeholder="09X XXX XXXX" dir="ltr" style="text-align:left;padding-inline-start:16px" aria-label="رقم الهاتف">
        </div>
        <button class="btn btn-primary mt-16" data-action="go-otp">${t('send')}</button>
      </div>
      <div class="center mt-16 muted" style="font-size:13px">بالمتابعة أنت توافق على شروط الاستخدام وسياسة الخصوصية</div>
    </div>
  </div>`;
}

/* ---------- OTP ---------- */
function renderOtp(){
  return `
  <div style="min-height:100vh;background:var(--gray-bg);padding:24px 16px">
    <div class="anim-fade-up">
      <button class="btn btn-ghost btn-sm mb-16" data-action="go-back" style="width:auto">← ${t('back')}</button>
      <div class="h1 mb-8">رمز التحقق</div>
      <div class="sub mb-20">أدخل الرمز المرسل إلى <b dir="ltr">+218 91 234 5678</b></div>
      <div class="card" style="padding:20px">
        <div class="row gap-8" style="justify-content:center;direction:ltr" role="group" aria-label="رمز التحقق">
          ${[0,1,2,3].map(i=>`<input class="input" style="width:56px;height:60px;text-align:center;font-size:24px;font-weight:800" maxlength="1" inputmode="numeric" aria-label="الرقم ${i+1}">`).join('')}
        </div>
        <div class="center mt-12" style="font-size:13px;color:var(--gray-500)">
          إعادة الإرسال بعد <span class="countdown">00:45</span>
        </div>
        <button class="btn btn-primary mt-16" data-action="go-home">${t('confirm')}</button>
      </div>
    </div>
  </div>`;
}

/* ---------- Home ---------- */
function renderHome(){
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 18 ? t('welcomeBack') : t('goodEvening');
  const u = state.user;
  return `
  ${topBar()}
  <div style="padding:16px;padding-bottom:80px">
    <div class="anim-fade-up">
      <div class="row between mb-16">
        <div>
          <div class="sub">${greeting}</div>
          <div class="h2">${u.name}</div>
        </div>
        <div class="row gap-8">
          <button class="btn btn-ghost btn-sm" style="width:40px;height:40px;padding:0;border-radius:50%" data-action="go-notifs" aria-label="${t('notifs')}">
            <span class="notif-dot">${window.ico('bell', 20, 'var(--navy)')}</span>
          </button>
          <button class="btn btn-ghost btn-sm" style="width:40px;height:40px;padding:0;border-radius:50%" data-action="go-chat" aria-label="${t('messages')}">${window.ico('chat', 20, 'var(--navy)')}</button>
        </div>
      </div>

      ${searchBar(t('search'), 'do-search')}

      <div class="row gap-10 mt-16">
        <button class="btn btn-primary" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px" data-action="go-services">${window.ico('services', 18, '#FFFFFF')} ${t('requestSvc')}</button>
        <button class="btn btn-accent" style="flex:1;display:flex;align-items:center;justify-content:center;gap:6px" data-action="go-jobs">${window.ico('jobs', 18, '#FFFFFF')} ${t('bookJob')}</button>
      </div>

      <div class="mt-20">
        ${sectionTitle('فئات الخدمات', 'go-services', t('seeAll'))}
        <div class="cat-grid stagger">
          ${CATEGORIES.slice(0,8).map(c=>`
            <div class="cat-item" data-action="svc-request" data-id="${c.id}" role="button" tabindex="0">
              <div class="cat-icon">${window.catIcon(c.id, 28, 'var(--navy)')}</div>
              <div class="cat-name">${c.name}</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="mt-20">
        ${sectionTitle('أحدث الوظائف', 'go-jobs', t('seeAll'))}
        <div class="stagger">
          ${JOBS.slice(0,3).map(j=>`
            <div class="job-card mb-12" data-action="job-detail" data-id="${j.id}" role="button" tabindex="0">
              <div class="row gap-12">
                <div class="avatar" style="background:${j.color||'var(--blue-100)'};display:flex;align-items:center;justify-content:center">${window.ico('jobs', 20, 'var(--navy)')}</div>
                <div style="flex:1">
                  <div class="fw-700">${j.title}</div>
                  <div class="sub">${j.company} • ${j.loc}</div>
                </div>
                ${badge(j.type,'badge-blue')}
              </div>
            </div>`).join('')}
        </div>
      </div>

      <div class="mt-20">
        ${sectionTitle('دورات مقترحة', 'go-courses', t('seeAll'))}
        <div class="stagger">
          ${COURSES.slice(0,2).map(c=>`
            <div class="course-card mb-12" data-action="course-detail" data-id="${c.id}" role="button" tabindex="0">
              <div class="row gap-12">
                <div class="avatar" style="background:${c.color||'var(--blue-100)'};display:flex;align-items:center;justify-content:center">${window.ico('courses', 20, 'var(--navy)')}</div>
                <div style="flex:1">
                  <div class="fw-700">${c.title}</div>
                  <div class="sub">${c.sub || ''} • ${c.students||0} طالب</div>
                </div>
                <div style="text-align:end">
                  ${stars(c.rating||4.5)}
                  <div class="price-tag mt-4">${c.price||'مجاني'}</div>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
  ${bottomNav('home')}`;
}

/* ---------- Top Bar ---------- */
function topBar(){
  return `<div class="top-bar">
    <div class="row gap-8">
      <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--navy),var(--blue));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:14px">J</div>
      <span class="fw-800" style="font-size:18px">JobEzz</span>
    </div>
    <div class="row gap-8">
      <button class="btn btn-ghost btn-sm" style="width:36px;height:36px;padding:0;border-radius:50%;display:flex;align-items:center;justify-content:center" data-action="toggle-theme" aria-label="${t('darkMode')}">
        ${Store.get('theme')==='dark'?window.ico('sun',18,'#F5A623'):window.ico('settings',18,'var(--navy)')}
      </button>
    </div>
  </div>`;
}

/* ---------- Bottom Nav ---------- */
function bottomNav(active){
  const items = [
    {id:'home',icon:window.ico('home',20,active==='home'?'var(--navy)':'var(--gray-400)'),label:t('home')},
    {id:'jobs',icon:window.ico('jobs',20,active==='jobs'?'var(--navy)':'var(--gray-400)'),label:t('jobs')},
    {id:'services',icon:window.ico('services',20,active==='services'?'var(--navy)':'var(--gray-400)'),label:t('services')},
    {id:'courses',icon:window.ico('courses',20,active==='courses'?'var(--navy)':'var(--gray-400)'),label:t('courses')},
    {id:'profile',icon:window.ico('profile',20,active==='profile'?'var(--navy)':'var(--gray-400)'),label:t('profile')}
  ];
  return `<nav class="bottom-nav" role="navigation" aria-label="التنقل الرئيسي">
    ${items.map(it=>`
      <button class="nav-item ${active===it.id?'active':''}" data-action="nav-${it.id}" 
              aria-label="${it.label}" aria-current="${active===it.id?'page':'false'}" tabindex="0">
        <span class="nav-icon">${it.icon}</span>
        <span>${it.label}</span>
      </button>`).join('')}
  </nav>`;
}

/* ---------- Jobs ---------- */
function renderJobs(){
  const searchResults = Store.get('searchResults');
  return `
  ${headerBar(t('jobs'))}
  <div style="padding:16px;padding-bottom:80px">
    ${searchBar(t('search'), 'do-search')}
    <div class="row gap-8 mt-12 mb-16" style="overflow-x:auto;padding-bottom:4px">
      ${['الكل','دوام كامل','جزئي','عن بُعد','عقد'].map((f,i)=>`
        <button class="chip ${i===0?'active':''}" data-action="chip" role="tab" aria-selected="${i===0}">${f}</button>`).join('')}
    </div>
    <div class="stagger">
      ${JOBS.map(j=>`
        <div class="job-card mb-12" data-action="job-detail" data-id="${j.id}" role="button" tabindex="0">
          <div class="row gap-12">
            <div class="avatar" style="background:${j.color||'var(--blue-100)'};display:flex;align-items:center;justify-content:center">${window.ico('jobs', 20, 'var(--navy)')}</div>
            <div style="flex:1">
              <div class="fw-700">${j.title}</div>
              <div class="sub">${j.company} • ${j.loc}</div>
              <div class="row gap-6 mt-4">
                ${badge(j.type,'badge-blue')}
                <span class="muted" style="font-size:12px">${j.posted||'منذ يوم'}</span>
              </div>
            </div>
          </div>
        </div>`).join('')}
    </div>
  </div>
  ${bottomNav('jobs')}`;
}

/* ---------- Services ---------- */
function renderServices(){
  return `
  ${headerBar(t('services'))}
  <div style="padding:16px;padding-bottom:80px">
    ${searchBar('ابحث عن خدمة أو فني...', 'do-search')}
    <div class="mt-16">
      ${sectionTitle('جميع الفئات')}
      <div class="cat-grid stagger">
        ${CATEGORIES.map(c=>`
          <div class="cat-item" data-action="svc-request" data-id="${c.id}" role="button" tabindex="0">
            <div class="cat-icon">${window.catIcon(c.id, 28, 'var(--navy)')}</div>
            <div class="cat-name">${c.name}</div>
            <span class="tag mt-4" style="font-size:9px">${c.mode==='instant'?t('instant'):t('quotes')}</span>
          </div>`).join('')}
      </div>
    </div>
    <div class="mt-20">
      ${sectionTitle('فنيّون مميّزون')}
      <div class="stagger">
        ${PROVIDERS.slice(0,4).map(p=>`
          <div class="provider-card mb-12" data-action="svc-track" data-id="${p.id}" role="button" tabindex="0">
            <div class="row gap-12">
              ${avatar(p.name,'',p.online)}
              <div style="flex:1">
                <div class="fw-700">${p.name} ${p.verified?verifiedBadge():''}</div>
                <div class="sub">${p.cat} • ${p.dist}</div>
                <div class="row gap-6 mt-4">${stars(p.rating)} <span class="muted" style="font-size:12px">(${p.jobs})</span></div>
              </div>
              <div style="text-align:end">
                <div class="price-tag" style="font-size:13px">${p.price}</div>
                ${p.online?badge(t('online'),'badge-success'):badge(t('offline'),'badge-gray')}
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </div>
  ${bottomNav('services')}`;
}

/* ---------- Courses ---------- */
function renderCourses(){
  return `
  ${headerBar(t('courses'))}
  <div style="padding:16px;padding-bottom:80px">
    ${searchBar('ابحث عن دورة...', 'do-search')}
    <div class="row gap-8 mt-12 mb-16" style="overflow-x:auto">
      ${['الكل','سباكة','كهرباء','برمجة','تصميم','لغات'].map((f,i)=>`
        <button class="chip ${i===0?'active':''}" data-action="chip">${f}</button>`).join('')}
    </div>
    <div class="stagger">
      ${COURSES.map(c=>`
        <div class="course-card mb-12" data-action="course-detail" data-id="${c.id}" role="button" tabindex="0">
          <div style="height:100px;border-radius:var(--r-md);background:linear-gradient(135deg,${c.color||'var(--blue-100)'},var(--blue-50));display:flex;align-items:center;justify-content:center;margin-bottom:12px">${window.ico('courses', 40, 'var(--navy)')}</div>
          <div class="fw-700">${c.title}</div>
          <div class="sub mt-4">${c.instructor}</div>
          <div class="row between mt-8">
            <div class="row gap-6">${stars(c.rating||4.5)} <span class="muted" style="font-size:12px">(${c.students||0})</span></div>
            <div class="price-tag">${c.price||'مجاني'}</div>
          </div>
        </div>`).join('')}
    </div>
  </div>
  ${bottomNav('courses')}`;
}

/* ---------- Profile ---------- */
function renderProfile(){
  const u = state.user;
  return `
  ${headerBar(t('profile'))}
  <div style="padding:16px;padding-bottom:80px">
    <div class="card anim-fade-up" style="text-align:center;padding:24px">
      ${avatar(u.name,'avatar-xl')}
      <div class="h2 mt-12">${u.name} ${u.verified?verifiedBadge():''}</div>
      <div class="sub mt-4">${u.phone} • ${u.city}</div>
      <div class="row gap-8 mt-12" style="justify-content:center">
        ${state.roles.map(r=>badge(r==='customer'?'عميل':r==='jobseeker'?'باحث عن عمل':r==='student'?'طالب':r,'badge-navy')).join('')}
      </div>
    </div>

    <div class="row gap-10 mt-16">
      <div class="kpi"><div class="v num">${u.wallet} د.ل</div><div class="l">${t('wallet')}</div></div>
      <div class="kpi"><div class="v num">12</div><div class="l">طلبات مكتملة</div></div>
      <div class="kpi"><div class="v num">4.8</div><div class="l">التقييم</div></div>
    </div>

    <div class="mt-20 stagger">
      ${profileItem(window.ico('building',20,'var(--navy)'),t('employerDash'),'go-employer')}
      ${profileItem(window.ico('school',20,'var(--navy)'),t('instructorDash'),'go-instructor')}
      ${profileItem(window.ico('doc',20,'var(--navy)'),t('myApps'),'go-applications')}
      ${profileItem(window.ico('flag',20,'var(--navy)'),t('saved'),'go-saved')}
      ${profileItem(window.ico('wallet',20,'var(--navy)'),t('wallet'),'go-wallet')}
      ${profileItem(window.ico('services',20,'var(--navy)'),t('providerMode'),'toggle-provider')}
      ${profileItem(window.ico('settings',20,'var(--navy)'),t('settings'),'go-settings')}
      ${profileItem(window.ico('logout',20,'var(--danger-500)'),t('logout'),'logout')}
    </div>
  </div>
  ${bottomNav('profile')}`;
}

function profileItem(icon, label, action){
  return `<div class="list-item mb-8" data-action="${action}" role="button" tabindex="0">
    <span style="display:flex;align-items:center;justify-content:center;width:24px">${icon}</span>
    <span class="fw-600" style="flex:1">${label}</span>
    <span style="color:var(--gray-400)">‹</span>
  </div>`;
}

/* ---------- Header Bar ---------- */
function headerBar(title, showBack=false){
  return `<div class="header">
    ${showBack ? `<button class="back-btn" data-action="go-back" aria-label="${t('back')}">←</button>` : ''}
    <div class="title">${title}</div>
    <div class="row gap-8">
      <button class="btn btn-ghost btn-sm" style="width:36px;height:36px;padding:0;border-radius:50%;display:flex;align-items:center;justify-content:center" data-action="toggle-theme" aria-label="${t('darkMode')}">
        ${Store.get('theme')==='dark'?window.ico('sun',16,'#F5A623'):window.ico('settings',16,'var(--navy)')}
      </button>
    </div>
  </div>`;
}

/* ---------- Job Detail ---------- */
function renderJobDetail(){
  const j = JOBS.find(x=>x.id===state.params.id) || JOBS[0];
  return `
  ${headerBar(j.title, true)}
  <div style="padding:16px;padding-bottom:100px">
    <div class="card anim-fade-up">
      <div class="row gap-12">
        <div class="avatar avatar-lg" style="background:${j.color||'var(--blue-100)'};display:flex;align-items:center;justify-content:center">${window.ico('jobs', 28, 'var(--navy)')}</div>
        <div>
          <div class="h3">${j.title}</div>
          <div class="sub">${j.company} • ${j.loc}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="row gap-8 wrap">
        ${badge(j.type,'badge-blue')}
        ${badge(j.cat||'عام','badge-navy')}
        ${badge(j.salary||'حسب الخبرة','badge-success')}
      </div>
      <div class="divider"></div>
      <div class="fw-700 mb-8">الوصف الوظيفي</div>
      <div class="sub" style="line-height:1.8">${j.desc||'مطلوب موظف ذو خبرة للانضمام لفريقنا المتنامي. بيئة عمل محفزة وفرص تطور مهني.'}</div>
    </div>
    <div class="float-cta">
      <button class="btn btn-primary btn-lg" data-action="job-apply" data-id="${j.id}">${t('apply')}</button>
    </div>
  </div>`;
}

/* ---------- Job Apply ---------- */
function renderJobApply(){
  const j = JOBS.find(x=>x.id===state.params.id) || JOBS[0];
  return `
  ${headerBar('تقديم على الوظيفة', true)}
  <div style="padding:16px">
    <div class="card anim-fade-up">
      <div class="fw-700">${j.title}</div>
      <div class="sub">${j.company} • ${j.loc}</div>
    </div>
    <div class="card mt-12">
      <div class="row gap-10">
        <span style="color:var(--blue);display:flex;align-items:center">${window.ico('doc', 24, 'var(--blue)')}</span>
        <div style="flex:1"><div class="fw-700">السيرة_الذاتية.pdf</div><div class="sub">248 KB</div></div>
        ${badge('مرفق','badge-success')}
      </div>
    </div>
    <textarea class="input mt-12" style="height:100px;resize:vertical" placeholder="رسالة تعريف (اختياري)" aria-label="رسالة تعريف"></textarea>
    <button class="btn btn-primary mt-16" data-action="toast" data-msg="تم إرسال طلبك بنجاح ✓">${t('send')}</button>
  </div>`;
}

/* ---------- Service Request ---------- */
function renderSvcRequest(){
  const cat = CATEGORIES.find(c=>c.id===state.params.id) || CATEGORIES[0];
  return `
  ${headerBar(cat.name, true)}
  <div style="padding:16px">
    <div class="card anim-fade-up" style="text-align:center;padding:24px">
      <div style="display:flex;align-items:center;justify-content:center">${window.catIcon(cat.id, 48, 'var(--navy)')}</div>
      <div class="h3 mt-8">${cat.name}</div>
      ${badge(cat.mode==='instant'?t('instant'):t('quotes'), cat.mode==='instant'?'badge-success':'badge-warning')}
    </div>
    <div class="card mt-12">
      <label class="fw-700" style="font-size:13px;display:block;margin-bottom:8px">وصف المشكلة</label>
      <textarea class="input" style="height:90px;resize:vertical" placeholder="اشرح ما تحتاجه بالتفصيل..." aria-label="وصف المشكلة"></textarea>
      <label class="fw-700" style="font-size:13px;display:block;margin:12px 0 8px">الموقع</label>
      <div class="map-box" style="height:120px"><span class="map-pin">${window.ico('pin',20,'var(--danger-500)')}</span></div>
      <div class="row gap-8 mt-12">
        <button class="btn btn-ghost btn-sm" style="flex:1">${window.ico('photo',16,'var(--navy)')} إضافة صور</button>
        <button class="btn btn-ghost btn-sm" style="flex:1">${window.ico('pin',16,'var(--navy)')} تحديد الموقع</button>
      </div>
    </div>
    <button class="btn btn-primary btn-lg mt-16" data-action="svc-match" data-id="${cat.id}">
      ${cat.mode==='instant'?t('instant'):t('quotes')}
    </button>
  </div>`;
}

/* ---------- Service Match ---------- */
function renderSvcMatch(){
  return `
  ${headerBar('جارٍ البحث...', true)}
  <div style="padding:16px;text-align:center">
    <div class="anim-bounce" style="padding:40px 0">
      <div class="spinner" style="width:48px;height:48px;margin:0 auto 20px"></div>
      <div class="h3">جارٍ إيجاد أقرب فني متاح...</div>
      <div class="sub mt-8">عادةً يستغرق أقل من 30 ثانية</div>
    </div>
    <div class="card mt-16 anim-fade-up" style="animation-delay:.3s">
      <div class="row gap-12">
        ${avatar('أحمد','',true)}
        <div style="flex:1;text-align:start">
          <div class="fw-700">أحمد العريبي ${verifiedBadge()}</div>
          <div class="sub">سباك • 1.2 كم • 8 دقائق</div>
          ${stars(4.9)}
        </div>
        <div class="price-tag">25 د.ل/س</div>
      </div>
      <div class="row gap-8 mt-12">
        <button class="btn btn-primary" style="flex:1" data-action="svc-track">✓ قبول</button>
        <button class="btn btn-ghost" style="flex:1" data-action="toast" data-msg="تم الرفض">✕ رفض</button>
      </div>
    </div>
  </div>`;
}

/* ---------- Service Track ---------- */
function renderSvcTrack(){
  const p = PROVIDERS.find(x=>x.id===state.params.id) || PROVIDERS[0];
  return `
  ${headerBar(t('tracking'), true)}
  <div style="padding:16px;padding-bottom:100px">
    <div class="map-box anim-fade-up" style="height:200px"><span class="map-pin">${window.ico('pin',24,'var(--navy)')}</span></div>
    <div class="card mt-12">
      <div class="row gap-12">
        ${avatar(p.name,'',true)}
        <div style="flex:1">
          <div class="fw-700">${p.name} ${p.verified?verifiedBadge():''}</div>
          <div class="sub">${p.cat} • ${p.dist}</div>
        </div>
        <button class="btn btn-accent btn-sm" data-action="go-chat" data-id="${p.id}">${window.ico('chat',16,'#fff')}</button>
      </div>
      <div class="divider"></div>
      <div class="step"><div class="step-dot done">✓</div><div><div class="fw-600">تم قبول الطلب</div><div class="sub">منذ 3 دقائق</div></div></div>
      <div class="step"><div class="step-dot active">→</div><div><div class="fw-600">في الطريق إليك</div><div class="sub">الوصول خلال ~8 دقائق</div></div></div>
      <div class="step"><div class="step-dot">•</div><div><div class="fw-600">بدء العمل</div><div class="sub">بانتظار الوصول</div></div></div>
      <div class="step"><div class="step-dot">✓</div><div><div class="fw-600">إتمام العمل</div><div class="sub">—</div></div></div>
    </div>
    <div class="float-cta">
      <button class="btn btn-primary btn-lg" data-action="checkout" data-amount="60">${t('pay')} • 60 د.ل</button>
    </div>
  </div>`;
}

/* ---------- Service Rate ---------- */
function renderSvcRate(){
  return `
  ${headerBar(t('rate'), true)}
  <div style="padding:16px;text-align:center">
    <div class="anim-bounce" style="padding:30px 0">
      <div style="display:flex;justify-content:center">${window.ico('star', 56, '#F5A623')}</div>
      <div class="h2 mt-12">قيّم تجربتك</div>
      <div class="sub mt-4">كيف كانت خدمة أحمد العريبي؟</div>
    </div>
    <div class="row gap-8" style="justify-content:center;font-size:36px" role="radiogroup" aria-label="التقييم">
      ${[1,2,3,4,5].map(i=>`<button data-action="rate-star" data-val="${i}" style="transition:transform .15s" aria-label="${i} نجوم">${window.ico('star', 32, '#F5A623')}</button>`).join('')}
    </div>
    <textarea class="input mt-16" style="height:80px;resize:vertical;text-align:center" placeholder="أضف تعليقاً (اختياري)" aria-label="تعليق"></textarea>
    <button class="btn btn-primary btn-lg mt-16" data-action="toast" data-msg="شكراً لتقييمك! ⭐">إرسال التقييم</button>
  </div>`;
}

/* ---------- Course Detail ---------- */
function renderCourseDetail(){
  const c = COURSES.find(x=>x.id===state.params.id) || COURSES[0];
  return `
  ${headerBar(c.title, true)}
  <div style="padding:16px;padding-bottom:100px">
    <div class="anim-fade-up" style="height:160px;border-radius:var(--r-lg);background:linear-gradient(135deg,${c.color||'var(--blue-100)'},var(--blue-50));display:flex;align-items:center;justify-content:center">${window.ico('courses', 56, 'var(--navy)')}</div>
    <div class="card mt-12">
      <div class="h2">${c.title}</div>
      <div class="sub mt-4">${c.instructor} • ${c.students||0} طالب</div>
      <div class="row gap-8 mt-8">${stars(c.rating||4.5)} ${badge(c.level||'مبتدئ','badge-blue')}</div>
      <div class="divider"></div>
      <div class="fw-700 mb-8">ماذا ستتعلّم؟</div>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:8px">
        ${(c.learn||['أساسيات المهنة','التطبيق العملي','السلامة المهنية','الحصول على شهادة معتمدة']).map(l=>`<li class="row gap-8"><span style="color:var(--success)">✓</span><span class="sub">${l}</span></li>`).join('')}
      </ul>
    </div>
    <div class="card mt-12">
      <div class="fw-700 mb-8">محتوى الدورة</div>
      ${(c.lessons||['مقدمة وأساسيات','الأدوات والمعدات','التطبيق العملي','الاختبار النهائي']).map((l,i)=>`
        <div class="row gap-10" style="padding:10px 0;${i<3?'':'opacity:.5'}">
          <div class="step-dot ${i===0?'active':i<0?'done':''}" style="width:28px;height:28px;font-size:12px">${i+1}</div>
          <span class="fw-600" style="flex:1">${l}</span>
          <span class="muted" style="font-size:12px">${i===0?'▶':'◼'}</span>
        </div>`).join('')}
    </div>
    <div class="float-cta">
      <button class="btn btn-primary btn-lg" data-action="course-learn" data-id="${c.id}">
        ${c.price?'اشترك الآن • '+c.price:'ابدأ التعلّم مجاناً'}
      </button>
    </div>
  </div>`;
}

/* ---------- Course Learn ---------- */
function renderCourseLearn(){
  return `
  ${headerBar('الدرس الأول: مقدمة', true)}
  <div style="padding:16px">
    <div class="anim-fade-up" style="height:180px;border-radius:var(--r-lg);background:var(--navy);display:flex;align-items:center;justify-content:center;color:#fff;font-size:48px">▶</div>
    <div class="progress-bar mt-12"><div class="fill" style="width:25%"></div></div>
    <div class="row between mt-8"><span class="muted" style="font-size:12px">الدرس 1 من 4</span><span class="muted" style="font-size:12px">25%</span></div>
    <div class="card mt-16">
      <div class="h3">مقدمة وأساسيات السباكة</div>
      <div class="sub mt-8" style="line-height:1.8">في هذا الدرس سنتعرف على أساسيات مهنة السباكة، الأدوات الأساسية، وأنظمة المياه المنزلية. ستتعلم كيفية تحديد أنواع المواسير والوصلات المختلفة.</div>
    </div>
    <div class="row gap-8 mt-16">
      <button class="btn btn-ghost" style="flex:1" data-action="go-back">← السابق</button>
      <button class="btn btn-primary" style="flex:1" data-action="course-quiz">التالي: اختبار →</button>
    </div>
  </div>`;
}

/* ---------- Course Quiz ---------- */
function renderCourseQuiz(){
  const q = (typeof QUIZ!=='undefined'?QUIZ:[{q:'ما هو أول إجراء عند اكتشاف تسريب؟',opts:['إغلاق مصدر المياه','فتح الصنبور','تركه','إزالة الأرضية'],ans:0}])[0];
  return `
  ${headerBar('اختبار الدورة', true)}
  <div style="padding:16px">
    <div class="progress-bar mb-16"><div class="fill" style="width:50%"></div></div>
    <div class="card anim-fade-up">
      <div class="h3 mb-12">${q.q}</div>
      ${q.opts.map((o,i)=>`
        <div class="list-item mb-8" data-action="quiz-opt" data-idx="${i}" role="radio" tabindex="0"
             style="cursor:pointer">
          <div style="width:28px;height:28px;border-radius:50%;border:2px solid var(--gray-300);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0">${['أ','ب','ج','د'][i]}</div>
          <span class="fw-600">${o}</span>
        </div>`).join('')}
    </div>
    <button class="btn btn-primary btn-lg mt-16" data-action="certificate">إنهاء الاختبار</button>
  </div>`;
}

/* ---------- Certificate ---------- */
function renderCertificate(){
  return `
  ${headerBar('شهادة إتمام', true)}
  <div style="padding:16px;text-align:center">
    <div class="anim-bounce">
      <div class="qr-card" style="border:3px solid var(--warning);position:relative;overflow:hidden">
        <div style="position:absolute;top:0;left:0;right:0;height:6px;background:linear-gradient(90deg,var(--navy),var(--blue),var(--warning))"></div>
        <div style="margin:16px 0;display:flex;justify-content:center">${window.ico('gift', 44, 'var(--warning-500)')}</div>
        <div class="h2" style="color:var(--navy)">شهادة إتمام دورة</div>
        <div class="divider"></div>
        <div class="sub">تشهد منصة JobEzz بأن</div>
        <div class="h3 mt-4" style="color:var(--navy)">${state.user.name}</div>
        <div class="sub mt-4">قد أتمّ بنجاح دورة</div>
        <div class="fw-700 mt-4">كن سباكاً معتمداً</div>
        <div class="divider"></div>
        <div class="row between" style="font-size:12px;color:var(--gray-500)">
          <span>التاريخ: 2026/07/20</span>
          <span>الرمز: JZ-2026-0847</span>
        </div>
      </div>
    </div>
    <div class="row gap-8 mt-16">
      <button class="btn btn-primary" style="flex:1" data-action="toast" data-msg="تم تحميل الشهادة ✓">${window.ico('doc',16,'#fff')} تحميل</button>
      <button class="btn btn-ghost" style="flex:1" data-action="toast" data-msg="تمت المشاركة ✓">${window.ico('send',16,'var(--navy)')} مشاركة</button>
    </div>
  </div>`;
}

/* ---------- Wallet ---------- */
function renderWallet(){
  const u = state.user;
  return `
  ${headerBar(t('wallet'), true)}
  <div style="padding:16px">
    <div class="card anim-fade-up" style="background:linear-gradient(135deg,var(--navy-700),var(--navy));color:#fff;text-align:center;padding:28px">
      <div style="font-size:13px;opacity:.7">الرصيد المتاح</div>
      <div style="font-size:36px;font-weight:800;margin:8px 0" class="num">${u.wallet} د.ل</div>
      <div class="row gap-8 mt-12" style="justify-content:center">
        <button class="btn btn-accent btn-sm" data-action="toast" data-msg="تم إرسال طلب السحب ✓">سحب</button>
        <button class="btn btn-ghost btn-sm" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.25)" data-action="toast" data-msg="شحن المحفظة">شحن</button>
      </div>
    </div>
    <div class="mt-16">
      ${sectionTitle('آخر العمليات')}
      ${(typeof INVOICES!=='undefined'?INVOICES:[]).map(inv=>`
        <div class="list-item mb-8">
          <span style="display:flex;align-items:center">${window.ico(inv.type.includes('خدمة')?'services':inv.type.includes('دورة')?'courses':'jobs', 20, 'var(--navy)')}</span>
          <div style="flex:1"><div class="fw-600">${inv.type}</div><div class="sub">${inv.date} • ${inv.method}</div></div>
          <div class="price-tag">-${inv.amount} د.ل</div>
        </div>`).join('')}
    </div>
  </div>`;
}

/* ---------- Settings ---------- */
function renderSettings(){
  const isDark = Store.get('theme') === 'dark';
  return `
  ${headerBar(t('settings'), true)}
  <div style="padding:16px">
    <div class="card anim-fade-up">
      <div class="row between" style="padding:12px 0;border-bottom:1px solid var(--gray-100)">
        <div class="row gap-10"><span style="display:flex">${window.ico('settings',18,'var(--navy)')}</span><span class="fw-600">${t('darkMode')}</span></div>
        <div class="switch ${isDark?'on':''}" data-action="toggle-theme" role="switch" aria-checked="${isDark}" tabindex="0"><i></i></div>
      </div>
      <div class="row between" style="padding:12px 0;border-bottom:1px solid var(--gray-100)">
        <div class="row gap-10"><span style="display:flex">${window.ico('settings',18,'var(--navy)')}</span><span class="fw-600">${t('lang')}</span></div>
        <div class="row gap-8">
          <button class="chip ${lang==='ar'?'active':''}" data-action="set-lang" data-lang="ar" style="padding:6px 12px">العربية</button>
          <button class="chip ${lang==='en'?'active':''}" data-action="set-lang" data-lang="en" style="padding:6px 12px">English</button>
        </div>
      </div>
      <div class="row between" style="padding:12px 0;border-bottom:1px solid var(--gray-100)">
        <div class="row gap-10"><span style="display:flex">${window.ico('bell',18,'var(--navy)')}</span><span class="fw-600">الإشعارات</span></div>
        <div class="switch on" role="switch" aria-checked="true" tabindex="0"><i></i></div>
      </div>
      <div class="row between" style="padding:12px 0">
        <div class="row gap-10"><span style="display:flex">${window.ico('pin',18,'var(--navy)')}</span><span class="fw-600">الموقع</span></div>
        <span class="sub">بنغازي، ليبيا</span>
      </div>
    </div>
    <div class="card mt-12">
      <div class="row between" style="padding:12px 0;border-bottom:1px solid var(--gray-100)">
        <div class="row gap-10"><span style="display:flex">${window.ico('doc',18,'var(--navy)')}</span><span class="fw-600">شروط الاستخدام</span></div>
        <span style="color:var(--gray-400)">‹</span>
      </div>
      <div class="row between" style="padding:12px 0;border-bottom:1px solid var(--gray-100)">
        <div class="row gap-10"><span style="display:flex">${window.ico('shield',18,'var(--navy)')}</span><span class="fw-600">سياسة الخصوصية</span></div>
        <span style="color:var(--gray-400)">‹</span>
      </div>
      <div class="row between" style="padding:12px 0">
        <div class="row gap-10"><span style="display:flex">${window.ico('chat',18,'var(--navy)')}</span><span class="fw-600">المساعدة والدعم</span></div>
        <span style="color:var(--gray-400)">‹</span>
      </div>
    </div>
    <button class="btn btn-ghost mt-16" style="color:var(--danger-500);border-color:var(--danger-100)" data-action="logout">${window.ico('logout',16,'var(--danger-500)')} ${t('logout')}</button>
    <div class="center mt-16 muted" style="font-size:12px">JobEzz v2.0 • صُنع في ليبيا</div>
  </div>`;
}

/* ---------- Chat List ---------- */
function renderChatList(){
  const chats = typeof CHATS!=='undefined'?CHATS:[
    {id:'m1',name:'أحمد العريبي',last:'أنا في الطريق، 5 دقائق',time:'الآن',unread:2,online:true},
    {id:'m2',name:'شركة الأفق',last:'تم قبول طلبك',time:'ساعة',unread:0,online:false}
  ];
  return `
  ${headerBar(t('messages'), true)}
  <div style="padding:16px">
    ${chats.length ? `<div class="stagger">${chats.map(c=>`
      <div class="list-item mb-8" data-action="go-chat" data-id="${c.id}" role="button" tabindex="0">
        ${avatar(c.name,'',c.online)}
        <div style="flex:1">
          <div class="row between"><span class="fw-700">${c.name}</span><span class="muted" style="font-size:11px">${c.time}</span></div>
          <div class="sub" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.last}</div>
        </div>
        ${c.unread?`<span style="background:var(--blue);color:#fff;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">${c.unread}</span>`:''}
      </div>`).join('')}</div>`
    : emptyState(window.ico('chat', 48, 'var(--gray-300)'), t('emptyChats'), 'ابدأ محادثة مع فني أو صاحب عمل')}
  </div>`;
}

/* ---------- Chat ---------- */
function renderChat(){
  const msgs = [
    {from:'them',text:'مرحباً، أنا أحمد السباك. أنا في الطريق إليك.',time:'10:30'},
    {from:'me',text:'أهلاً أحمد، شكراً لسرعة الاستجابة!',time:'10:31'},
    {from:'them',text:'العفو، سأصل خلال 5 دقائق إن شاء الله.',time:'10:32'},
    {from:'me',text:'تمام، في انتظارك',time:'10:33'}
  ];
  return `
  ${headerBar('أحمد العريبي', true)}
  <div class="chat-container" style="height:calc(100vh - 56px)">
    <div class="chat-messages">
      ${msgs.map(m=>`
        <div class="bubble ${m.from==='me'?'out':'in'}">
          ${m.text}
          <div class="time">${m.time}</div>
        </div>`).join('')}
    </div>
    <div class="chat-input">
      <input class="input" placeholder="اكتب رسالة..." aria-label="رسالة">
      <button class="send-btn" data-action="toast" data-msg="تم الإرسال" aria-label="${t('send')}">➤</button>
    </div>
  </div>`;
}

/* ---------- Notifications ---------- */
function renderNotifs(){
  const notifs = typeof NOTIFS!=='undefined'?NOTIFS:[
    {id:'n1',icon:'services',title:'تم قبول طلبك',body:'أحمد العريبي في الطريق إليك.',time:'الآن'},
    {id:'n2',icon:'jobs',title:'تحديث طلب توظيف',body:'شركة الأفق قامت بمراجعة سيرتك الذاتية.',time:'ساعة'},
    {id:'n3',icon:'courses',title:'تذكير بالدورة',body:'درس جديد متاح في دورة السباكة المعتمدة.',time:'أمس'}
  ];
  return `
  ${headerBar(t('notifs'), true)}
  <div style="padding:16px">
    ${notifs.length ? `<div class="stagger">${notifs.map(n=>`
      <div class="list-item mb-8" role="article">
        <span style="display:flex;align-items:center">${window.ico(n.icon, 24, 'var(--navy)')}</span>
        <div style="flex:1">
          <div class="fw-700">${n.title}</div>
          <div class="sub">${n.body}</div>
        </div>
        <span class="muted" style="font-size:11px;white-space:nowrap">${n.time}</span>
      </div>`).join('')}</div>`
    : emptyState(window.ico('bell', 48, 'var(--gray-300)'), t('emptyNotifs'), 'ستظهر الإشعارات هنا عند وصولها')}
  </div>`;
}

/* ---------- Provider Dashboard ---------- */
function renderProvider(){
  return `
  ${headerBar('لوحة مزوّد الخدمة', true)}
  <div style="padding:16px;padding-bottom:80px">
    <div class="row gap-10 mb-16">
      <div class="kpi"><div class="v num">4.9</div><div class="l">التقييم</div></div>
      <div class="kpi"><div class="v num">312</div><div class="l">مهمة مكتملة</div></div>
      <div class="kpi"><div class="v num">1,240</div><div class="l">د.ل هذا الشهر</div></div>
    </div>
    <div class="card anim-fade-up" style="border:2px solid var(--blue);background:var(--blue-50)">
      <div class="row gap-12">
        <span style="display:flex;align-items:center">${window.ico('bell', 28, 'var(--navy)')}</span>
        <div style="flex:1">
          <div class="fw-700">طلب جديد!</div>
          <div class="sub">صيانة تسريب مياه • بنغازي، السلماني • 1.2 كم</div>
        </div>
      </div>
      <div class="row gap-8 mt-12">
        <button class="btn btn-primary" style="flex:1" data-action="provider-active">✓ قبول</button>
        <button class="btn btn-ghost" style="flex:1" data-action="toast" data-msg="تم الرفض">✕ رفض</button>
      </div>
    </div>
    <div class="mt-16">
      ${sectionTitle('مهام اليوم')}
      <div class="list-item mb-8"><span style="display:flex">${window.ico('check',18,'var(--success-500)')}</span><div style="flex:1"><div class="fw-600">إصلاح صنبور</div><div class="sub">09:00 - 10:30 • 45 د.ل</div></div></div>
      <div class="list-item mb-8"><span style="display:flex">${window.ico('check',18,'var(--success-500)')}</span><div style="flex:1"><div class="fw-600">تسليك مجاري</div><div class="sub">11:00 - 12:00 • 60 د.ل</div></div></div>
      <div class="list-item mb-8"><span style="display:flex">${window.ico('clock',18,'var(--warning-500)')}</span><div style="flex:1"><div class="fw-600">تركيب سخان مياه</div><div class="sub">14:00 • 80 د.ل</div></div></div>
    </div>
  </div>`;
}

/* ---------- Provider Active ---------- */
function renderProviderActive(){
  return `
  ${headerBar('مهمة نشطة', true)}
  <div style="padding:16px">
    <div class="map-box anim-fade-up" style="height:180px"><span class="map-pin">${window.ico('pin',24,'var(--navy)')}</span></div>
    <div class="card mt-12">
      <div class="row gap-12">
        ${avatar('يوسف')}
        <div style="flex:1"><div class="fw-700">يوسف المنفي</div><div class="sub">بنغازي • السلماني</div></div>
        <button class="btn btn-accent btn-sm" data-action="go-chat">${window.ico('chat',16,'#fff')}</button>
      </div>
      <div class="divider"></div>
      <div class="fw-700">تفاصيل المهمة</div>
      <div class="sub mt-4">صيانة تسريب وإبدال الوصلة.</div>
      <div class="row between mt-8"><span class="sub">الأجر المتفق</span><span class="price-tag">60 د.ل</span></div>
    </div>
    <button class="btn btn-success btn-lg mt-16" data-action="toast" data-msg="أحسنت! تم إكمال العمل ✓">✓ تم إكمال العمل</button>
  </div>`;
}

/* ---------- Employer ---------- */
function renderEmployerJobs(){
  const postings = typeof MY_POSTINGS!=='undefined'?MY_POSTINGS:[
    {id:'mj1',title:'محاسب مالي',loc:'بنغازي',type:'دوام كامل',status:'نشط',applicants:8},
    {id:'mj2',title:'مندوب مبيعات',loc:'بنغازي',type:'جزئي',status:'نشط',applicants:5}
  ];
  return `
  ${headerBar(t('employerDash'), true)}
  <div style="padding:16px">
    <button class="btn btn-primary mb-16" data-action="employer-post">＋ نشر وظيفة جديدة</button>
    <div class="stagger">
      ${postings.map(p=>`
        <div class="list-item mb-8" data-action="employer-applicants" data-id="${p.id}" role="button" tabindex="0">
          <div class="avatar" style="background:var(--navy);color:#fff">${p.title.charAt(0)}</div>
          <div style="flex:1"><div class="fw-700">${p.title}</div><div class="sub">${p.loc} • ${p.type}</div></div>
          <div style="text-align:end">${badge(p.status,'badge-success')}<div class="sub mt-4">${p.applicants} متقدّم</div></div>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderEmployerPost(){
  return `
  ${headerBar('نشر وظيفة', true)}
  <div style="padding:16px">
    <div class="card anim-fade-up">
      <label class="fw-700" style="font-size:13px;display:block;margin-bottom:8px">المسمى الوظيفي</label>
      <input class="input" placeholder="مثال: محاسب مالي" aria-label="المسمى الوظيفي">
      <label class="fw-700" style="font-size:13px;display:block;margin:12px 0 8px">الشركة</label>
      <input class="input" placeholder="اسم الشركة" aria-label="الشركة">
      <label class="fw-700" style="font-size:13px;display:block;margin:12px 0 8px">الموقع</label>
      <input class="input" placeholder="المدينة" aria-label="الموقع">
      <label class="fw-700" style="font-size:13px;display:block;margin:12px 0 8px">نوع الدوام</label>
      <div class="row gap-8">
        ${['دوام كامل','جزئي','عن بُعد','عقد'].map((f,i)=>`<button class="chip ${i===0?'active':''}" data-action="chip">${f}</button>`).join('')}
      </div>
      <label class="fw-700" style="font-size:13px;display:block;margin:12px 0 8px">الوصف</label>
      <textarea class="input" style="height:100px;resize:vertical" placeholder="وصف الوظيفة والمتطلبات..." aria-label="الوصف"></textarea>
    </div>
    <button class="btn btn-primary btn-lg mt-16" data-action="toast" data-msg="تم نشر الوظيفة بنجاح ✓">نشر الوظيفة</button>
  </div>`;
}

function renderEmployerApplicants(){
  const applicants = typeof APPLICANTS!=='undefined'?APPLICANTS:[
    {id:'a1',name:'عمر الساعدي',exp:'3 سنوات',verified:true,rating:4.7,status:'review'},
    {id:'a2',name:'منى العبيدي',exp:'سنة واحدة',verified:true,rating:4.5,status:'shortlisted'},
    {id:'a3',name:'خالد التريكي',exp:'5 سنوات',verified:false,rating:4.2,status:'applied'}
  ];
  const statusMap = {applied:{l:'تم التقديم',c:'badge-gray'},review:{l:'قيد المراجعة',c:'badge-warning'},shortlisted:{l:'مقصور',c:'badge-blue'},rejected:{l:'مرفوض',c:'badge-danger'},accepted:{l:'مقبول',c:'badge-success'}};
  return `
  ${headerBar('المتقدّمون', true)}
  <div style="padding:16px">
    <div class="stagger">
      ${applicants.map(a=>`
        <div class="card mb-12">
          <div class="row gap-12">
            ${avatar(a.name)}
            <div style="flex:1">
              <div class="fw-700">${a.name} ${a.verified?verifiedBadge():''}</div>
              <div class="sub">خبرة: ${a.exp}</div>
              ${stars(a.rating)}
            </div>
            ${badge(statusMap[a.status]?.l||a.status, statusMap[a.status]?.c||'badge-gray')}
          </div>
          <div class="row gap-8 mt-12">
            <button class="btn btn-primary btn-sm" style="flex:1" data-action="toast" data-msg="تم القبول ✓">قبول</button>
            <button class="btn btn-ghost btn-sm" style="flex:1" data-action="toast" data-msg="تم الرفض">رفض</button>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

/* ---------- Applications ---------- */
function renderApplications(){
  const apps = typeof MY_APPLICATIONS!=='undefined'?MY_APPLICATIONS:[
    {id:'ja1',job:'محاسب مالي',company:'شركة الأفق',logo:'أ',status:'shortlisted',date:'منذ يومين'},
    {id:'ja2',job:'مصمم جرافيك',company:'استوديو إبداع',logo:'إ',status:'review',date:'منذ 3 أيام'},
    {id:'ja3',job:'مندوب مبيعات',company:'مجموعة الزهراء',logo:'ز',status:'applied',date:'منذ أسبوع'}
  ];
  const statusMap = {applied:{l:'تم التقديم',c:'badge-gray'},review:{l:'قيد المراجعة',c:'badge-warning'},shortlisted:{l:'مقصور',c:'badge-blue'},rejected:{l:'مرفوض',c:'badge-danger'},accepted:{l:'مقبول',c:'badge-success'}};
  return `
  ${headerBar(t('myApps'), true)}
  <div style="padding:16px">
    <div class="stagger">
      ${apps.map(a=>`
        <div class="list-item mb-8">
          <div class="avatar">${a.logo}</div>
          <div style="flex:1"><div class="fw-700">${a.job}</div><div class="sub">${a.company} • ${a.date}</div></div>
          ${badge(statusMap[a.status]?.l||a.status, statusMap[a.status]?.c||'badge-gray')}
        </div>`).join('')}
    </div>
  </div>`;
}

/* ---------- Saved Jobs ---------- */
function renderSavedJobs(){
  return `
  ${headerBar(t('saved'), true)}
  <div style="padding:16px">
    ${JOBS.slice(0,2).map(j=>`
      <div class="job-card mb-12" data-action="job-detail" data-id="${j.id}" role="button" tabindex="0">
        <div class="row gap-12">
          <div class="avatar" style="background:${j.color||'var(--blue-100)'}">${j.logo||j.title.charAt(0)}</div>
          <div style="flex:1"><div class="fw-700">${j.title}</div><div class="sub">${j.company} • ${j.loc}</div></div>
          <span style="color:var(--warning)">🔖</span>
        </div>
      </div>`).join('')}
  </div>`;
}

/* ---------- Instructor Dashboard ---------- */
function renderInstructorDash(){
  return `
  ${headerBar(t('instructorDash'), true)}
  <div style="padding:16px">
    <div class="row gap-10 mb-16">
      <div class="kpi"><div class="v num">430</div><div class="l">طالب</div></div>
      <div class="kpi"><div class="v num">4.6</div><div class="l">التقييم</div></div>
      <div class="kpi"><div class="v num">180</div><div class="l">د.ل/شهر</div></div>
    </div>
    <div class="card">
      <div class="fw-700 mb-8">دوراتي</div>
      <div class="list-item mb-8"><span>🎓</span><div style="flex:1"><div class="fw-600">كن سباكاً معتمداً</div><div class="sub">430 طالب • 4.6 ⭐</div></div>${badge('منشور','badge-success')}</div>
      <div class="list-item mb-8"><span>🔧</span><div style="flex:1"><div class="fw-600">صيانة المكيفات</div><div class="sub">بانتظار المراجعة</div></div>${badge('مراجعة','badge-warning')}</div>
    </div>
  </div>`;
}

/* ---------- Reviews ---------- */
function renderReviews(){
  return `
  ${headerBar('التقييمات', true)}
  <div style="padding:16px">
    <div class="card mb-12">
      <div class="row gap-12">${avatar('سالم')}<div style="flex:1"><div class="fw-700">سالم البرعصي</div>${stars(5)}</div><span class="muted" style="font-size:11px">منذ يوم</span></div>
      <div class="sub mt-8">عمل ممتاز وسريع، أنصح به بشدة 👍</div>
    </div>
    <div class="card mb-12">
      <div class="row gap-12">${avatar('فاطمة')}<div style="flex:1"><div class="fw-700">فاطمة الزوي</div>${stars(4)}</div><span class="muted" style="font-size:11px">منذ 3 أيام</span></div>
      <div class="sub mt-8">خدمة جيدة، تأخر قليلاً لكن النتيجة ممتازة.</div>
    </div>
  </div>`;
}

/* ---------- Report ---------- */
function renderReport(){
  return `
  ${headerBar('تبليغ', true)}
  <div style="padding:16px">
    <div class="card anim-fade-up">
      <label class="fw-700" style="font-size:13px;display:block;margin-bottom:8px">سبب البلاغ</label>
      ${['عمل غير مكتمل','سلوك غير لائق','أسعار مبالغ فيها','أخرى'].map((r,i)=>`
        <div class="list-item mb-8" data-action="chip" role="radio" tabindex="0" style="cursor:pointer">
          <div style="width:22px;height:22px;border-radius:50%;border:2px solid var(--gray-300);flex-shrink:0"></div>
          <span class="fw-600">${r}</span>
        </div>`).join('')}
      <textarea class="input mt-8" style="height:80px;resize:vertical" placeholder="تفاصيل إضافية..." aria-label="تفاصيل"></textarea>
    </div>
    <button class="btn btn-danger btn-lg mt-16" data-action="toast" data-msg="تم إرسال البلاغ للأدمن ✓">إرسال البلاغ</button>
  </div>`;
}

/* ---------- Checkout ---------- */
function renderCheckout(){
  const methods = typeof PAYMENT_METHODS!=='undefined'?PAYMENT_METHODS:[
    {id:'cash',name:'الدفع عند الإنجاز',icon:'💵',desc:'الدفع نقداً عند اكتمال الخدمة',enabled:true},
    {id:'bank',name:'تحويل بنكي + إيصال',icon:'🏦',desc:'يرفع العميل صورة الإيصال',enabled:true},
    {id:'gateway',name:'بوابة دفع إلكترونية',icon:'💳',desc:'قابلة للتوصيل لاحقاً',enabled:false}
  ];
  return `
  ${headerBar('الدفع', true)}
  <div style="padding:16px">
    <div class="card anim-fade-up" style="text-align:center;padding:20px">
      <div class="sub">المبلغ المستحق</div>
      <div style="font-size:32px;font-weight:800;color:var(--navy)" class="num mt-4">${state.params.amount||60} د.ل</div>
    </div>
    <div class="mt-16">
      ${sectionTitle('طريقة الدفع')}
      ${methods.map((m,i)=>`
        <div class="list-item mb-8 ${m.enabled?'':'disabled'}" data-action="${m.enabled?'pay-select':'toast'}" data-msg="هذه الطريقة غير متاحة بعد"
             role="radio" tabindex="0" style="${m.enabled?'cursor:pointer':'opacity:.5'}">
          <span style="font-size:24px">${m.icon}</span>
          <div style="flex:1"><div class="fw-700">${m.name}</div><div class="sub">${m.desc}</div></div>
          ${i===0?badge('محدّد','badge-navy'):''}
        </div>`).join('')}
    </div>
    <button class="btn btn-primary btn-lg mt-16" data-action="invoice" data-amount="${state.params.amount||60}">${t('pay')}</button>
  </div>`;
}

/* ---------- Invoice ---------- */
function renderInvoice(){
  const amount = state.params.amount || 60;
  const commission = Math.round(amount * 0.12);
  return `
  ${headerBar('الفاتورة', true)}
  <div style="padding:16px;text-align:center">
    <div class="anim-bounce" style="padding:20px 0">
      <div style="font-size:56px">✅</div>
      <div class="h2 mt-8">تم الدفع بنجاح!</div>
    </div>
    <div class="qr-card mt-12" style="text-align:start">
      <div class="row between"><span class="sub">رقم الفاتورة</span><span class="fw-700 num">INV-2041</span></div>
      <div class="divider"></div>
      <div class="row between"><span class="sub">الخدمة</span><span class="fw-600">صيانة سباكة</span></div>
      <div class="row between mt-8"><span class="sub">المبلغ</span><span class="fw-700 num">${amount} د.ل</span></div>
      <div class="row between mt-8"><span class="sub">عمولة المنصة (12%)</span><span class="num">${commission} د.ل</span></div>
      <div class="divider"></div>
      <div class="row between"><span class="fw-700">الإجمالي</span><span class="fw-800 num" style="color:var(--navy)">${amount} د.ل</span></div>
    </div>
    <div class="row gap-8 mt-16">
      <button class="btn btn-primary" style="flex:1" data-action="svc-rate">⭐ ${t('rate')}</button>
      <button class="btn btn-ghost" style="flex:1" data-action="toast" data-msg="تم تحميل الفاتورة ✓">📥 تحميل</button>
    </div>
  </div>`;
}

/* ---------- Event Delegation ---------- */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  const p = el.dataset;

  switch(action) {
    case 'go-role': go('role'); break;
    case 'onb-next': onbSlide = Math.min(onbSlide+1, 2); render(); break;
    case 'go-auth': go('auth'); break;
    case 'go-otp': go('otp'); break;
    case 'go-home': go('home'); break;
    case 'go-back': goBack(); break;
    case 'go-jobs': go('jobs'); break;
    case 'go-services': go('services'); break;
    case 'go-courses': go('courses'); break;
    case 'go-profile': go('profile'); break;
    case 'go-notifs': go('notifs'); break;
    case 'go-chat': go('chat', {id:p.id}); break;
    case 'go-wallet': go('wallet'); break;
    case 'go-settings': go('settings'); break;
    case 'go-employer': go('employer-jobs'); break;
    case 'go-instructor': go('instructor-dashboard'); break;
    case 'go-applications': go('applications'); break;
    case 'go-saved': go('saved'); break;
    case 'nav-home': go('home'); break;
    case 'nav-jobs': go('jobs'); break;
    case 'nav-services': go('services'); break;
    case 'nav-courses': go('courses'); break;
    case 'nav-profile': go('profile'); break;
    case 'toggle-role': {
      const id = p.id;
      if (selectedRoles.has(id)) selectedRoles.delete(id); else selectedRoles.add(id);
      render(); break;
    }
    case 'toggle-theme': toggleTheme(); break;
    case 'toggle-provider': {
      state.providerMode = !state.providerMode;
      go(state.providerMode ? 'provider' : 'profile');
      toast(state.providerMode ? t('providerMode') + ' 🔧' : t('customerMode'));
      break;
    }
    case 'job-detail': go('job-detail', {id:p.id}); break;
    case 'job-apply': go('job-apply', {id:p.id}); break;
    case 'svc-request': go('svc-request', {id:p.id}); break;
    case 'svc-match': go('svc-match', {id:p.id}); break;
    case 'svc-track': go('svc-track', {id:p.id}); break;
    case 'svc-rate': go('svc-rate', {pid:p.id}); break;
    case 'course-detail': go('course-detail', {id:p.id}); break;
    case 'course-learn': go('course-learn', {id:p.id}); break;
    case 'course-quiz': go('course-quiz'); break;
    case 'certificate': go('certificate'); break;
    case 'checkout': go('checkout', {amount:p.amount}); break;
    case 'invoice': go('invoice', {amount:p.amount}); break;
    case 'employer-post': go('employer-post'); break;
    case 'employer-applicants': go('employer-applicants', {id:p.id}); break;
    case 'provider-active': go('provider-active'); break;
    case 'set-lang': {
      lang = p.lang;
      Store.set('lang', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang==='ar'?'rtl':'ltr';
      toast(lang==='ar'?'تم التبديل إلى العربية':'Switched to English');
      render(); break;
    }
    case 'do-search': {
      const input = el.querySelector('input') || el;
      performSearch(input.value);
      if (Store.get('searchResults')) {
        const resultsHtml = renderSearchResults();
        const container = app.querySelector('.screen');
        if (container) {
          const existing = container.querySelector('.search-results');
          if (existing) existing.remove();
          const div = document.createElement('div');
          div.className = 'search-results';
          div.innerHTML = resultsHtml;
          container.appendChild(div);
        }
      }
      break;
    }
    case 'chip': {
      const parent = el.parentElement;
      if (parent) {
        parent.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
        el.classList.add('active');
      }
      break;
    }
    case 'quiz-opt': {
      el.parentElement.querySelectorAll('.list-item').forEach(li=>{li.style.borderColor='';li.style.background='';});
      el.style.borderColor='var(--blue)';
      el.style.background='var(--blue-50)';
      break;
    }
    case 'rate-star': {
      const val = parseInt(p.val);
      el.parentElement.querySelectorAll('button').forEach((b,i)=>{
        b.style.transform = i < val ? 'scale(1.2)' : 'scale(1)';
        b.style.opacity = i < val ? '1' : '0.3';
      });
      break;
    }
    case 'pay-select': {
      el.parentElement.querySelectorAll('.list-item').forEach(li=>{li.style.borderColor='';});
      el.style.borderColor='var(--blue)';
      break;
    }
    case 'toast': toast(p.msg||'تم'); break;
    case 'logout': go('onboarding'); toast('تم تسجيل الخروج'); break;
  }
});

/* Search input handler */
document.addEventListener('input', (e) => {
  if (e.target.matches('[data-action="do-search"]')) {
    performSearch(e.target.value);
  }
});

/* Keyboard accessibility */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const el = e.target.closest('[data-action][role="button"], [data-action][role="radio"], [data-action][role="checkbox"]');
    if (el) { e.preventDefault(); el.click(); }
  }
});

/* ---------- Init ---------- */
document.documentElement.lang = 'ar';
document.documentElement.dir = 'rtl';
try {
  initTheme();
} catch(e) {
  console.error('initTheme error:', e);
  var errEl = document.getElementById('error-display');
  if (errEl) { errEl.style.display = 'block'; errEl.textContent += 'initTheme ERROR: ' + e.message + '\n'; }
}
try {
  render();
  console.log('[JobEzz] render() completed. #app innerHTML length:', app ? app.innerHTML.length : 'null');
} catch(e) {
  console.error('render() error:', e);
  var errEl = document.getElementById('error-display');
  if (errEl) { errEl.style.display = 'block'; errEl.textContent += 'render() ERROR: ' + e.message + '\nStack: ' + e.stack + '\n'; }
  // Fallback: show SOMETHING so user doesn't see blank page
  if (app) {
    app.innerHTML = '<div style="padding:40px;text-align:center;color:#fff;font-size:18px;font-family:Tajawal,sans-serif">'
      + '<h1 style="font-size:32px;margin-bottom:16px">JobEzz</h1>'
      + '<p style="color:rgba(255,255,255,0.7)">حدث خطأ في تحميل الواجهة</p>'
      + '<pre style="text-align:left;direction:ltr;background:rgba(0,0,0,0.3);padding:16px;border-radius:12px;margin-top:20px;font-size:12px;overflow-x:auto;color:#ff6b6b">'
      + e.message + '\n' + e.stack
      + '</pre></div>';
  }
}
