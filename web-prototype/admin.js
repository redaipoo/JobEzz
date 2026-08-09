/* ============================================================
   JobEzz — Admin Dashboard v2.0
   Enhanced: Chart.js, dark mode, better UX, animations
   ============================================================ */

const A = typeof ANALYTICS !== 'undefined' ? ANALYTICS : {
  kpis: { activeUsers: 12840, bookings: 3240, applications: 1870, revenue: 48200 },
  revenueByModule: [{m:"خدمات",v:26000,c:"#123B5E"},{m:"دورات",v:14200,c:"#4AA3E0"},{m:"وظائف",v:8000,c:"#2ECC71"}],
  growth: [12,18,15,22,28,26,34,31,40,45,42,52],
  topCategories: [{n:"سباكة",v:612},{n:"كهرباء",v:540},{n:"نقل أثاث",v:430},{n:"وايت مياه",v:388},{n:"مكيفات",v:301}]
};

const badge = (txt, cls) => `<span class="badge ${cls}">${txt}</span>`;
let charts = {};

/* ---------- Theme ---------- */
function initAdminTheme() {
  const saved = localStorage.getItem('jobezz-admin-theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  updateThemeBtn();
}
function toggleAdminTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('jobezz-admin-theme', isDark ? 'light' : 'dark');
  updateThemeBtn();
  renderCurrentSection();
}
function updateThemeBtn() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.textContent = isDark ? '☀️ الوضع الفاتح' : '🌙 الوضع الداكن';
}

/* ---------- Chart.js Config ---------- */
function getChartColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: isDark ? '#B0BEC5' : '#4A5560',
    grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(18,59,94,0.06)',
    bg: isDark ? '#1A2332' : '#FFFFFF',
    navy: '#123B5E',
    blue: '#4AA3E0',
    success: '#2ECC71',
    warning: '#F5A623'
  };
}

function destroyCharts() {
  Object.values(charts).forEach(c => { if (c && c.destroy) c.destroy(); });
  charts = {};
}

function createGrowthChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const colors = getChartColors();
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  charts.growth = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label: 'المستخدمون الجدد (×100)',
        data: A.growth,
        borderColor: colors.navy,
        backgroundColor: 'rgba(74,163,224,0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.blue,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: colors.navy,
          titleFont: { family: 'Tajawal', size: 13 },
          bodyFont: { family: 'Tajawal', size: 12 },
          padding: 12,
          cornerRadius: 8,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Tajawal', size: 11 }, color: colors.text, maxRotation: 0 }
        },
        y: {
          grid: { color: colors.grid },
          ticks: { font: { family: 'Inter', size: 11 }, color: colors.text },
          border: { display: false }
        }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  });
}

function createRevenueChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const colors = getChartColors();

  charts.revenue = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: A.revenueByModule.map(m => m.m),
      datasets: [{
        data: A.revenueByModule.map(m => m.v),
        backgroundColor: A.revenueByModule.map(m => m.c),
        borderWidth: 3,
        borderColor: colors.bg,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: 'Tajawal', size: 13, weight: '600' },
            color: colors.text,
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 12
          }
        },
        tooltip: {
          backgroundColor: colors.navy,
          titleFont: { family: 'Tajawal', size: 13 },
          bodyFont: { family: 'Tajawal', size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toLocaleString()} د.ل`
          }
        }
      }
    }
  });
}

function createCategoriesChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const colors = getChartColors();

  charts.categories = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: A.topCategories.map(c => c.n),
      datasets: [{
        label: 'عدد الطلبات',
        data: A.topCategories.map(c => c.v),
        backgroundColor: [colors.navy, colors.blue, colors.success, colors.warning, '#9B59B6'],
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 36
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: colors.navy,
          titleFont: { family: 'Tajawal', size: 13 },
          bodyFont: { family: 'Tajawal', size: 12 },
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: { label: (ctx) => ` ${ctx.parsed.x} طلب` }
        }
      },
      scales: {
        x: {
          grid: { color: colors.grid },
          ticks: { font: { family: 'Inter', size: 11 }, color: colors.text },
          border: { display: false }
        },
        y: {
          grid: { display: false },
          ticks: { font: { family: 'Tajawal', size: 12, weight: '600' }, color: colors.text }
        }
      }
    }
  });
}

/* ---------- Sections ---------- */
function renderOverview() {
  return `
  <div class="kpi-grid anim-fade-up">
    <div class="kpi-card">
      <div class="kpi-icon" style="background:var(--blue-100)">👥</div>
      <div class="v num">${A.kpis.activeUsers.toLocaleString()}</div>
      <div class="l">المستخدمون النشطون</div>
      <div class="trend up num">▲ 12%</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:var(--success-bg)">🔧</div>
      <div class="v num">${A.kpis.bookings.toLocaleString()}</div>
      <div class="l">حجوزات خدمات</div>
      <div class="trend up num">▲ 8%</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:var(--warning-bg)">💼</div>
      <div class="v num">${A.kpis.applications.toLocaleString()}</div>
      <div class="l">طلبات توظيف</div>
      <div class="trend up num">▲ 5%</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-icon" style="background:var(--blue-100)">💰</div>
      <div class="v num">${A.kpis.revenue.toLocaleString()} <small>د.ل</small></div>
      <div class="l">إجمالي الإيرادات</div>
      <div class="trend up num">▲ 15%</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="panel anim-fade-up" style="animation-delay:.1s">
      <h3>📈 نمو المستخدمين (آخر 12 شهراً)</h3>
      <div style="height:260px;position:relative">
        <canvas id="growthChart"></canvas>
      </div>
    </div>
    <div class="panel anim-fade-up" style="animation-delay:.2s">
      <h3>💰 الإيرادات حسب الوحدة</h3>
      <div style="height:260px;position:relative">
        <canvas id="revenueChart"></canvas>
      </div>
    </div>
  </div>

  <div class="panel anim-fade-up" style="animation-delay:.3s">
    <h3>🏆 الأكثر طلباً من فئات الخدمات</h3>
    <div style="height:220px;position:relative">
      <canvas id="categoriesChart"></canvas>
    </div>
  </div>`;
}

function renderUsers() {
  const users = typeof ADMIN_USERS !== 'undefined' ? ADMIN_USERS : [];
  return `<div class="panel anim-fade-up">
    <div class="panel-header">
      <h3>👥 إدارة المستخدمين</h3>
      <div class="search-box">
        <input type="text" placeholder="بحث عن مستخدم..." aria-label="بحث">
      </div>
    </div>
    <div style="overflow-x:auto">
      <table class="data">
        <thead><tr><th>المستخدم</th><th>الدور</th><th>الفئة</th><th>موثّق</th><th>الحالة</th><th>انضم في</th><th>إجراء</th></tr></thead>
        <tbody>${users.map(u => `
          <tr>
            <td><div class="row gap-8"><div class="avatar-sm">${u.name.charAt(0)}</div><b>${u.name}</b></div></td>
            <td>${u.role}</td>
            <td>${u.cat}</td>
            <td>${u.verified ? badge('✔ موثّق','badge-success') : badge('غير موثّق','badge-gray')}</td>
            <td>${u.status === 'نشط' ? badge('نشط','badge-success') : badge('موقوف','badge-danger')}</td>
            <td class="num">${u.joined}</td>
            <td>
              <div class="row gap-6">
                ${!u.verified ? '<button class="btn-sm-ad btn-verify" onclick="toast(\'تم التوثيق ✓\')">توثيق</button>' : ''}
                <button class="btn-sm-ad ${u.status==='نشط'?'btn-suspend':'btn-verify'}" onclick="toast('تم تحديث الحالة ✓')">${u.status==='نشط'?'إيقاف':'تفعيل'}</button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function renderContent() {
  const jobs = typeof ADMIN_JOBS !== 'undefined' ? ADMIN_JOBS : [];
  const courses = typeof ADMIN_COURSES !== 'undefined' ? ADMIN_COURSES : [];
  return `
  <div class="grid-2">
    <div class="panel anim-fade-up">
      <h3>💼 إدارة الوظائف</h3>
      ${jobs.map(j => `
        <div class="content-item">
          <div style="flex:1">
            <div class="fw-700">${j.title}</div>
            <div class="sub">${j.company}</div>
          </div>
          ${j.flag ? badge('⚑ مُبلّغ','badge-danger') : badge(j.status,'badge-success')}
          <div class="row gap-6">
            <button class="btn-sm-ad btn-approve" onclick="toast('تمت الموافقة ✓')">موافقة</button>
            <button class="btn-sm-ad btn-reject" onclick="toast('تم الرفض')">رفض</button>
          </div>
        </div>`).join('')}
    </div>
    <div class="panel anim-fade-up" style="animation-delay:.1s">
      <h3>🎓 إدارة الدورات</h3>
      ${courses.map(c => `
        <div class="content-item">
          <div style="flex:1">
            <div class="fw-700">${c.title}</div>
            <div class="sub">${c.instructor}</div>
          </div>
          ${badge(c.status, c.status==='منشور'?'badge-success':'badge-warning')}
          <div class="row gap-6">
            <button class="btn-sm-ad btn-approve" onclick="toast('تم النشر ✓')">نشر</button>
            <button class="btn-sm-ad btn-reject" onclick="toast('تم الرفض')">رفض</button>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderDisputes() {
  const disputes = typeof DISPUTES !== 'undefined' ? DISPUTES : [];
  return `<div class="panel anim-fade-up">
    <h3>⚠️ إدارة النزاعات</h3>
    ${disputes.map(d => `
      <div class="dispute-card">
        <div class="row between">
          <div>
            <div class="fw-700">${d.title}</div>
            <div class="sub">${d.by} ضد ${d.against} • ${d.date}</div>
          </div>
          <div class="row gap-6">
            ${badge(d.priority, d.priority==='عالية'?'badge-danger':'badge-warning')}
            ${badge(d.status, d.status==='مفتوح'?'badge-danger':'badge-warning')}
          </div>
        </div>
        <div class="row gap-8 mt-12">
          <button class="btn-sm-ad btn-resolve" onclick="toast('تم حل النزاع ✓')">حل النزاع</button>
          <button class="btn-sm-ad btn-reject" onclick="toast('تم التصعيد')">تصعيد</button>
        </div>
      </div>`).join('')}
  </div>`;
}

function renderSettings() {
  const settings = typeof PLATFORM_SETTINGS !== 'undefined' ? PLATFORM_SETTINGS : { commission: 12, featured: ['سباكة','كهرباء'], broadcast: '' };
  return `<div class="panel anim-fade-up" style="max-width:600px">
    <h3>⚙️ إعدادات المنصة</h3>
    <div class="settings-row">
      <div><div class="fw-700">نسبة العمولة</div><div class="sub">العمولة على كل عملية</div></div>
      <div class="row gap-6">
        <input class="set-input num" type="number" value="${settings.commission}" min="0" max="50" aria-label="نسبة العمولة">
        <span class="fw-700">%</span>
      </div>
    </div>
    <div class="settings-row">
      <div><div class="fw-700">الفئات المميّزة</div><div class="sub">تظهر أولاً في الصفحة الرئيسية</div></div>
      <div class="tag-pill-row">
        ${settings.featured.map(f => `<span class="tag" style="cursor:pointer" onclick="toast('تمت الإزالة')">${f} ✕</span>`).join('')}
        <span class="tag" style="cursor:pointer;background:var(--blue-100);color:var(--navy)" onclick="toast('إضافة فئة')">＋ إضافة</span>
      </div>
    </div>
    <div class="settings-row" style="flex-direction:column;align-items:stretch;gap:10px">
      <div class="fw-700">رسالة broadcast</div>
      <textarea class="broadcast-box" placeholder="اكتب رسالة تُرسل لجميع المستخدمين..." aria-label="رسالة broadcast">${settings.broadcast || ''}</textarea>
      <button class="btn-sm-ad btn-resolve" style="align-self:flex-start" onclick="toast('تم إرسال الرسالة ✓')">📤 إرسال</button>
    </div>
  </div>`;
}

/* ---------- Navigation ---------- */
let currentSection = 'overview';
const titles = { overview:'نظرة عامة', users:'المستخدمون', content:'إدارة المحتوى', disputes:'النزاعات', settings:'الإعدادات' };

function renderCurrentSection() {
  destroyCharts();
  const content = document.getElementById('content');
  const title = document.getElementById('pageTitle');
  if (!content) return;

  title.textContent = titles[currentSection] || 'نظرة عامة';

  switch(currentSection) {
    case 'overview': content.innerHTML = renderOverview(); initCharts(); break;
    case 'users': content.innerHTML = renderUsers(); break;
    case 'content': content.innerHTML = renderContent(); break;
    case 'disputes': content.innerHTML = renderDisputes(); break;
    case 'settings': content.innerHTML = renderSettings(); break;
  }
}

function initCharts() {
  requestAnimationFrame(() => {
    createGrowthChart('growthChart');
    createRevenueChart('revenueChart');
    createCategoriesChart('categoriesChart');
  });
}

/* ---------- Toast ---------- */
function toast(msg) {
  let el = document.getElementById('adminToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'adminToast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

/* ---------- Events ---------- */
document.getElementById('nav')?.addEventListener('click', (e) => {
  const link = e.target.closest('[data-sec]');
  if (!link) return;
  document.querySelectorAll('#nav a').forEach(a => a.classList.remove('active'));
  link.classList.add('active');
  currentSection = link.dataset.sec;
  renderCurrentSection();
});

document.getElementById('themeToggle')?.addEventListener('click', toggleAdminTheme);

/* Keyboard nav */
document.getElementById('nav')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.target.click();
  }
});

/* ---------- Init ---------- */
initAdminTheme();
renderCurrentSection();
