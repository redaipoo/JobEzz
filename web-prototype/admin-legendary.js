/* ============================================================
   JobEzz — LEGENDARY Admin Dashboard v3.0
   Real-time Analytics, Drag & Drop, A/B Testing, Heatmaps,
   Advanced Filtering, Export Reports, Dark Mode
   ============================================================ */

const A = typeof ANALYTICS !== 'undefined' ? ANALYTICS : {
  kpis: { activeUsers: 12840, bookings: 3240, applications: 1870, revenue: 48200 },
  revenueByModule: [{m:"خدمات",v:26000,c:"#123B5E"},{m:"دورات",v:14200,c:"#4AA3E0"},{m:"وظائف",v:8000,c:"#2ECC71"}],
  growth: [12,18,15,22,28,26,34,31,40,45,42,52],
  topCategories: [{n:"سباكة",v:612},{n:"كهرباء",v:540},{n:"نقل أثاث",v:430},{n:"وايت مياه",v:388},{n:"مكيفات",v:301}]
};

/* ---------- State Management ---------- */
const AdminStore = {
  state: {
    currentSection: 'overview',
    theme: localStorage.getItem('jobezz-admin-theme') || 'light',
    filters: { dateRange: '30d', module: 'all', status: 'all' },
    realtime: { online: 342, activeBookings: 28, pendingReviews: 15 },
    abTests: [
      { id: 'ab1', name: 'زر الحجز الأزرق vs الأخضر', status: 'running', variantA: 52, variantB: 48, winner: null },
      { id: 'ab2', name: 'صفحة هبوط جديدة', status: 'completed', variantA: 45, variantB: 55, winner: 'B' }
    ],
    dragDropItems: ['featured1', 'featured2', 'featured3']
  },
  listeners: [],
  get(key) { return this.state[key]; },
  set(key, value) { this.state[key] = value; this.notify(); },
  update(partial) { Object.assign(this.state, partial); this.notify(); },
  subscribe(fn) { this.listeners.push(fn); },
  notify() { this.listeners.forEach(fn => fn(this.state)); }
};

/* ---------- Theme Management ---------- */
function initAdminTheme() {
  const theme = AdminStore.get('theme');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeButton();
}

function toggleAdminTheme() {
  const current = AdminStore.get('theme');
  const next = current === 'dark' ? 'light' : 'dark';
  AdminStore.set('theme', next);
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('jobezz-admin-theme', next);
  updateThemeButton();
  renderCurrentSection();
  LegendaryAnimations.HapticFeedback.success();
  LegendaryAnimations.SoundDesign.toggle(next === 'dark');
}

function updateThemeButton() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isDark = AdminStore.get('theme') === 'dark';
  btn.innerHTML = isDark ? '☀️ الوضع الفاتح' : '🌙 الوضع الداكن';
}

/* ---------- Chart.js Configuration ---------- */
let charts = {};

function getChartColors() {
  const isDark = AdminStore.get('theme') === 'dark';
  return {
    text: isDark ? '#94A3B8' : '#4B5563',
    grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    bg: isDark ? '#1E293B' : '#FFFFFF',
    navy: '#123B5E',
    blue: '#4AA3E0',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    pink: '#EC4899',
    teal: '#14B8A6'
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
        backgroundColor: (context) => {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(74, 163, 224, 0.3)');
          gradient.addColorStop(1, 'rgba(74, 163, 224, 0)');
          return gradient;
        },
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: colors.blue,
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: colors.navy,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: colors.navy,
          titleFont: { family: 'Tajawal', size: 14, weight: '700' },
          bodyFont: { family: 'Tajawal', size: 13 },
          padding: 16,
          cornerRadius: 12,
          displayColors: false,
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.y * 100} مستخدم جديد`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Tajawal', size: 12 }, color: colors.text, maxRotation: 0 }
        },
        y: {
          grid: { color: colors.grid },
          ticks: { font: { family: 'Inter', size: 12 }, color: colors.text },
          border: { display: false }
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      }
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
        backgroundColor: [colors.navy, colors.blue, colors.success],
        borderWidth: 4,
        borderColor: colors.bg,
        hoverOffset: 12,
        hoverBorderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: 'Tajawal', size: 14, weight: '600' },
            color: colors.text,
            padding: 20,
            usePointStyle: true,
            pointStyleWidth: 16
          }
        },
        tooltip: {
          backgroundColor: colors.navy,
          titleFont: { family: 'Tajawal', size: 14, weight: '700' },
          bodyFont: { family: 'Tajawal', size: 13 },
          padding: 16,
          cornerRadius: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toLocaleString()} د.ل`
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1500,
        easing: 'easeOutQuart'
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
        backgroundColor: [colors.navy, colors.blue, colors.success, colors.warning, colors.purple],
        borderRadius: 12,
        borderSkipped: false,
        barThickness: 40
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
          titleFont: { family: 'Tajawal', size: 14, weight: '700' },
          bodyFont: { family: 'Tajawal', size: 13 },
          padding: 16,
          cornerRadius: 12,
          displayColors: false,
          callbacks: { label: (ctx) => ` ${ctx.parsed.x} طلب` }
        }
      },
      scales: {
        x: {
          grid: { color: colors.grid },
          ticks: { font: { family: 'Inter', size: 12 }, color: colors.text },
          border: { display: false }
        },
        y: {
          grid: { display: false },
          ticks: { font: { family: 'Tajawal', size: 13, weight: '600' }, color: colors.text }
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart',
        delay: (context) => context.dataIndex * 100
      }
    }
  });
}

function createRealtimeChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const colors = getChartColors();

  // Generate realtime data
  const now = Date.now();
  const data = Array.from({ length: 20 }, (_, i) => ({
    x: now - (19 - i) * 3000,
    y: Math.floor(Math.random() * 50) + 300
  }));

  charts.realtime = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'المستخدمون المتصلون',
        data: data,
        borderColor: colors.success,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: colors.navy,
          titleFont: { family: 'Tajawal', size: 13 },
          bodyFont: { family: 'Tajawal', size: 12 },
          padding: 12,
          cornerRadius: 10,
          displayColors: false,
          callbacks: {
            title: (ctx) => new Date(ctx[0].parsed.x).toLocaleTimeString('ar-LY'),
            label: (ctx) => ` ${ctx.parsed.y} مستخدم متصل`
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: { unit: 'minute', displayFormats: { minute: 'HH:mm' } },
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 11 }, color: colors.text, maxTicksLimit: 5 }
        },
        y: {
          grid: { color: colors.grid },
          ticks: { font: { family: 'Inter', size: 11 }, color: colors.text },
          border: { display: false },
          min: 250,
          max: 400
        }
      },
      animation: false
    }
  });

  // Update realtime data every 3 seconds
  setInterval(() => {
    if (!charts.realtime) return;
    const chart = charts.realtime;
    chart.data.datasets[0].data.push({
      x: Date.now(),
      y: Math.floor(Math.random() * 50) + 300
    });
    chart.data.datasets[0].data.shift();
    chart.update('none');
  }, 3000);
}

function createHeatmapChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const colors = getChartColors();

  // Generate heatmap data (hours x days)
  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const data = [];

  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      // Peak hours: 9-12, 17-21
      let value = Math.random() * 30;
      if ((h >= 9 && h <= 12) || (h >= 17 && h <= 21)) {
        value += Math.random() * 70;
      }
      data.push({ x: h, y: d, v: Math.floor(value) });
    }
  }

  charts.heatmap = new Chart(ctx, {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'النشاط',
        data: data.map(d => ({ x: d.x, y: d.y, r: Math.max(d.v / 10, 2) })),
        backgroundColor: (context) => {
          const value = context.raw.r * 10;
          const alpha = Math.min(value / 100, 1);
          return `rgba(74, 163, 224, ${alpha})`;
        },
        borderColor: 'transparent'
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
          cornerRadius: 10,
          displayColors: false,
          callbacks: {
            title: (ctx) => `${days[ctx[0].raw.y]} - ${hours[ctx[0].raw.x]}`,
            label: (ctx) => ` النشاط: ${Math.floor(ctx.raw.r * 10)}%`
          }
        }
      },
      scales: {
        x: {
          min: -0.5,
          max: 23.5,
          grid: { display: false },
          ticks: {
            font: { family: 'Inter', size: 10 },
            color: colors.text,
            stepSize: 3,
            callback: (val) => `${val}:00`
          }
        },
        y: {
          min: -0.5,
          max: 6.5,
          grid: { display: false },
          ticks: {
            font: { family: 'Tajawal', size: 11 },
            color: colors.text,
            callback: (val) => days[val] || ''
          }
        }
      }
    }
  });
}

/* ---------- Sections ---------- */
function renderOverview() {
  const realtime = AdminStore.get('realtime');

  return `
  <div class="kpi-grid anim-fade-up">
    <div class="kpi-card tilt" data-tilt>
      <div class="kpi-icon" style="background: linear-gradient(135deg, #E4F1FB, #B8DCF5)">👥</div>
      <div class="v num" data-counter="${A.kpis.activeUsers}">0</div>
      <div class="l">المستخدمون النشطون</div>
      <div class="trend up num">▲ 12%</div>
    </div>
    <div class="kpi-card tilt" data-tilt>
      <div class="kpi-icon" style="background: linear-gradient(135deg, #D1FAE5, #6EE7B7)">🔧</div>
      <div class="v num" data-counter="${A.kpis.bookings}">0</div>
      <div class="l">حجوزات خدمات</div>
      <div class="trend up num">▲ 8%</div>
    </div>
    <div class="kpi-card tilt" data-tilt>
      <div class="kpi-icon" style="background: linear-gradient(135deg, #FEF3C7, #FCD34D)">💼</div>
      <div class="v num" data-counter="${A.kpis.applications}">0</div>
      <div class="l">طلبات توظيف</div>
      <div class="trend up num">▲ 5%</div>
    </div>
    <div class="kpi-card tilt" data-tilt>
      <div class="kpi-icon" style="background: linear-gradient(135deg, #F3E8FF, #C4B5FD)">💰</div>
      <div class="v num" data-counter="${A.kpis.revenue}" data-suffix=" د.ل">0</div>
      <div class="l">إجمالي الإيرادات</div>
      <div class="trend up num">▲ 15%</div>
    </div>
  </div>

  <div class="realtime-bar anim-fade-up" style="animation-delay: 0.1s">
    <div class="realtime-item">
      <span class="pulse-dot"></span>
      <span class="num">${realtime.online}</span> متصل الآن
    </div>
    <div class="realtime-item">
      <span class="pulse-dot" style="background: var(--warning-500)"></span>
      <span class="num">${realtime.activeBookings}</span> حجز نشط
    </div>
    <div class="realtime-item">
      <span class="pulse-dot" style="background: var(--danger-500)"></span>
      <span class="num">${realtime.pendingReviews}</span> بانتظار المراجعة
    </div>
  </div>

  <div class="grid-2">
    <div class="panel anim-fade-up" style="animation-delay: 0.15s">
      <div class="panel-header">
        <h3>📈 نمو المستخدمين</h3>
        <div class="filter-chips">
          <button class="chip-sm active" data-range="7d">7 أيام</button>
          <button class="chip-sm" data-range="30d">30 يوم</button>
          <button class="chip-sm" data-range="90d">90 يوم</button>
        </div>
      </div>
      <div style="height: 280px; position: relative">
        <canvas id="growthChart"></canvas>
      </div>
    </div>
    <div class="panel anim-fade-up" style="animation-delay: 0.2s">
      <div class="panel-header">
        <h3>💰 الإيرادات حسب الوحدة</h3>
      </div>
      <div style="height: 280px; position: relative">
        <canvas id="revenueChart"></canvas>
      </div>
    </div>
  </div>

  <div class="grid-2">
    <div class="panel anim-fade-up" style="animation-delay: 0.25s">
      <div class="panel-header">
        <h3>🔴 النشاط المباشر</h3>
        <span class="live-badge">LIVE</span>
      </div>
      <div style="height: 200px; position: relative">
        <canvas id="realtimeChart"></canvas>
      </div>
    </div>
    <div class="panel anim-fade-up" style="animation-delay: 0.3s">
      <div class="panel-header">
        <h3>🏆 الأكثر طلباً</h3>
      </div>
      <div style="height: 200px; position: relative">
        <canvas id="categoriesChart"></canvas>
      </div>
    </div>
  </div>

  <div class="panel anim-fade-up" style="animation-delay: 0.35s">
    <div class="panel-header">
      <h3>🔥 خريطة النشاط الحرارية</h3>
      <span class="sub">أوقات الذروة خلال الأسبوع</span>
    </div>
    <div style="height: 250px; position: relative">
      <canvas id="heatmapChart"></canvas>
    </div>
  </div>
  `;
}

function renderABTesting() {
  const tests = AdminStore.get('abTests');

  return `
  <div class="panel anim-fade-up">
    <div class="panel-header">
      <h3>🧪 اختبارات A/B</h3>
      <button class="btn-sm-ad btn-resolve" onclick="createABTest()">＋ اختبار جديد</button>
    </div>
    <div class="ab-tests-grid">
      ${tests.map(test => `
        <div class="ab-test-card tilt" data-tilt>
          <div class="ab-test-header">
            <span class="ab-test-name">${test.name}</span>
            <span class="badge ${test.status === 'running' ? 'badge-warning' : 'badge-success'}">
              ${test.status === 'running' ? '🔄 قيد التشغيل' : '✅ مكتمل'}
            </span>
          </div>
          <div class="ab-variants">
            <div class="ab-variant ${test.winner === 'A' ? 'winner' : ''}">
              <div class="ab-variant-label">المتغير A</div>
              <div class="ab-variant-value num">${test.variantA}%</div>
              <div class="ab-progress">
                <div class="ab-progress-fill" style="width: ${test.variantA}%; background: var(--blue-500)"></div>
              </div>
            </div>
            <div class="ab-vs">VS</div>
            <div class="ab-variant ${test.winner === 'B' ? 'winner' : ''}">
              <div class="ab-variant-label">المتغير B</div>
              <div class="ab-variant-value num">${test.variantB}%</div>
              <div class="ab-progress">
                <div class="ab-progress-fill" style="width: ${test.variantB}%; background: var(--success-500)"></div>
              </div>
            </div>
          </div>
          ${test.winner ? `<div class="ab-winner">🏆 الفائز: المتغير ${test.winner}</div>` : ''}
          <div class="ab-actions">
            ${test.status === 'running' ? `
              <button class="btn-sm-ad btn-approve" onclick="stopABTest('${test.id}')">إيقاف</button>
            ` : `
              <button class="btn-sm-ad btn-resolve" onclick="applyWinner('${test.id}')">تطبيق الفائز</button>
            `}
            <button class="btn-sm-ad btn-reject" onclick="deleteABTest('${test.id}')">حذف</button>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  `;
}

function renderContentManager() {
  const items = AdminStore.get('dragDropItems');

  return `
  <div class="panel anim-fade-up">
    <div class="panel-header">
      <h3>🗂️ إدارة المحتوى</h3>
      <span class="sub">اسحب وأفلت لإعادة الترتيب</span>
    </div>
    <div class="drag-drop-container" id="dragDropContainer">
      ${items.map((item, index) => `
        <div class="drag-drop-item" draggable="true" data-id="${item}">
          <div class="drag-handle">⋮⋮</div>
          <div class="drag-content">
            <div class="drag-title">عنصر مميّز ${index + 1}</div>
            <div class="drag-sub">وصف العنصر المميّز</div>
          </div>
          <div class="drag-actions">
            <button class="btn-icon-sm" onclick="editItem('${item}')">✏️</button>
            <button class="btn-icon-sm" onclick="deleteItem('${item}')">🗑️</button>
          </div>
        </div>
      `).join('')}
    </div>
    <button class="btn-sm-ad btn-resolve mt-4" onclick="addItem()">＋ إضافة عنصر</button>
  </div>
  `;
}

function renderUsers() {
  const users = typeof ADMIN_USERS !== 'undefined' ? ADMIN_USERS : [];
  return `
  <div class="panel anim-fade-up">
    <div class="panel-header">
      <h3>👥 إدارة المستخدمين</h3>
      <div class="search-box">
        <input type="text" placeholder="بحث عن مستخدم..." aria-label="بحث" oninput="filterUsers(this.value)">
      </div>
    </div>
    <div class="table-container">
      <table class="data">
        <thead>
          <tr>
            <th><input type="checkbox" onchange="toggleAllUsers(this)"></th>
            <th>المستخدم</th>
            <th>الدور</th>
            <th>الفئة</th>
            <th>موثّق</th>
            <th>الحالة</th>
            <th>انضم في</th>
            <th>إجراء</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(u => `
            <tr class="user-row" data-name="${u.name}">
              <td><input type="checkbox" class="user-checkbox"></td>
              <td>
                <div class="row gap-8">
                  <div class="avatar-sm">${u.name.charAt(0)}</div>
                  <div>
                    <b>${u.name}</b>
                    <div class="sub" style="font-size: 11px">${u.email || 'no-email@example.com'}</div>
                  </div>
                </div>
              </td>
              <td>${u.role}</td>
              <td>${u.cat}</td>
              <td>${u.verified ? badge('✔ موثّق', 'badge-success') : badge('غير موثّق', 'badge-gray')}</td>
              <td>${u.status === 'نشط' ? badge('نشط', 'badge-success') : badge('موقوف', 'badge-danger')}</td>
              <td class="num">${u.joined}</td>
              <td>
                <div class="row gap-6">
                  ${!u.verified ? '<button class="btn-sm-ad btn-verify" onclick="verifyUser(this)">توثيق</button>' : ''}
                  <button class="btn-sm-ad ${u.status === 'نشط' ? 'btn-suspend' : 'btn-verify'}" onclick="toggleUserStatus(this)">
                    ${u.status === 'نشط' ? 'إيقاف' : 'تفعيل'}
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="table-footer">
      <span class="sub">عرض ${users.length} من ${users.length} مستخدم</span>
      <div class="pagination">
        <button class="btn-page" disabled>‹</button>
        <button class="btn-page active">1</button>
        <button class="btn-page">2</button>
        <button class="btn-page">3</button>
        <button class="btn-page">›</button>
      </div>
    </div>
  </div>
  `;
}

function renderSettings() {
  const settings = typeof PLATFORM_SETTINGS !== 'undefined' ? PLATFORM_SETTINGS : { commission: 12, featured: ['سباكة', 'كهرباء'], broadcast: '' };

  return `
  <div class="grid-2">
    <div class="panel anim-fade-up">
      <h3>⚙️ إعدادات المنصة</h3>
      <div class="settings-row">
        <div>
          <div class="fw-700">نسبة العمولة</div>
          <div class="sub">العمولة على كل عملية</div>
        </div>
        <div class="row gap-6">
          <input class="set-input num" type="number" value="${settings.commission}" min="0" max="50" aria-label="نسبة العمولة">
          <span class="fw-700">%</span>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="fw-700">الحد الأدنى للسحب</div>
          <div class="sub">أقل مبلغ يمكن سحبه</div>
        </div>
        <div class="row gap-6">
          <input class="set-input num" type="number" value="50" min="10" aria-label="الحد الأدنى">
          <span class="fw-700">د.ل</span>
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="fw-700">مدة انتهاء الجلسة</div>
          <div class="sub">بالدقائق</div>
        </div>
        <div class="row gap-6">
          <input class="set-input num" type="number" value="30" min="5" aria-label="مدة الجلسة">
          <span class="fw-700">دقيقة</span>
        </div>
      </div>
      <button class="btn-sm-ad btn-resolve mt-4" onclick="saveSettings()">💾 حفظ الإعدادات</button>
    </div>

    <div class="panel anim-fade-up" style="animation-delay: 0.1s">
      <h3>📢 رسالة Broadcast</h3>
      <textarea class="broadcast-box" placeholder="اكتب رسالة تُرسل لجميع المستخدمين..." aria-label="رسالة broadcast">${settings.broadcast || ''}</textarea>
      <div class="row gap-8 mt-4">
        <button class="btn-sm-ad btn-resolve" onclick="sendBroadcast()">📤 إرسال الآن</button>
        <button class="btn-sm-ad btn-approve" onclick="scheduleBroadcast()">📅 جدولة</button>
      </div>
    </div>
  </div>

  <div class="panel anim-fade-up" style="animation-delay: 0.2s">
    <h3>🎨 الفئات المميّزة</h3>
    <div class="tag-pill-row mt-4">
      ${settings.featured.map(f => `
        <span class="tag-removable" onclick="removeFeatured('${f}')">${f} ✕</span>
      `).join('')}
      <span class="tag-add" onclick="addFeatured()">＋ إضافة فئة</span>
    </div>
  </div>
  `;
}

/* ---------- Navigation ---------- */
const titles = {
  overview: 'نظرة عامة',
  users: 'المستخدمون',
  content: 'إدارة المحتوى',
  abtesting: 'اختبارات A/B',
  disputes: 'النزاعات',
  settings: 'الإعدادات'
};

function renderCurrentSection() {
  destroyCharts();
  const content = document.getElementById('content');
  const title = document.getElementById('pageTitle');
  if (!content) return;

  const section = AdminStore.get('currentSection');
  title.textContent = titles[section] || 'نظرة عامة';

  switch (section) {
    case 'overview':
      content.innerHTML = renderOverview();
      initCharts();
      initCounters();
      initTiltEffects();
      break;
    case 'users':
      content.innerHTML = renderUsers();
      break;
    case 'content':
      content.innerHTML = renderContentManager();
      initDragDrop();
      break;
    case 'abtesting':
      content.innerHTML = renderABTesting();
      initTiltEffects();
      break;
    case 'settings':
      content.innerHTML = renderSettings();
      break;
    default:
      content.innerHTML = renderOverview();
      initCharts();
  }
}

function initCharts() {
  requestAnimationFrame(() => {
    createGrowthChart('growthChart');
    createRevenueChart('revenueChart');
    createCategoriesChart('categoriesChart');
    createRealtimeChart('realtimeChart');
    createHeatmapChart('heatmapChart');
  });
}

function initCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    LegendaryAnimations.CounterAnimation.animate(el, target, 2000, { suffix });
  });
}

function initTiltEffects() {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    new LegendaryAnimations.TiltEffect(el, { maxTilt: 5, scale: 1.02, glare: true });
  });
}

function initDragDrop() {
  const container = document.getElementById('dragDropContainer');
  if (!container) return;

  let draggedItem = null;

  container.querySelectorAll('.drag-drop-item').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedItem = item;
      setTimeout(() => item.classList.add('dragging'), 0);
      LegendaryAnimations.HapticFeedback.light();
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      draggedItem = null;
      LegendaryAnimations.HapticFeedback.success();
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      if (afterElement == null) {
        container.appendChild(draggedItem);
      } else {
        container.insertBefore(draggedItem, afterElement);
      }
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.drag-drop-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/* ---------- Actions ---------- */
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
  LegendaryAnimations.SoundDesign.success();
  setTimeout(() => el.classList.remove('show'), 2500);
}

function verifyUser(btn) {
  btn.textContent = '✔ موثّق';
  btn.className = 'btn-sm-ad btn-verify';
  btn.disabled = true;
  toast('تم توثيق المستخدم ✓');
}

function toggleUserStatus(btn) {
  const isSuspend = btn.textContent.includes('إيقاف');
  btn.textContent = isSuspend ? 'تفعيل' : 'إيقاف';
  btn.className = `btn-sm-ad ${isSuspend ? 'btn-verify' : 'btn-suspend'}`;
  toast(isSuspend ? 'تم إيقاف المستخدم' : 'تم تفعيل المستخدم ✓');
}

function filterUsers(query) {
  const rows = document.querySelectorAll('.user-row');
  rows.forEach(row => {
    const name = row.dataset.name.toLowerCase();
    row.style.display = name.includes(query.toLowerCase()) ? '' : 'none';
  });
}

function toggleAllUsers(checkbox) {
  document.querySelectorAll('.user-checkbox').forEach(cb => {
    cb.checked = checkbox.checked;
  });
}

function createABTest() {
  toast('تم إنشاء اختبار A/B جديد 🧪');
}

function stopABTest(id) {
  toast('تم إيقاف الاختبار');
}

function applyWinner(id) {
  toast('تم تطبيق الفائز ✓');
  LegendaryAnimations.Confetti.burst({ count: 50 });
}

function deleteABTest(id) {
  toast('تم حذف الاختبار');
}

function addItem() {
  toast('تمت إضافة عنصر جديد ✓');
}

function editItem(id) {
  toast('تعديل العنصر...');
}

function deleteItem(id) {
  toast('تم حذف العنصر');
}

function saveSettings() {
  toast('تم حفظ الإعدادات ✓');
}

function sendBroadcast() {
  toast('تم إرسال الرسالة لجميع المستخدمين 📤');
}

function scheduleBroadcast() {
  toast('تمت جدولة الرسالة 📅');
}

function removeFeatured(name) {
  toast(`تمت إزالة ${name}`);
}

function addFeatured() {
  toast('إضافة فئة جديدة...');
}

/* ---------- Events ---------- */
document.getElementById('nav')?.addEventListener('click', (e) => {
  const link = e.target.closest('[data-sec]');
  if (!link) return;

  document.querySelectorAll('#nav a').forEach(a => a.classList.remove('active'));
  link.classList.add('active');
  AdminStore.set('currentSection', link.dataset.sec);
  renderCurrentSection();

  LegendaryAnimations.HapticFeedback.selection();
  LegendaryAnimations.SoundDesign.click();
});

document.getElementById('themeToggle')?.addEventListener('click', toggleAdminTheme);

/* Keyboard nav */
document.getElementById('nav')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.target.click();
  }
});

/* Filter chips */
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('chip-sm')) {
    const parent = e.target.parentElement;
    parent.querySelectorAll('.chip-sm').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    LegendaryAnimations.HapticFeedback.selection();
  }
});

/* ---------- Init ---------- */
initAdminTheme();
renderCurrentSection();

console.log('🚀 JobEzz Legendary Admin Dashboard v3.0 loaded');
