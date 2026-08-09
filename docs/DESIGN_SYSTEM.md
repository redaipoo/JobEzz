# JobEzz — Legendary Design System Documentation

> نظام تصميم أسطوري بمستوى الشركات العالمية (Apple, Google, Stripe)

## 📋 Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Shadows & Depth](#shadows--depth)
6. [Animations & Motion](#animations--motion)
7. [Components](#components)
8. [Accessibility](#accessibility)
9. [Dark Mode](#dark-mode)
10. [Responsive Design](#responsive-design)

---

## 🎨 Design Philosophy

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Clarity** | كل عنصر له هدف واضح. لا زخرفة بدون وظيفة. |
| **Consistency** | أنماط موحدة عبر كل الشاشات والمنصات. |
| **Delight** | تفاصيل صغيرة تخلق تجربة ممتعة (micro-interactions). |
| **Trust** | تصميم يوحي بالاحترافية والأمان (verified badges, secure payments). |
| **Speed** | أداء سريع، تحميل فوري، استجابة مباشرة. |

### Design Identity

- **Brand Colors**: Navy (#123B5E) + Blue (#4AA3E0) — يوحي بالثقة والاحترافية
- **Typography**: Tajawal (Arabic) + Inter (English) — واضح وعصري
- **Iconography**: Line icons, 24px grid, 2px stroke — بسيط ومتسق
- **Imagery**: Real photos, warm tones, diverse people — إنساني وحقيقي

---

## 🎨 Color System

### Primary Palette

```css
/* Navy Scale (Brand Primary) */
--navy-900: #0A1F33;  /* Darkest */
--navy-800: #0E2F4A;
--navy-700: #123B5E;  /* Primary */
--navy-600: #1A4A73;
--navy-500: #245A8A;
--navy-400: #3A7AB5;
--navy-300: #5A9AD5;
--navy-200: #8ABCE8;
--navy-100: #B8DCF5;
--navy-50:  #E4F1FB;  /* Lightest */

/* Blue Scale (Accent) */
--blue-900: #1A5A8A;
--blue-800: #2E8BD0;
--blue-700: #4AA3E0;  /* Accent */
--blue-600: #5BB0E8;
--blue-500: #6DBDF0;
--blue-400: #8ACDF5;
--blue-300: #A8DDFA;
--blue-200: #C5EBFC;
--blue-100: #E4F5FE;
--blue-50:  #F0FAFF;
```

### Semantic Colors

```css
/* Success */
--success-900: #065F46;
--success-700: #047857;
--success-500: #10B981;  /* Primary */
--success-300: #6EE7B7;
--success-100: #D1FAE5;
--success-50:  #ECFDF5;

/* Warning */
--warning-900: #92400E;
--warning-700: #B45309;
--warning-500: #F59E0B;  /* Primary */
--warning-300: #FCD34D;
--warning-100: #FEF3C7;
--warning-50:  #FFFBEB;

/* Danger */
--danger-900: #991B1B;
--danger-700: #B91C1C;
--danger-500: #EF4444;  /* Primary */
--danger-300: #FCA5A5;
--danger-100: #FEE2E2;
--danger-50:  #FEF2F2;

/* Info */
--info-900: #1E40AF;
--info-700: #1D4ED8;
--info-500: #3B82F6;  /* Primary */
--info-300: #93C5FD;
--info-100: #DBEAFE;
--info-50:  #EFF6FF;
```

### Neutral Palette

```css
--gray-950: #0A0F14;
--gray-900: #111827;
--gray-800: #1F2937;
--gray-700: #374151;
--gray-600: #4B5563;
--gray-500: #6B7280;
--gray-400: #9CA3AF;
--gray-300: #D1D5DB;
--gray-200: #E5E7EB;
--gray-100: #F3F4F6;
--gray-50:  #F9FAFB;
```

### Surface Colors

```css
/* Light Mode */
--surface-primary:   #FFFFFF;
--surface-secondary: #F9FAFB;
--surface-tertiary:  #F3F4F6;
--surface-elevated:  #FFFFFF;
--surface-overlay:   rgba(255, 255, 255, 0.95);

/* Dark Mode */
--surface-primary:   #0F172A;
--surface-secondary: #1E293B;
--surface-tertiary:  #334155;
--surface-elevated:  #1E293B;
--surface-overlay:   rgba(15, 23, 42, 0.95);
```

### Usage Guidelines

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `--surface-secondary` | `--surface-secondary` |
| Cards | `--surface-primary` | `--surface-elevated` |
| Text Primary | `--gray-900` | `--gray-50` |
| Text Secondary | `--gray-600` | `--gray-400` |
| Borders | `--gray-200` | `--gray-700` |
| Primary Button | `--gradient-navy` | `--gradient-navy` |
| Links | `--blue-700` | `--blue-400` |

---

## 📝 Typography

### Font Families

```css
--font-ar: "Tajawal", "IBM Plex Sans Arabic", "Segoe UI", system-ui, sans-serif;
--font-en: "Inter", "SF Pro Display", -apple-system, system-ui, sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", "Fira Code", monospace;
```

### Type Scale (Fluid)

```css
--text-xs:   clamp(0.65rem, 0.6rem + 0.25vw, 0.75rem);    /* 10-12px */
--text-sm:   clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);   /* 12-14px */
--text-base: clamp(0.875rem, 0.8rem + 0.35vw, 1rem);      /* 14-16px */
--text-lg:   clamp(1rem, 0.9rem + 0.5vw, 1.125rem);       /* 16-18px */
--text-xl:   clamp(1.125rem, 1rem + 0.6vw, 1.25rem);      /* 18-20px */
--text-2xl:  clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);     /* 20-24px */
--text-3xl:  clamp(1.5rem, 1.3rem + 1vw, 1.875rem);       /* 24-30px */
--text-4xl:  clamp(1.875rem, 1.6rem + 1.25vw, 2.25rem);   /* 30-36px */
--text-5xl:  clamp(2.25rem, 2rem + 1.5vw, 3rem);          /* 36-48px */
--text-6xl:  clamp(3rem, 2.5rem + 2.5vw, 3.75rem);        /* 48-60px */
```

### Font Weights

```css
--font-light:     300;
--font-regular:   400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;
--font-extrabold: 800;
--font-black:     900;
```

### Line Heights

```css
--leading-none:    1;
--leading-tight:   1.25;
--leading-snug:    1.375;
--leading-normal:  1.5;
--leading-relaxed: 1.625;
--leading-loose:   2;
```

### Heading Styles

| Class | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `.h1` | `--text-4xl` | 800 | tight | Page titles |
| `.h2` | `--text-3xl` | 700 | tight | Section headers |
| `.h3` | `--text-2xl` | 700 | snug | Card titles |
| `.h4` | `--text-xl` | 600 | snug | Subsections |
| `.h5` | `--text-lg` | 600 | normal | Small headers |
| `.h6` | `--text-base` | 600 | normal | Labels |

---

## 📐 Spacing & Layout

### Spacing Scale (8px base)

```css
--space-0:   0;
--space-px:  1px;
--space-0-5: 0.125rem;  /* 2px */
--space-1:   0.25rem;   /* 4px */
--space-1-5: 0.375rem;  /* 6px */
--space-2:   0.5rem;    /* 8px */
--space-2-5: 0.625rem;  /* 10px */
--space-3:   0.75rem;   /* 12px */
--space-3-5: 0.875rem;  /* 14px */
--space-4:   1rem;      /* 16px */
--space-5:   1.25rem;   /* 20px */
--space-6:   1.5rem;    /* 24px */
--space-7:   1.75rem;   /* 28px */
--space-8:   2rem;      /* 32px */
--space-9:   2.25rem;   /* 36px */
--space-10:  2.5rem;    /* 40px */
--space-12:  3rem;      /* 48px */
--space-16:  4rem;      /* 64px */
--space-20:  5rem;      /* 80px */
--space-24:  6rem;      /* 96px */
```

### Border Radius

```css
--radius-none: 0;
--radius-sm:   0.25rem;   /* 4px */
--radius-md:   0.5rem;    /* 8px */
--radius-lg:   0.75rem;   /* 12px */
--radius-xl:   1rem;      /* 16px */
--radius-2xl:  1.25rem;   /* 20px */
--radius-3xl:  1.5rem;    /* 24px */
--radius-4xl:  2rem;      /* 32px */
--radius-full: 9999px;
```

### Layout Constants

```css
--app-max:        460px;   /* Phone frame max width */
--nav-h:          64px;    /* Bottom navigation height */
--top-h:          56px;    /* Top bar height */
--container-max:  1280px;  /* Desktop container */
--sidebar-width:  280px;   /* Admin sidebar */
```

---

## 🌑 Shadows & Depth

### Shadow Scale

```css
--shadow-xs:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm:  0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
```

### Colored Shadows

```css
--shadow-navy:    0 10px 30px -5px rgba(18, 59, 94, 0.3);
--shadow-blue:    0 10px 30px -5px rgba(74, 163, 224, 0.3);
--shadow-success: 0 10px 30px -5px rgba(16, 185, 129, 0.3);
--shadow-warning: 0 10px 30px -5px rgba(245, 158, 11, 0.3);
--shadow-danger:  0 10px 30px -5px rgba(239, 68, 68, 0.3);
--shadow-purple:  0 10px 30px -5px rgba(139, 92, 246, 0.3);
```

### Glow Effects

```css
--glow-navy:    0 0 20px rgba(18, 59, 94, 0.4), 0 0 40px rgba(18, 59, 94, 0.2);
--glow-blue:    0 0 20px rgba(74, 163, 224, 0.4), 0 0 40px rgba(74, 163, 224, 0.2);
--glow-success: 0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2);
```

### Elevation Levels

| Level | Shadow | Usage |
|-------|--------|-------|
| 0 | none | Flat elements |
| 1 | `--shadow-xs` | Inputs, subtle cards |
| 2 | `--shadow-sm` | Cards, buttons |
| 3 | `--shadow-md` | Hover state, dropdowns |
| 4 | `--shadow-lg` | Modals, popovers |
| 5 | `--shadow-xl` | Floating elements |
| 6 | `--shadow-2xl` | Full-screen overlays |

---

## ✨ Animations & Motion

### Easing Functions

```css
--ease-linear:      cubic-bezier(0, 0, 1, 1);
--ease-in:          cubic-bezier(0.4, 0, 1, 1);
--ease-out:         cubic-bezier(0, 0, 0.2, 1);
--ease-in-out:      cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-spring-soft: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-bounce:      cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic:     cubic-bezier(0.68, -0.6, 0.32, 1.6);
```

### Duration Scale

```css
--duration-instant: 50ms;
--duration-fast:    150ms;
--duration-normal:  250ms;
--duration-slow:    400ms;
--duration-slower:  600ms;
--duration-slowest: 1000ms;
```

### Animation Classes

| Class | Effect | Duration | Usage |
|-------|--------|----------|-------|
| `.anim-fade` | Fade in | 250ms | General reveal |
| `.anim-fade-up` | Fade + slide up | 400ms | Cards, sections |
| `.anim-fade-down` | Fade + slide down | 250ms | Dropdowns |
| `.anim-scale` | Scale in | 250ms | Modals, popups |
| `.anim-scale-bounce` | Scale with bounce | 600ms | Success states |
| `.anim-bounce` | Bounce in | 800ms | Celebrations |
| `.anim-elastic` | Elastic stretch | 800ms | Playful elements |
| `.anim-float` | Floating loop | 6s | Decorative |
| `.anim-pulse` | Pulse loop | 2s | Notifications |
| `.anim-glow` | Glow loop | 2s | Highlights |
| `.anim-shake` | Shake | 500ms | Errors |

### Staggered Animations

```css
.stagger > * {
  animation: fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 60ms; }
.stagger > *:nth-child(3) { animation-delay: 120ms; }
/* ... up to 10 children */
```

### Motion Principles

1. **Purposeful**: Every animation serves a purpose (feedback, hierarchy, delight)
2. **Quick**: Most animations 150-400ms. Never block user interaction.
3. **Natural**: Use spring physics for organic feel
4. **Consistent**: Same easing/duration for similar interactions
5. **Accessible**: Respect `prefers-reduced-motion`

---

## 🧩 Components

### Buttons

```html
<!-- Primary -->
<button class="btn btn-primary">Primary Action</button>

<!-- Accent -->
<button class="btn btn-accent">Accent Action</button>

<!-- Ghost -->
<button class="btn btn-ghost">Ghost Action</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-xl">Extra Large</button>

<!-- Icon Button -->
<button class="btn btn-icon btn-primary">🔔</button>
```

### Cards

```html
<!-- Standard Card -->
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>

<!-- Glass Card -->
<div class="card card-glass">
  <h3>Glass Card</h3>
</div>

<!-- Neumorphic Card -->
<div class="card card-neu">
  <h3>Neu Card</h3>
</div>

<!-- Elevated Card -->
<div class="card card-elevated">
  <h3>Elevated Card</h3>
</div>
```

### Inputs

```html
<!-- Standard Input -->
<input class="input" type="text" placeholder="Enter text...">

<!-- With Icon -->
<div class="input-group">
  <input class="input" type="text" placeholder="Search...">
  <span class="input-icon">🔍</span>
</div>

<!-- States -->
<input class="input input-error" placeholder="Error state">
<input class="input input-success" placeholder="Success state">
```

### Badges

```html
<span class="badge badge-navy">Navy</span>
<span class="badge badge-blue">Blue</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-purple">Purple</span>
<span class="badge badge-gray">Gray</span>
```

### Chips

```html
<button class="chip">Default Chip</button>
<button class="chip active">Active Chip</button>
```

### Avatars

```html
<div class="avatar">A</div>
<div class="avatar avatar-sm">A</div>
<div class="avatar avatar-lg">A</div>
<div class="avatar avatar-xl">A</div>
<div class="avatar avatar-online">A</div>
```

---

## ♿ Accessibility

### Color Contrast

All text colors meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### Focus States

```css
:focus-visible {
  outline: 3px solid var(--blue-500);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### Screen Reader Support

```html
<!-- Visually hidden but accessible -->
<span class="sr-only">This text is only for screen readers</span>

<!-- ARIA labels -->
<button aria-label="Close dialog">✕</button>
<nav aria-label="Main navigation">...</nav>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Keyboard Navigation

- All interactive elements are focusable
- Logical tab order
- Enter/Space activates buttons
- Escape closes modals/dropdowns
- Arrow keys navigate menus/lists

---

## 🌙 Dark Mode

### Implementation

```css
/* Automatic (system preference) */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Dark mode variables */
  }
}

/* Manual toggle */
[data-theme="dark"] {
  /* Dark mode variables */
}
```

### Color Adjustments

| Element | Light | Dark |
|---------|-------|------|
| Background | `#F9FAFB` | `#0F172A` |
| Surface | `#FFFFFF` | `#1E293B` |
| Text Primary | `#111827` | `#F1F5F9` |
| Text Secondary | `#4B5563` | `#CBD5E1` |
| Border | `#E5E7EB` | `#334155` |
| Shadow | `rgba(0,0,0,0.1)` | `rgba(0,0,0,0.4)` |

### Glassmorphism in Dark Mode

```css
[data-theme="dark"] {
  --glass-bg: rgba(15, 23, 42, 0.7);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First */
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Container Widths

| Breakpoint | Max Width |
|------------|-----------|
| Mobile | 100% |
| sm (640px) | 640px |
| md (768px) | 768px |
| lg (1024px) | 1024px |
| xl (1280px) | 1280px |
| 2xl (1536px) | 1536px |

### Touch Targets

- Minimum: 44x44px (Apple HIG)
- Recommended: 48x48px (Material Design)
- Spacing between targets: 8px minimum

---

## 📚 Resources

- [Figma Design File](#) (link to Figma)
- [Storybook Components](#) (link to Storybook)
- [Icon Library](#) (link to icons)
- [Brand Guidelines PDF](#) (link to PDF)

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | 2026-07-20 | Legendary Edition: Advanced animations, 3D effects, sound design |
| 2.0 | 2026-07-15 | Dark mode, glassmorphism, improved accessibility |
| 1.0 | 2026-07-01 | Initial design system |

---

## 👥 Contributors

- Design Team
- Engineering Team
- Product Team

---

## 📄 License

Proprietary — JobEzz © 2026. All rights reserved.
