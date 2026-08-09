/* ============================================================
   JobEzz — LEGENDARY Animation Engine v3.0
   Spring Physics, 3D Transforms, Parallax, Scroll Reveals,
   Haptic Feedback, Sound Design, Gesture System
   ============================================================ */

/* ---------- Spring Physics Engine ---------- */
class SpringPhysics {
  constructor(options = {}) {
    this.stiffness = options.stiffness || 100;
    this.damping = options.damping || 10;
    this.mass = options.mass || 1;
    this.velocity = 0;
    this.position = 0;
    this.target = 0;
    this.onUpdate = options.onUpdate || (() => {});
    this.onComplete = options.onComplete || (() => {});
    this.threshold = 0.001;
    this.animating = false;
  }

  setTarget(target) {
    this.target = target;
    if (!this.animating) {
      this.animating = true;
      this.animate();
    }
  }

  animate() {
    const step = () => {
      const force = -this.stiffness * (this.position - this.target);
      const dampingForce = -this.damping * this.velocity;
      const acceleration = (force + dampingForce) / this.mass;

      this.velocity += acceleration * 0.016; // 60fps
      this.position += this.velocity * 0.016;

      this.onUpdate(this.position);

      if (Math.abs(this.velocity) < this.threshold &&
          Math.abs(this.position - this.target) < this.threshold) {
        this.position = this.target;
        this.velocity = 0;
        this.animating = false;
        this.onUpdate(this.position);
        this.onComplete();
        return;
      }

      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

/* ---------- Scroll Reveal System ---------- */
class ScrollReveal {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -80px 0px',
      ...options
    };
    this.observer = null;
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.reveal(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, this.options);
  }

  observe(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      this.observer.observe(el);
    });
  }

  reveal(el) {
    const delay = el.dataset.delay || 0;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  }
}

/* ---------- Parallax Engine ---------- */
class ParallaxEngine {
  constructor() {
    this.elements = [];
    this.ticking = false;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    window.addEventListener('resize', () => this.onResize(), { passive: true });
  }

  add(selector, speed = 0.5) {
    const els = document.querySelectorAll(selector);
    els.forEach(el => {
      this.elements.push({ el, speed, initialTop: el.offsetTop });
    });
  }

  onScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.update();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  update() {
    const scrollY = window.pageYOffset;
    this.elements.forEach(({ el, speed }) => {
      const yPos = -(scrollY * speed);
      el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }

  onResize() {
    this.elements.forEach(item => {
      item.initialTop = item.el.offsetTop;
    });
  }
}

/* ---------- 3D Tilt Effect ---------- */
class TiltEffect {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      maxTilt: options.maxTilt || 10,
      perspective: options.perspective || 1000,
      scale: options.scale || 1.02,
      speed: options.speed || 300,
      glare: options.glare !== false,
      ...options
    };
    this.init();
  }

  init() {
    this.element.style.transformStyle = 'preserve-3d';
    this.element.style.transition = `transform ${this.options.speed}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

    if (this.options.glare) {
      this.createGlare();
    }

    this.element.addEventListener('mouseenter', () => this.onEnter());
    this.element.addEventListener('mousemove', (e) => this.onMove(e));
    this.element.addEventListener('mouseleave', () => this.onLeave());
  }

  createGlare() {
    const glare = document.createElement('div');
    glare.className = 'tilt-glare';
    glare.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
      border-radius: inherit;
    `;
    this.element.style.position = 'relative';
    this.element.style.overflow = 'hidden';
    this.element.appendChild(glare);
    this.glare = glare;
  }

  onEnter() {
    this.element.style.transition = 'transform 0.1s';
    if (this.glare) this.glare.style.opacity = '1';
  }

  onMove(e) {
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -this.options.maxTilt;
    const rotateY = ((x - centerX) / centerX) * this.options.maxTilt;

    this.element.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(${this.options.scale}, ${this.options.scale}, ${this.options.scale})
    `;

    if (this.glare) {
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
      this.glare.style.background = `linear-gradient(${angle + 135}deg, rgba(255,255,255,0.4) 0%, transparent 50%)`;
    }
  }

  onLeave() {
    this.element.style.transition = `transform ${this.options.speed}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
    this.element.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    `;
    if (this.glare) this.glare.style.opacity = '0';
  }
}

/* ---------- Haptic Feedback System ---------- */
class HapticFeedback {
  static isSupported() {
    return 'vibrate' in navigator;
  }

  static light() {
    if (this.isSupported()) navigator.vibrate(10);
  }

  static medium() {
    if (this.isSupported()) navigator.vibrate(20);
  }

  static heavy() {
    if (this.isSupported()) navigator.vibrate(30);
  }

  static success() {
    if (this.isSupported()) navigator.vibrate([10, 50, 10]);
  }

  static error() {
    if (this.isSupported()) navigator.vibrate([30, 50, 30, 50, 30]);
  }

  static warning() {
    if (this.isSupported()) navigator.vibrate([20, 30, 20]);
  }

  static selection() {
    if (this.isSupported()) navigator.vibrate(5);
  }

  static impact(style = 'medium') {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
      rigid: [10, 20],
      soft: [5, 10, 5]
    };
    if (this.isSupported()) navigator.vibrate(patterns[style] || 20);
  }
}

/* ---------- Sound Design System (Web Audio API) ---------- */
class SoundDesign {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.3;
    this.init();
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(frequency, duration, type = 'sine', volume = this.volume) {
    if (!this.enabled || !this.ctx) return;
    this.resume();

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    oscillator.start(this.ctx.currentTime);
    oscillator.stop(this.ctx.currentTime + duration);
  }

  click() {
    this.playTone(800, 0.05, 'sine', 0.1);
  }

  tap() {
    this.playTone(600, 0.08, 'sine', 0.15);
  }

  success() {
    this.playTone(523.25, 0.1, 'sine', 0.2); // C5
    setTimeout(() => this.playTone(659.25, 0.1, 'sine', 0.2), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.15, 'sine', 0.2), 200); // G5
  }

  error() {
    this.playTone(200, 0.15, 'sawtooth', 0.15);
    setTimeout(() => this.playTone(150, 0.2, 'sawtooth', 0.15), 100);
  }

  notification() {
    this.playTone(880, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(1108.73, 0.15, 'sine', 0.2), 100);
  }

  whoosh() {
    if (!this.enabled || !this.ctx) return;
    this.resume();

    const oscillator = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    oscillator.start(this.ctx.currentTime);
    oscillator.stop(this.ctx.currentTime + 0.15);
  }

  pop() {
    this.playTone(400, 0.05, 'sine', 0.2);
    setTimeout(() => this.playTone(600, 0.05, 'sine', 0.15), 30);
  }

  swipe() {
    this.whoosh();
  }

  toggle(on) {
    this.playTone(on ? 600 : 400, 0.08, 'sine', 0.15);
  }
}

/* ---------- Gesture System ---------- */
class GestureSystem {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      swipeThreshold: 50,
      longPressDelay: 500,
      ...options
    };
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.longPressTimer = null;
    this.callbacks = {
      swipeLeft: options.onSwipeLeft || (() => {}),
      swipeRight: options.onSwipeRight || (() => {}),
      swipeUp: options.onSwipeUp || (() => {}),
      swipeDown: options.onSwipeDown || (() => {}),
      longPress: options.onLongPress || (() => {}),
      tap: options.onTap || (() => {}),
      doubleTap: options.onDoubleTap || (() => {})
    };
    this.lastTap = 0;
    this.init();
  }

  init() {
    this.element.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
    this.element.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: true });
    this.element.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });

    // Mouse events for desktop
    this.element.addEventListener('mousedown', (e) => this.onTouchStart(e));
    this.element.addEventListener('mouseup', (e) => this.onTouchEnd(e));
  }

  onTouchStart(e) {
    const touch = e.touches ? e.touches[0] : e;
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();

    this.longPressTimer = setTimeout(() => {
      this.callbacks.longPress(e);
      HapticFeedback.medium();
    }, this.options.longPressDelay);
  }

  onTouchMove(e) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  onTouchEnd(e) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const deltaX = touch.clientX - this.startX;
    const deltaY = touch.clientY - this.startY;
    const deltaTime = Date.now() - this.startTime;

    // Swipe detection
    if (Math.abs(deltaX) > this.options.swipeThreshold || Math.abs(deltaY) > this.options.swipeThreshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          this.callbacks.swipeRight(e);
        } else {
          this.callbacks.swipeLeft(e);
        }
      } else {
        if (deltaY > 0) {
          this.callbacks.swipeDown(e);
        } else {
          this.callbacks.swipeUp(e);
        }
      }
      HapticFeedback.light();
      return;
    }

    // Tap / Double tap detection
    if (deltaTime < 300) {
      const now = Date.now();
      if (now - this.lastTap < 300) {
        this.callbacks.doubleTap(e);
        HapticFeedback.medium();
      } else {
        this.callbacks.tap(e);
        HapticFeedback.light();
      }
      this.lastTap = now;
    }
  }
}

/* ---------- Pull to Refresh ---------- */
class PullToRefresh {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      threshold: 80,
      maxPull: 120,
      onRefresh: options.onRefresh || (() => {}),
      ...options
    };
    this.startY = 0;
    this.currentY = 0;
    this.pulling = false;
    this.refreshing = false;
    this.indicator = null;
    this.init();
  }

  init() {
    this.createIndicator();

    this.container.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
    this.container.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    this.container.addEventListener('touchend', () => this.onTouchEnd(), { passive: true });
  }

  createIndicator() {
    this.indicator = document.createElement('div');
    this.indicator.className = 'ptr-indicator';
    this.indicator.innerHTML = `
      <div class="ptr-spinner"></div>
      <div class="ptr-text">اسحب للتحديث</div>
    `;
    this.indicator.style.cssText = `
      position: absolute;
      top: -60px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 100;
    `;
    this.container.style.position = 'relative';
    this.container.appendChild(this.indicator);
  }

  onTouchStart(e) {
    if (this.container.scrollTop === 0 && !this.refreshing) {
      this.startY = e.touches[0].clientY;
      this.pulling = true;
    }
  }

  onTouchMove(e) {
    if (!this.pulling) return;

    this.currentY = e.touches[0].clientY;
    const deltaY = this.currentY - this.startY;

    if (deltaY > 0) {
      e.preventDefault();
      const pull = Math.min(deltaY * 0.5, this.options.maxPull);
      this.container.style.transform = `translateY(${pull}px)`;
      this.indicator.style.transform = `translateX(-50%) translateY(${pull}px)`;

      const progress = pull / this.options.threshold;
      this.indicator.querySelector('.ptr-text').textContent =
        progress >= 1 ? 'أفلت للتحديث' : 'اسحب للتحديث';
      this.indicator.querySelector('.ptr-spinner').style.transform = `rotate(${progress * 360}deg)`;
    }
  }

  onTouchEnd() {
    if (!this.pulling) return;
    this.pulling = false;

    const deltaY = this.currentY - this.startY;
    const pull = Math.min(deltaY * 0.5, this.options.maxPull);

    if (pull >= this.options.threshold) {
      this.refresh();
    } else {
      this.reset();
    }
  }

  refresh() {
    this.refreshing = true;
    this.container.style.transform = 'translateY(60px)';
    this.indicator.style.transform = 'translateX(-50%) translateY(60px)';
    this.indicator.querySelector('.ptr-text').textContent = 'جارٍ التحديث...';
    this.indicator.querySelector('.ptr-spinner').classList.add('spinning');

    HapticFeedback.success();
    SoundDesign.notification();

    this.options.onRefresh().then(() => {
      this.reset();
      this.refreshing = false;
    });
  }

  reset() {
    this.container.style.transform = 'translateY(0)';
    this.indicator.style.transform = 'translateX(-50%) translateY(0)';
    this.indicator.querySelector('.ptr-spinner').classList.remove('spinning');
  }
}

/* ---------- Page Transition System ---------- */
class PageTransitions {
  constructor() {
    this.isTransitioning = false;
  }

  async transition(from, to, direction = 'forward') {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const animations = {
      forward: {
        from: { transform: 'translateX(0)', opacity: 1 },
        to: { transform: 'translateX(-30%)', opacity: 0 }
      },
      back: {
        from: { transform: 'translateX(0)', opacity: 1 },
        to: { transform: 'translateX(30%)', opacity: 0 }
      },
      up: {
        from: { transform: 'translateY(0)', opacity: 1 },
        to: { transform: 'translateY(-30%)', opacity: 0 }
      },
      down: {
        from: { transform: 'translateY(0)', opacity: 1 },
        to: { transform: 'translateY(30%)', opacity: 0 }
      },
      fade: {
        from: { opacity: 1 },
        to: { opacity: 0 }
      },
      scale: {
        from: { transform: 'scale(1)', opacity: 1 },
        to: { transform: 'scale(0.9)', opacity: 0 }
      },
      flip: {
        from: { transform: 'perspective(1000px) rotateY(0deg)', opacity: 1 },
        to: { transform: 'perspective(1000px) rotateY(-90deg)', opacity: 0 }
      }
    };

    const anim = animations[direction] || animations.forward;

    // Animate out
    if (from) {
      await this.animate(from, anim.to, 300);
    }

    // Animate in
    if (to) {
      const fromState = { ...anim.to };
      Object.keys(fromState).forEach(key => {
        if (key === 'transform') {
          fromState[key] = fromState[key].replace(/-/, '');
        }
      });
      to.style.transform = fromState.transform || '';
      to.style.opacity = fromState.opacity || '';
      await this.animate(to, anim.from, 400);
    }

    this.isTransitioning = false;
  }

  animate(element, props, duration) {
    return new Promise(resolve => {
      element.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
      Object.assign(element.style, props);
      setTimeout(resolve, duration);
    });
  }
}

/* ---------- Confetti Effect ---------- */
class Confetti {
  static burst(options = {}) {
    const {
      count = 100,
      colors = ['#123B5E', '#4AA3E0', '#2ECC71', '#F5A623', '#8B5CF6', '#EC4899'],
      duration = 3000,
      spread = 360,
      startVelocity = 30
    } = options;

    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 10 + 5;
      const left = Math.random() * 100;
      const delay = Math.random() * 500;
      const rotation = Math.random() * spread;

      confetti.style.cssText = `
        position: absolute;
        top: -20px;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation: confetti ${duration}ms ease-out ${delay}ms forwards;
        transform: rotate(${rotation}deg);
      `;
      container.appendChild(confetti);
    }

    setTimeout(() => container.remove(), duration + 500);
  }
}

/* ---------- Typewriter Effect ---------- */
class Typewriter {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      speed: 50,
      deleteSpeed: 30,
      pause: 2000,
      loop: true,
      ...options
    };
    this.texts = options.texts || [];
    this.currentText = 0;
    this.currentChar = 0;
    this.isDeleting = false;
    this.init();
  }

  init() {
    if (this.texts.length === 0) return;
    this.type();
  }

  type() {
    const text = this.texts[this.currentText];

    if (this.isDeleting) {
      this.currentChar--;
    } else {
      this.currentChar++;
    }

    this.element.textContent = text.substring(0, this.currentChar);

    let delay = this.isDeleting ? this.options.deleteSpeed : this.options.speed;

    if (!this.isDeleting && this.currentChar === text.length) {
      delay = this.options.pause;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentChar === 0) {
      this.isDeleting = false;
      this.currentText = (this.currentText + 1) % this.texts.length;
      delay = 500;
    }

    setTimeout(() => this.type(), delay);
  }
}

/* ---------- Counter Animation ---------- */
class CounterAnimation {
  static animate(element, target, duration = 2000, options = {}) {
    const {
      decimals = 0,
      prefix = '',
      suffix = '',
      separator = ','
    } = options;

    const start = 0;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutExpo)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (target - start) * eased;

      const formatted = current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      element.textContent = prefix + formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }
}

/* ---------- Ripple Effect (Advanced) ---------- */
class RippleEffect {
  static create(event, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-advanced';
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleCenter 0.6s ease-out forwards;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }
}

/* ---------- Magnetic Button Effect ---------- */
class MagneticButton {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      strength: 0.3,
      radius: 100,
      ...options
    };
    this.init();
  }

  init() {
    this.element.addEventListener('mousemove', (e) => this.onMove(e));
    this.element.addEventListener('mouseleave', () => this.onLeave());
  }

  onMove(e) {
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const distance = Math.sqrt(x * x + y * y);

    if (distance < this.options.radius) {
      const force = (1 - distance / this.options.radius) * this.options.strength;
      this.element.style.transform = `translate(${x * force}px, ${y * force}px)`;
    }
  }

  onLeave() {
    this.element.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    this.element.style.transform = 'translate(0, 0)';
    setTimeout(() => {
      this.element.style.transition = '';
    }, 300);
  }
}

/* ---------- Export ---------- */
window.LegendaryAnimations = {
  SpringPhysics,
  ScrollReveal,
  ParallaxEngine,
  TiltEffect,
  HapticFeedback,
  SoundDesign: new SoundDesign(),
  GestureSystem,
  PullToRefresh,
  PageTransitions: new PageTransitions(),
  Confetti,
  Typewriter,
  CounterAnimation,
  RippleEffect,
  MagneticButton
};

console.log('🚀 JobEzz Legendary Animation Engine v3.0 loaded');
