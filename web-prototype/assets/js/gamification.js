/* ============================================================
   JobEzz — Gamification Engine v3.0
   Points, Badges, Levels, Streaks, Leaderboard, Rewards
   ============================================================ */

const Gamification = (() => {
  /* ---------- Levels ---------- */
  const LEVELS = [
    { level: 1,  name: 'مبتدئ',        icon: '🌱', xp: 0 },
    { level: 2,  name: 'متعلّم',       icon: '📖', xp: 100 },
    { level: 3,  name: 'نشيط',         icon: '⚡', xp: 300 },
    { level: 4,  name: 'متمرّس',       icon: '🔨', xp: 600 },
    { level: 5,  name: 'خبير',         icon: '🛠️', xp: 1000 },
    { level: 6,  name: 'محترف',        icon: '💼', xp: 1500 },
    { level: 7,  name: 'حرفي ماهر',    icon: '🥇', xp: 2100 },
    { level: 8,  name: 'نخبة',         icon: '💎', xp: 2800 },
    { level: 9,  name: 'أسطورة',       icon: '👑', xp: 3600 },
    { level: 10, name: 'الأسطورة العليا', icon: '🏆', xp: 4500 }
  ];

  /* ---------- Badges ---------- */
  const BADGES = [
    { id: 'first_order',   name: 'البداية السريعة', icon: '🚀', desc: 'أكمل أول طلب خدمة',      xp: 50,  condition: s => s.orders >= 1 },
    { id: 'five_orders',   name: 'عميل وفي',        icon: '🤝', desc: 'أكمل 5 طلبات',           xp: 100, condition: s => s.orders >= 5 },
    { id: 'twenty_orders', name: 'محترف الطلبات',   icon: '📦', desc: 'أكمل 20 طلباً',          xp: 250, condition: s => s.orders >= 20 },
    { id: 'five_star',     name: 'خمس نجوم',        icon: '⭐', desc: 'احصل على تقييم 5.0',     xp: 80,  condition: s => s.rating >= 5 },
    { id: 'streak_3',      name: 'على الطريق',      icon: '🔥', desc: 'سلسلة 3 أيام متتالية',   xp: 60,  condition: s => s.streak >= 3 },
    { id: 'streak_7',      name: 'أسبوع ذهبي',      icon: '🌟', desc: 'سلسلة 7 أيام متتالية',   xp: 150, condition: s => s.streak >= 7 },
    { id: 'streak_30',     name: 'شهر الإنجاز',     icon: '🏅', desc: 'سلسلة 30 يوماً',         xp: 500, condition: s => s.streak >= 30 },
    { id: 'first_course',  name: 'متعلّم',          icon: '🎓', desc: 'أكمل أول دورة',          xp: 100, condition: s => s.courses >= 1 },
    { id: 'three_courses', name: 'طالب مجتهد',      icon: '📚', desc: 'أكمل 3 دورات',           xp: 200, condition: s => s.courses >= 3 },
    { id: 'certificate',   name: 'معتمد',           icon: '📜', desc: 'احصل على شهادة',         xp: 120, condition: s => s.certificates >= 1 },
    { id: 'first_job',     name: 'أول وظيفة',       icon: '💼', desc: 'تقدّم لأول وظيفة',        xp: 50,  condition: s => s.applications >= 1 },
    { id: 'hired',         name: 'موظّف',           icon: '🎉', desc: 'تم قبولك في وظيفة',      xp: 300, condition: s => s.hired >= 1 },
    { id: 'provider_10',   name: 'مزوّد نشيط',      icon: '🔧', desc: 'أكمل 10 مهام كمزوّد',    xp: 200, condition: s => s.providerTasks >= 10 },
    { id: 'provider_100',  name: 'محترف الخدمات',   icon: '💎', desc: 'أكمل 100 مهمة كمزوّد',   xp: 800, condition: s => s.providerTasks >= 100 },
    { id: 'referrer_5',    name: 'سفير المنصة',     icon: '📣', desc: 'أحل 5 مستخدمين جدد',     xp: 250, condition: s => s.referrals >= 5 },
    { id: 'top_10',        name: 'الصدارة',         icon: '🏆', desc: 'ادخل أفضل 10 هذا الأسبوع', xp: 400, condition: s => s.weeklyRank <= 10 }
  ];

  /* ---------- Point Actions ---------- */
  const POINT_ACTIONS = {
    complete_order:    { xp: 50,  label: 'إكمال طلب خدمة' },
    rate_provider:     { xp: 10,  label: 'تقييم مزوّد' },
    complete_lesson:   { xp: 20,  label: 'إكمال درس' },
    pass_quiz:         { xp: 40,  label: 'اجتياز اختبار' },
    get_certificate:   { xp: 100, label: 'الحصول على شهادة' },
    apply_job:         { xp: 15,  label: 'التقدّم لوظيفة' },
    get_hired:         { xp: 200, label: 'القبول في وظيفة' },
    complete_task:     { xp: 60,  label: 'إكمال مهمة كمزوّد' },
    daily_login:       { xp: 5,   label: 'تسجيل دخول يومي' },
    refer_friend:      { xp: 100, label: 'إحالة صديق' },
    write_review:      { xp: 15,  label: 'كتابة مراجعة' },
    complete_profile:  { xp: 30,  label: 'إكمال الملف الشخصي' }
  };

  /* ---------- State ---------- */
  let state = loadState();

  function defaultState() {
    return {
      xp: 0,
      streak: 0,
      lastActive: null,
      earnedBadges: [],
      stats: {
        orders: 0, rating: 0, courses: 0, certificates: 0,
        applications: 0, hired: 0, providerTasks: 0, referrals: 0, weeklyRank: 999
      },
      history: []
    };
  }

  function loadState() {
    try {
      const saved = localStorage.getItem('jobezz-gamification');
      return saved ? JSON.parse(saved) : defaultState();
    } catch { return defaultState(); }
  }

  function saveState() {
    try { localStorage.setItem('jobezz-gamification', JSON.stringify(state)); } catch {}
  }

  /* ---------- Core API ---------- */
  function addPoints(action, extra = {}) {
    const def = POINT_ACTIONS[action];
    if (!def) return null;

    state.xp += def.xp;
    state.history.unshift({ action, xp: def.xp, label: def.label, at: Date.now() });
    if (state.history.length > 50) state.history.pop();

    // Update stats
    if (action === 'complete_order') state.stats.orders++;
    if (action === 'complete_lesson' || action === 'pass_quiz') {}
    if (action === 'get_certificate') { state.stats.certificates++; state.stats.courses++; }
    if (action === 'apply_job') state.stats.applications++;
    if (action === 'get_hired') state.stats.hired++;
    if (action === 'complete_task') state.stats.providerTasks++;
    if (action === 'refer_friend') state.stats.referrals++;
    if (extra.rating) state.stats.rating = Math.max(state.stats.rating, extra.rating);

    // Streak
    updateStreak();

    // Check badges
    const newlyEarned = checkBadges();

    saveState();

    return {
      xp: def.xp,
      total: state.xp,
      level: getLevel(),
      newBadges: newlyEarned
    };
  }

  function updateStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (state.lastActive === today) return;
    if (state.lastActive === yesterday) {
      state.streak++;
    } else if (state.lastActive !== today) {
      state.streak = 1;
    }
    state.lastActive = today;
  }

  function checkBadges() {
    const newly = [];
    BADGES.forEach(b => {
      if (!state.earnedBadges.includes(b.id) && b.condition(state.stats)) {
        state.earnedBadges.push(b.id);
        state.xp += b.xp;
        newly.push(b);
      }
    });
    return newly;
  }

  function getLevel() {
    let current = LEVELS[0];
    for (const l of LEVELS) {
      if (state.xp >= l.xp) current = l;
    }
    const next = LEVELS.find(l => l.xp > state.xp) || null;
    const progress = next
      ? Math.round(((state.xp - current.xp) / (next.xp - current.xp)) * 100)
      : 100;
    return { ...current, next, progress, xp: state.xp };
  }

  function getState() {
    return {
      ...state,
      level: getLevel(),
      allBadges: BADGES.map(b => ({ ...b, earned: state.earnedBadges.includes(b.id) }))
    };
  }

  function getLeaderboard() {
    // Mock leaderboard (replace with API)
    return [
      { rank: 1, name: 'أحمد العريبي', xp: 2840, avatar: 'أ' },
      { rank: 2, name: 'سالم البرعصي', xp: 2510, avatar: 'س' },
      { rank: 3, name: 'منى العبيدي', xp: 1890, avatar: 'م' },
      { rank: 4, name: 'خالد التريكي', xp: 1650, avatar: 'خ' },
      { rank: 5, name: 'فاطمة الزوي', xp: 1420, avatar: 'ف' },
      { rank: 6, name: 'عمر الساعدي', xp: 1310, avatar: 'ع' },
      { rank: 7, name: 'يوسف المنفي', xp: state.xp, avatar: 'ي', isMe: true },
      { rank: 8, name: 'ليلى بن عامر', xp: 980, avatar: 'ل' },
      { rank: 9, name: 'محمد الشريف', xp: 870, avatar: 'م' },
      { rank: 10, name: 'سارة عبدالسلام', xp: 760, avatar: 'س' }
    ].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));
  }

  /* ---------- UI Components ---------- */
  function renderLevelCard() {
    const lvl = getLevel();
    return `
      <div class="game-level-card">
        <div class="game-level-top">
          <span class="game-level-icon">${lvl.icon}</span>
          <div>
            <div class="game-level-name">المستوى ${lvl.level} — ${lvl.name}</div>
            <div class="game-level-xp num">${state.xp} نقطة</div>
          </div>
        </div>
        <div class="game-xp-bar"><div class="game-xp-fill" style="width:${lvl.progress}%"></div></div>
        <div class="game-xp-label">${lvl.next ? `${lvl.next.xp - state.xp} نقطة للمستوى ${lvl.next.level}` : 'أعلى مستوى! 🏆'}</div>
        <div class="game-streak">🔥 سلسلة ${state.streak} ${state.streak === 1 ? 'يوم' : 'أيام'}</div>
      </div>`;
  }

  function renderBadgesGrid() {
    return `<div class="game-badges-grid">${
      BADGES.map(b => {
        const earned = state.earnedBadges.includes(b.id);
        return `<div class="game-badge ${earned ? '' : 'locked'}" title="${b.desc}">
          <span class="game-badge-icon">${b.icon}</span>
          <span class="game-badge-name">${b.name}</span>
          <span class="game-badge-xp">+${b.xp}</span>
        </div>`;
      }).join('')
    }</div>`;
  }

  function renderLeaderboard() {
    const lb = getLeaderboard();
    return `<div class="game-leaderboard">${
      lb.map(u => `
        <div class="game-lb-row ${u.isMe ? 'me' : ''} ${u.rank <= 3 ? 'top' : ''}">
          <span class="game-lb-rank">${u.rank <= 3 ? ['🥇','🥈','🥉'][u.rank-1] : u.rank}</span>
          <span class="game-lb-avatar">${u.avatar}</span>
          <span class="game-lb-name">${u.name}${u.isMe ? ' (أنت)' : ''}</span>
          <span class="game-lb-xp num">${u.xp.toLocaleString()}</span>
        </div>`).join('')
    }</div>`;
  }

  function showRewardToast(result) {
    if (!result) return;
    let msg = `+${result.xp} نقطة ⚡`;
    if (result.newBadges.length) {
      msg += ` • شارة جديدة: ${result.newBadges.map(b => b.icon + ' ' + b.name).join('، ')}`;
    }
    if (typeof toast === 'function') toast(msg);
    if (window.LegendaryAnimations) {
      LegendaryAnimations.HapticFeedback.success();
      LegendaryAnimations.SoundDesign.success();
      if (result.newBadges.length) LegendaryAnimations.Confetti.burst({ count: 60 });
    }
  }

  function reset() {
    state = defaultState();
    saveState();
  }

  return {
    addPoints,
    getState,
    getLevel,
    getLeaderboard,
    renderLevelCard,
    renderBadgesGrid,
    renderLeaderboard,
    showRewardToast,
    reset,
    LEVELS,
    BADGES,
    POINT_ACTIONS
  };
})();

/* ---------- Inject Gamification Styles ---------- */
(function injectGameStyles() {
  const css = `
  .game-level-card{background:linear-gradient(135deg,#0E2F4A,#1A4A73);color:#fff;border-radius:22px;padding:22px;position:relative;overflow:hidden}
  .game-level-card::before{content:"";position:absolute;top:-30px;left:-30px;width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(74,163,224,.4),transparent 70%)}
  .game-level-top{display:flex;align-items:center;gap:14px;margin-bottom:16px}
  .game-level-icon{font-size:40px;filter:drop-shadow(0 4px 8px rgba(0,0,0,.3))}
  .game-level-name{font-weight:800;font-size:17px}
  .game-level-xp{font-size:13px;opacity:.85}
  .game-xp-bar{height:10px;border-radius:99px;background:rgba(255,255,255,.15);overflow:hidden;margin-bottom:8px}
  .game-xp-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,#4AA3E0,#14B8A6);transition:width 1s cubic-bezier(.16,1,.3,1)}
  .game-xp-label{font-size:12px;opacity:.8}
  .game-streak{margin-top:12px;font-size:14px;font-weight:700}
  .game-badges-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .game-badge{background:#fff;border:1px solid #E7EBEF;border-radius:16px;padding:14px 8px;text-align:center;transition:.25s cubic-bezier(.34,1.56,.64,1);cursor:pointer}
  .game-badge:hover{transform:translateY(-4px);box-shadow:0 12px 24px rgba(18,59,94,.12)}
  .game-badge.locked{opacity:.35;filter:grayscale(1)}
  .game-badge-icon{font-size:30px;display:block;margin-bottom:6px}
  .game-badge-name{font-size:11px;font-weight:700;display:block}
  .game-badge-xp{font-size:10px;color:#8A97A3}
  .game-leaderboard{background:#fff;border-radius:18px;padding:16px;border:1px solid #E7EBEF}
  .game-lb-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px dashed #E7EBEF}
  .game-lb-row:last-child{border:none}
  .game-lb-row.me{background:#E4F1FB;border-radius:12px;padding:9px 10px;border:none}
  .game-lb-rank{font-weight:800;width:30px;text-align:center;font-size:14px}
  .game-lb-avatar{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#B8DCF5,#E4F5FE);display:grid;place-items:center;font-weight:800;color:#123B5E}
  .game-lb-name{flex:1;font-weight:700;font-size:14px}
  .game-lb-xp{font-weight:800;color:#123B5E;font-size:13px}
  @media(max-width:420px){.game-badges-grid{grid-template-columns:repeat(3,1fr)}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

console.log('🎮 JobEzz Gamification Engine v3.0 loaded');
