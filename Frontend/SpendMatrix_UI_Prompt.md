# 🎨 SPEND MATRIX — Complete UI/UX Redesign Prompt
### Inspired by GDG Charusat's Modern, Vibrant, Animated Web Design Language

---

## 📌 PROJECT OVERVIEW

**App Name:** Spend Matrix  
**Type:** Personal Finance Web App (React + Vite + TailwindCSS + React Router)  
**Stack:** React (JSX), TailwindCSS, Recharts (for charts), React Router v6  
**Pages Count:** 15 pages + 1 shared layout  
**Tagline:** *"Let's Start Tracking Your Transactions"*

---

## 🎯 DESIGN DIRECTION — GDG CHARUSAT INSPIRED

The GDG Charusat website uses a **modern tech-conference aesthetic**: bold Google-brand color accents (blue, red, yellow, green), clean white/near-white backgrounds, geometric floating elements, smooth entrance animations, glassmorphism cards, gradient text headings, and a strong typographic hierarchy. Apply this same design language across every page of Spend Matrix, adapted for a finance app context.

### Core Design Philosophy:
- **Clean but alive** — white/light backgrounds with vivid accent colors and animated floating shapes in the background
- **Google Material 3 inspired** — not vanilla Material, but its modern expressive flavor
- **Conference-grade polish** — every page looks like it was designed for a tech event keynote
- **Micro-interactions everywhere** — hover lifts, color transitions, spinner states, staggered list animations
- **Glassmorphism for cards** — semi-transparent white panels with backdrop blur and soft borders
- **Gradient text** — headings use linear gradients (indigo → violet → blue)
- **Smooth page transitions** — fade-in-up for every page on mount

---

## 🎨 GLOBAL DESIGN SYSTEM

### Color Palette (CSS Variables — define in index.css or :root)

```css
:root {
  /* Primary — Indigo/Violet brand */
  --color-primary:        #4F46E5;  /* indigo-600 */
  --color-primary-light:  #818CF8;  /* indigo-400 */
  --color-primary-dark:   #3730A3;  /* indigo-800 */
  --color-primary-bg:     #EEF2FF;  /* indigo-50 */

  /* Accent colors (GDG multi-color spirit) */
  --color-green:   #10B981;  /* emerald-500 — income, success */
  --color-red:     #EF4444;  /* red-500 — expense, danger */
  --color-yellow:  #F59E0B;  /* amber-500 — warning, budget alerts */
  --color-blue:    #3B82F6;  /* blue-500 — info, analytics */
  --color-violet:  #8B5CF6;  /* violet-500 — premium/admin */

  /* Neutrals */
  --color-bg:        #F8FAFF;   /* page background — barely-blue white */
  --color-surface:   #FFFFFF;   /* card background */
  --color-border:    #E5E7EB;   /* gray-200 */
  --color-muted:     #9CA3AF;   /* gray-400 */
  --color-text:      #111827;   /* gray-900 */
  --color-text-sub:  #6B7280;   /* gray-500 */

  /* Glassmorphism */
  --glass-bg:      rgba(255,255,255,0.7);
  --glass-border:  rgba(255,255,255,0.5);
  --glass-blur:    backdrop-filter: blur(12px);

  /* Shadows */
  --shadow-card:   0 4px 24px rgba(79, 70, 229, 0.08);
  --shadow-hover:  0 8px 40px rgba(79, 70, 229, 0.18);
  --shadow-glow:   0 0 40px rgba(79, 70, 229, 0.20);
}
```

### Typography

- **Display/Heading Font:** `Plus Jakarta Sans` (import from Google Fonts) — weight 700, 800 for H1; 600 for H2; 500 for H3
- **Body Font:** `DM Sans` — weight 400 for body, 500 for labels, 600 for buttons
- **Monospace (for amounts):** `JetBrains Mono` — used for all ₹ values, numbers, and transaction amounts
- **Font scale:**
  - H1: `2.5rem / 3rem` font-size, `font-weight: 800`, letter-spacing: `-0.02em`
  - H2: `1.75rem`, `font-weight: 700`
  - H3: `1.25rem`, `font-weight: 600`
  - Body: `0.9375rem`, `font-weight: 400`, line-height: `1.6`
  - Caption/Label: `0.8125rem`, `font-weight: 500`, letter-spacing: `0.02em`

### Gradient Text (for page headings)
```css
.gradient-text {
  background: linear-gradient(135deg, #4F46E5 0%, #8B5CF6 50%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Animated Background (use on all full-page screens — landing, login, register)
```
Floating colored blobs/circles, blurred, slowly drifting:
- 1 large indigo blob (top-right, opacity: 0.15, diameter ~500px)
- 1 violet blob (bottom-left, opacity: 0.12, diameter ~350px)  
- 1 blue blob (center-right, opacity: 0.1, diameter ~250px)
- Animation: keyframe `float` — translateY(-20px) → translateY(0px) over 6s infinite alternate ease-in-out
- Each blob has different animation-delay (0s, 2s, 4s)
```

### Geometric Decorative Pattern (use in sidebar, hero, and card headers)
```
Subtle grid of dots (dot matrix pattern) as a CSS background:
background-image: radial-gradient(circle, rgba(79,70,229,0.12) 1px, transparent 1px);
background-size: 20px 20px;
Overlay this on hero sections at 40% opacity.
```

### Border Radius
- Cards: `border-radius: 16px`
- Buttons: `border-radius: 10px`
- Inputs: `border-radius: 10px`
- Badges/chips: `border-radius: 999px`
- Modals: `border-radius: 20px`

### Animations (define globally in index.css)
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes float {
  from { transform: translateY(0px) rotate(0deg); }
  to   { transform: translateY(-22px) rotate(4deg); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(79,70,229,0.3); }
  50%       { box-shadow: 0 0 0 10px rgba(79,70,229,0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes countUp {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}

/* Staggered list items */
.stagger-item:nth-child(1) { animation-delay: 0.05s; }
.stagger-item:nth-child(2) { animation-delay: 0.10s; }
.stagger-item:nth-child(3) { animation-delay: 0.15s; }
.stagger-item:nth-child(4) { animation-delay: 0.20s; }
.stagger-item:nth-child(5) { animation-delay: 0.25s; }
/* …and so on */
```

### Button System

**Primary Button:**
- Background: `linear-gradient(135deg, #4F46E5, #7C3AED)`
- Color: white
- Padding: `12px 24px`
- Font: DM Sans 600, 0.9375rem
- Border-radius: 10px
- Box-shadow: `0 4px 14px rgba(79, 70, 229, 0.35)`
- Hover: shadow increases to `0 8px 20px rgba(79, 70, 229, 0.5)`, translateY(-1px)
- Active: translateY(0), shadow reduces
- Loading state: spinner replaces text, button disabled

**Secondary Button:**
- Background: white
- Border: `2px solid #E5E7EB`
- Color: #4F46E5
- Hover: border-color → #4F46E5, background → #EEF2FF

**Danger Button:**
- Background: `linear-gradient(135deg, #EF4444, #DC2626)`
- Same structure as primary but red

**Icon Button:**
- 36px × 36px circle
- Background: rgba(79,70,229,0.08)
- Icon color: #4F46E5
- Hover: background darkens

### Input System

```
border: 1.5px solid #E5E7EB
border-radius: 10px
padding: 11px 14px
font: DM Sans 400, 0.9375rem
background: #FAFBFF (very pale blue-white)
transition: border-color 0.2s, box-shadow 0.2s

Focus:
  border-color: #4F46E5
  box-shadow: 0 0 0 3px rgba(79,70,229,0.15)

Error:
  border-color: #EF4444
  box-shadow: 0 0 0 3px rgba(239,68,68,0.12)

Label: DM Sans 500, 0.8125rem, color #374151, margin-bottom: 6px
Error text: DM Sans 400, 0.75rem, color #EF4444, margin-top: 4px
```

### Card System

```
background: rgba(255,255,255,0.85)
backdrop-filter: blur(12px)
border: 1.5px solid rgba(255,255,255,0.6)
border-radius: 16px
box-shadow: 0 4px 24px rgba(79,70,229,0.08)
padding: 24px

Hover (interactive cards):
  transform: translateY(-3px)
  box-shadow: 0 12px 40px rgba(79,70,229,0.16)
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Loading Spinner
```
Width/height: 32px
Border: 3.5px solid rgba(79,70,229,0.15)
Border-top: 3.5px solid #4F46E5
Border-radius: 50%
animation: spin 0.75s linear infinite
Centered in a min-h-48 flex container
```

### Status Badges
```
Income/Success: bg #ECFDF5, text #065F46, border 1px solid #A7F3D0
Expense/Error:  bg #FEF2F2, text #991B1B, border 1px solid #FECACA
Warning:        bg #FFFBEB, text #92400E, border 1px solid #FDE68A
Info/Neutral:   bg #EFF6FF, text #1E40AF, border 1px solid #BFDBFE
Admin/Premium:  bg #F5F3FF, text #5B21B6, border 1px solid #DDD6FE
```

---

## 🧭 LAYOUT — MAIN APP SHELL (MainLayout.jsx)

### Top Header Bar
```
Height: 64px
Background: rgba(255,255,255,0.92)
Backdrop-filter: blur(16px)
Border-bottom: 1.5px solid rgba(229,231,235,0.8)
Box-shadow: 0 2px 20px rgba(0,0,0,0.04)
Position: sticky top-0
Z-index: 50
Padding: 0 28px
Display: flex, align-items: center, justify-content: space-between

LEFT SIDE:
  - Animated logo: money emoji (💰) + "Spend Matrix" in Plus Jakarta Sans 700
  - Logo text uses gradient-text (indigo → violet)
  - On hover: logo emoji does a subtle rotate(12deg) scale(1.1) animation

RIGHT SIDE (left to right):
  1. NotificationBell — badge counter with red pulsing dot when unread > 0
     - Bell icon: 22px, color #6B7280
     - Hover: color #4F46E5
     - Badge: 18px red circle with white count text, top-right of bell
     - Unread: pulse-glow animation on badge
  2. Settings gear icon — 22px, same hover as bell, NavLink to /settings
  3. User avatar circle (initials from full_name):
     - 36px circle
     - Background: linear-gradient(135deg, #4F46E5, #8B5CF6)
     - White initials text, 14px DM Sans 600
  4. Logout button:
     - Small, 32px height
     - Background: rgba(239,68,68,0.1)
     - Color: #DC2626
     - Border: 1px solid rgba(239,68,68,0.2)
     - Border-radius: 8px
     - Text: "Logout" DM Sans 500 13px
     - Hover: background #EF4444, color white, smooth 0.2s
```

### Left Sidebar Navigation
```
Width: 220px
Background: rgba(255,255,255,0.95)
Backdrop-filter: blur(16px)
Border-right: 1.5px solid rgba(229,231,235,0.8)
Height: calc(100vh - 64px)
Position: sticky, top: 64px
Padding: 20px 12px
Display: flex, flex-direction: column, gap: 4px
Box-shadow: 4px 0 20px rgba(0,0,0,0.03)

TOP: Small label "MAIN MENU" in uppercase, 10px DM Sans 600, color #9CA3AF, 
     letter-spacing: 0.08em, padding: 0 12px, margin-bottom: 8px

NAV ITEMS (in order):
  📊 Dashboard     → /dashboard
  💳 Transactions  → /transactions
  🏷️ Categories    → /categories
  🎯 Budgets       → /budgets
  📈 Analytics     → /analytics
  🔁 Recurring     → /recurring

Each nav item:
  - Display: flex, align-items: center, gap: 10px
  - Padding: 10px 14px
  - Border-radius: 10px
  - Font: DM Sans 500, 0.875rem
  - Transition: all 0.18s ease

  INACTIVE:
    color: #6B7280
    background: transparent
    icon: 18px, same color

  ACTIVE:
    background: linear-gradient(135deg, rgba(79,70,229,0.12), rgba(139,92,246,0.08))
    color: #4F46E5
    font-weight: 600
    box-shadow: inset 2px 0 0 #4F46E5 (left accent bar simulation via left-border)
    icon: color #4F46E5

  HOVER (inactive):
    background: rgba(79,70,229,0.06)
    color: #4F46E5

BOTTOM: Admin link (if admin role)
  Separator: 1px solid #E5E7EB, margin: 8px 12px
  Label: "ADMIN" uppercase 10px
  🛡️ Admin Panel → /admin
  Same item styling but accent color #8B5CF6 (violet) instead of indigo

BOTTOM PADDING SECTION:
  A small decorative mini card at the bottom of sidebar:
  - Background: linear-gradient(135deg, #4F46E5, #7C3AED)
  - Border-radius: 12px
  - Padding: 14px
  - White text: "💡 Pro Tip"
  - Sub text: "Set budgets to track your spending goals!" — 11px
  - Subtle shimmer animation across the gradient
```

### Main Content Area
```
flex: 1
padding: 28px 32px
background: #F8FAFF (matches --color-bg)
min-height: calc(100vh - 64px)
overflow-y: auto

Subtle dot-matrix background pattern (very low opacity: 0.4):
  background-image: radial-gradient(circle, rgba(79,70,229,0.06) 1px, transparent 1px);
  background-size: 24px 24px;

Each page content:
  animation: fadeInUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both
```

---

## 📄 PAGE 1 — LANDING PAGE (/LandingPage.jsx)

### Navbar (Public)
```
Fixed, top-0, full width
Height: 68px
Background: rgba(255,255,255,0.88)
Backdrop-filter: blur(20px)
Border-bottom: 1.5px solid rgba(229,231,235,0.5)
Box-shadow: 0 2px 20px rgba(0,0,0,0.05)

LEFT: 💰 "Spend Matrix" — Plus Jakarta Sans 800, gradient-text (indigo→violet)
      Logo animates in with fadeInLeft on mount

RIGHT:
  - "Log In" link: DM Sans 500, 14px, color #6B7280, hover → #4F46E5
                   padding: 8px 16px, border-radius: 8px, hover: bg #EEF2FF
  - "Sign Up" button: Primary gradient button, 12px 20px, 13px font
```

### Hero Section
```
Background: 
  - Base: linear-gradient(145deg, #F0F4FF 0%, #FEFEFF 40%, #F5F0FF 100%)
  - Floating blobs:
    - Blob 1 (indigo): top: -80px, right: -60px, 500px×500px, 
                       background: rgba(79,70,229,0.1), border-radius: 50%, 
                       filter: blur(70px), animation: float 7s infinite alternate ease-in-out
    - Blob 2 (violet): bottom: -100px, left: -80px, 400px×400px,
                       background: rgba(139,92,246,0.1), border-radius: 50%,
                       filter: blur(60px), animation: float 9s infinite alternate-reverse ease-in-out
    - Blob 3 (blue): center-right, 250px×250px,
                     background: rgba(59,130,246,0.08), border-radius: 50%,
                     filter: blur(50px), animation: float 6s 2s infinite alternate ease-in-out
  - Dot-matrix overlay: radial-gradient dots, opacity 0.4

Padding: 140px 24px 100px (top accounts for fixed navbar)

CONTENT (max-width 700px, centered):
  Animate children with staggered fadeInUp:

  1. BADGE (delay 0s):
     "✨ Personal Finance Made Simple"
     Background: rgba(79,70,229,0.08)
     Border: 1px solid rgba(79,70,229,0.2)
     Color: #4F46E5
     Border-radius: 999px
     Padding: 6px 14px
     Font: DM Sans 600, 12px
     Letter-spacing: 0.06em, UPPERCASE

  2. H1 (delay 0.08s):
     Line 1: "Let's Start Tracking"  — Plus Jakarta Sans 800, 3.5rem, #111827
     Line 2: "Your Transactions"     — gradient-text (indigo→violet→blue)
     Line-height: 1.15
     Margin-bottom: 20px

  3. SUBTITLE (delay 0.16s):
     "Spend Matrix gives you a crystal-clear picture of where your money goes —
      with smart budgets, visual analytics, and real-time alerts all in one place."
     DM Sans 400, 1.0625rem, color #6B7280, max-width: 520px, line-height: 1.65

  4. CTA BUTTONS (delay 0.22s):
     Row: flex, gap: 12px, justify: center
     - "Get Started →": Primary gradient button, 14px 32px padding, DM Sans 600, 1rem
                        Box-shadow: 0 6px 20px rgba(79,70,229,0.35)
                        Hover: translateY(-2px), shadow intensifies
     - "I Already Have an Account": Secondary button, same size

MOCK DASHBOARD PREVIEW (delay 0.4s):
  Max-width: 760px, margin: 60px auto 0
  Animation: fadeInUp 0.5s 0.4s both
  
  Container:
    background: rgba(255,255,255,0.9)
    backdrop-filter: blur(12px)
    border: 1.5px solid rgba(79,70,229,0.12)
    border-radius: 20px
    box-shadow: 0 20px 80px rgba(79,70,229,0.15), 0 0 0 1px rgba(255,255,255,0.5)
    overflow: hidden

  TOP BAR:
    background: linear-gradient(135deg, #4F46E5, #7C3AED)
    height: 44px
    padding: 0 16px
    display: flex, align-items: center, gap: 8px
    - 3 window control dots: red (#FF5F57), yellow (#FFBD2E), green (#28CA42)
      Each 12px circle
    - "spendmatrix.app/dashboard" text: 12px, rgba(255,255,255,0.65), DM Sans 400
      Left-padding: 12px

  STATS GRID inside preview (4 columns):
    Each mini stat card:
      border-radius: 12px, padding: 14px
      - Total Income:   bg #ECFDF5, value "₹4,250" DM Sans 700 green
      - Total Expenses: bg #FEF2F2, value "₹2,840" red
      - Net Savings:    bg #EEF2FF, value "₹1,410" indigo
      - Budget Used:    bg #FFFBEB, value "67%"    amber

  RECENT TRANSACTIONS inside preview:
    bg #F8FAFF, border-radius: 12px, padding: 14px 16px
    Label: "RECENT TRANSACTIONS" — 10px, DM Sans 600, #9CA3AF, uppercase, letter-spacing: 0.06em
    3 transaction rows (each a flex row, border-bottom):
      - Grocery Store / Food / -₹85.20 (red)
      - Salary Deposit / Income / +₹2,500 (green)
      - Netflix / Entertainment / -₹15.99 (red)
    Values use JetBrains Mono
```

### Stats Bar
```
Background: linear-gradient(135deg, #4F46E5 0%, #6D28D9 100%)
Padding: 52px 24px
Position: relative, overflow: hidden

Decorative element: Large semi-transparent circle in top-right corner
  (width: 300px, height: 300px, border: 2px solid rgba(255,255,255,0.1), 
   border-radius: 50%, position: absolute, top: -100px, right: -60px)

4 stat cards (max-width 900px, grid 4 cols):
  Each stat:
    - Value: Plus Jakarta Sans 800, 2.75rem, white
             Count-up animation on mount (use IntersectionObserver)
    - Label: DM Sans 400, 0.875rem, rgba(255,255,255,0.7), margin-top: 4px

  Stats:
    10K+  → Transactions Tracked
    500+  → Active Users
    99.9% → Uptime
    0     → Hidden Fees
```

### Features Grid
```
Background: white
Padding: 88px 24px

Header:
  "Everything you need to master your money"
  Plus Jakarta Sans 700, 2rem, #111827, text-center
  Underline decoration: 3px gradient underline (indigo → violet), centered, 60px wide

  Subtitle: DM Sans 400, 1rem, #6B7280, max-width 500px, centered, margin-top: 12px

6 Feature Cards (grid: 3 cols on lg, 2 cols on md, 1 col on sm):
  Each card uses hover-lift card system
  Entry animation: staggered fadeInUp, delay 0.05s per card

  Card content:
    Icon wrapper: 52px × 52px, border-radius: 14px
                  background: var(--color-primary-bg) (indigo-50)
                  emoji icon: 24px centered
    Title: Plus Jakarta Sans 600, 1rem, #111827, margin-top: 16px
    Desc: DM Sans 400, 0.875rem, #6B7280, line-height: 1.65, margin-top: 6px

  6 Features (keep original text):
    💸 Track Every Transaction
    📊 Visual Analytics
    🎯 Smart Budgets
    🔁 Recurring Transactions
    🔔 Instant Notifications
    📁 Export Reports
```

### How It Works
```
Background: linear-gradient(145deg, #F0F4FF 0%, #F5F0FF 100%)
Padding: 88px 24px
Dot-matrix background (opacity 0.4)

Header: "Get started in 3 simple steps" — same style as features section

3-column grid:
  Connector lines between steps (horizontal dashed line in desktop view):
    border-top: 2px dashed rgba(79,70,229,0.25)
    position: absolute, top of circle center

  Each step card:
    Step number circle:
      Width/height: 60px
      Background: linear-gradient(135deg, #4F46E5, #7C3AED)
      Border-radius: 50%
      Box-shadow: 0 6px 20px rgba(79,70,229,0.35)
      White text: Plus Jakarta Sans 700, 1.25rem
      Animation: pulse-glow on mount

    Title: Plus Jakarta Sans 600, 1rem, #111827, margin-top: 16px
    Desc: DM Sans 400, 0.875rem, #6B7280, line-height: 1.6, margin-top: 6px

  Step 01: Create your account — "Sign up for free in under a minute. No credit card required."
  Step 02: Add your transactions — "Log expenses and income manually or set up recurring entries."
  Step 03: Gain financial clarity — "View analytics, track budgets, and make smarter money decisions."
```

### Final CTA Section
```
Background: linear-gradient(135deg, #4F46E5 0%, #6D28D9 60%, #3B82F6 100%)
Padding: 88px 24px
Overflow: hidden
Position: relative

Background decoration:
  Multiple overlapping semi-transparent circles (same as stats bar)

Content (max-width: 600px, centered):
  H2: "Ready to take control of your finances?"
      Plus Jakarta Sans 800, 2.25rem, white

  Subtitle: "Join hundreds of users who trust Spend Matrix..."
            DM Sans 400, 1rem, rgba(255,255,255,0.75), margin: 16px 0 32px

  Buttons (row, gap: 12px, centered):
    "Create Account": white background, indigo text, DM Sans 600, hover: bg indigo-50
    "Sign In": transparent, white border, white text, hover: bg white/10
```

### Footer
```
Background: #0F172A (slate-900)
Padding: 40px 24px
Text-center

Logo row: 💰 "Spend Matrix" — white, Plus Jakarta Sans 700
Links row: DM Sans 400, 13px, #64748B — Privacy Policy · Terms · Contact
Copyright: "© 2026 Spend Matrix. All rights reserved." — #475569, 13px, margin-top: 8px
```

---

## 📄 PAGE 2 — LOGIN (/Login.jsx)

```
Full page: min-height 100vh
Background: same gradient + blobs as Hero section (identical animated background)
Display: flex, align-items: center, justify-content: center

CARD:
  Width: 440px (max-width: 100% on mobile)
  background: rgba(255,255,255,0.92)
  backdrop-filter: blur(20px)
  border: 1.5px solid rgba(255,255,255,0.7)
  border-radius: 24px
  padding: 40px 36px
  box-shadow: 0 20px 80px rgba(79,70,229,0.15), 0 4px 24px rgba(0,0,0,0.05)
  animation: fadeInUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both

TOP OF CARD:
  Center logo: 💰 icon (40px) + "Spend Matrix" gradient text
  Small separator: 1.5px horizontal line, gradient (indigo → violet → transparent)

HEADING AREA:
  H1: "Welcome back" — Plus Jakarta Sans 700, 1.625rem, #111827
  Subtitle: "Sign in to your Spend Matrix account" — DM Sans 400, 0.875rem, #6B7280
  Margin-bottom: 28px

SERVER ERROR MESSAGE (when shown):
  background: rgba(239,68,68,0.07)
  border: 1.5px solid rgba(239,68,68,0.25)
  border-radius: 10px
  padding: 12px 14px
  color: #DC2626
  DM Sans 500, 0.875rem
  Left accent: 3px solid #EF4444 (left-border)
  Icon: ⚠️ before text

FORM:
  flex column, gap: 18px

  Email Input (per input system above)
  Password Input (per input system above)

  "Forgot password?" link:
    Align-right, DM Sans 500, 0.8rem, #4F46E5, text-decoration: none
    Hover: underline

  Submit Button: Full-width primary gradient button, height: 48px
                 Text: "Sign In" — DM Sans 600, 1rem
                 Loading state: spinner + "Signing in..." text, disabled

DIVIDER:
  "or" text with horizontal lines (flex row, gap: 12px):
    hr: flex-1, border-color: #E5E7EB
    span: DM Sans 400, 0.875rem, #9CA3AF

FOOTER LINK:
  "Don't have an account?" DM Sans 400, 0.875rem, #6B7280
  "Register" — DM Sans 600, #4F46E5, hover: underline
```

---

## 📄 PAGE 3 — REGISTER (/Register.jsx)

```
IDENTICAL background and card structure to Login page.

Different content:

Logo + branding at top (same as login)

HEADING:
  H1: "Create account" — Plus Jakarta Sans 700, 1.625rem
  Subtitle: "Start tracking your expenses today" — DM Sans 400, 0.875rem, #6B7280

SUCCESS MESSAGE (when registration succeeds):
  background: rgba(16,185,129,0.07)
  border: 1.5px solid rgba(16,185,129,0.25)
  color: #065F46
  border-radius: 10px
  padding: 12px 14px
  DM Sans 500, 0.875rem
  Left accent: 3px solid #10B981
  Icon: ✅ before text
  "Registration successful. Please verify your email."

SERVER ERROR: same error styling as Login

FORM FIELDS (3 fields):
  1. Full Name — text input, placeholder "John Doe"
  2. Email — email input, placeholder "you@example.com"
  3. Password — password input, placeholder "Min. 6 characters"
               Password strength indicator bar below input:
               - 4-segment bar (25% each)
               - Weak: 1 segment red
               - Fair: 2 segments orange
               - Good: 3 segments yellow
               - Strong: 4 segments green
               - Label text: "Weak / Fair / Good / Strong"

SUBMIT BUTTON: Full-width, "Register"

FOOTER LINK: "Already have an account?" → "Sign in"

Note: After success, auto-redirect timer shows: "Redirecting to login in 3s..." countdown
```

---

## 📄 PAGE 4 — FORGOT PASSWORD (/ForgotPassword.jsx)

```
Same animated background as Login.

Card: 400px wide, same glass styling

HEADING:
  H1: "Forgot Password" — Plus Jakarta Sans 700, 1.625rem
  Subtitle: "Enter your email and we'll send you a reset link." — DM Sans 400, #6B7280

EMAIL INPUT + BUTTON (same styling)

SUCCESS STATE (replaces form):
  Large checkmark icon (60px, green)
  Text: "Check your inbox!"
  Subtitle: "A reset link has been sent to your email address."
  Back to login link

FOOTER LINK: "Remember your password?" → "Sign in"
```

---

## 📄 PAGE 5 — RESET PASSWORD (/ResetPassword.jsx)

```
Same background as Login.

Card: 400px wide

HEADING:
  H1: "Reset Password"
  Subtitle: "Choose a new password for your account."

2 fields: New Password + Confirm Password (both with eye toggle icon)
Password strength bar (same as Register)

If passwords don't match: inline error under confirm field, red

SUBMIT BUTTON: "Update Password"

On success: show success banner, redirect to login after 3s
```

---

## 📄 PAGE 6 — VERIFY EMAIL (/VerifyEmail.jsx)

```
Same animated background as Login.
Card: centered, 400px

Two states:
  LOADING state:
    Spinner (large, 48px)
    "Verifying your email..." DM Sans 500, #6B7280

  SUCCESS state:
    Large animated checkmark (60px circle, green, scale-in animation)
    H2: "Email Verified!" gradient-text
    Subtitle: "Your account is ready. You can now sign in."
    Button: "Go to Login" — primary gradient button

  ERROR state:
    Large ⚠️ icon (60px, amber)
    H2: "Verification Failed"
    Subtitle: error message
    Button: "Back to Login"
```

---

## 📄 PAGE 7 — DASHBOARD (/Dashboard.jsx)

Layout: MainLayout wrapper

```
PAGE HEADER ROW:
  "Welcome, {FirstName} 👋" — Plus Jakarta Sans 700, 1.5rem, #111827
  Date subtitle: "Tuesday, April 14, 2026" — DM Sans 400, 0.875rem, #9CA3AF
  (use gradient-text on the user's name)

LOADING STATE:
  3 skeleton cards in a row (shimmer animation)
  Skeleton list below

3 SUMMARY CARDS (grid, 3 cols):
  Each SummaryCard is a glass card (hover-lift):

  1. Total Balance:
     Icon: 💰 in 44px indigo circle (gradient bg)
     Label: "Total Balance" — DM Sans 500, 0.8125rem, #6B7280
     Value: "₹1,410" — JetBrains Mono 700, 1.75rem, #111827
     Sub-label: "Current Month Net"
     Left accent bar: 4px indigo gradient

  2. Total Income:
     Icon: 📥 in 44px green circle
     Label: "Total Income" — green
     Value: "₹4,250" — JetBrains Mono 700, green (#059669)
     Sub-label: "Money received"
     Left accent bar: 4px green

  3. Total Expense:
     Icon: 📤 in 44px red circle
     Label: "Total Expense" — red
     Value: "₹2,840" — JetBrains Mono 700, red (#DC2626)
     Sub-label: "Money spent"
     Left accent bar: 4px red

  Card animation: staggered fadeInUp (delay 0, 0.08s, 0.16s)
  Numbers animate with countUp effect on mount

RECENT TRANSACTIONS section:
  Card with:
    Header row: "Recent Transactions" (Plus Jakarta Sans 600, 1rem) + "View All →" link (indigo)
  
  Each transaction row:
    flex row, align-center, border-bottom (last: no border), padding: 14px 0
    - Left: Category icon circle (36px, colored by category)
    - Center: Description (DM Sans 500, 0.9375rem) + Date (DM Sans 400, 0.8rem, muted)
    - Right: Amount (JetBrains Mono 600, 0.9375rem) — green for income, red for expense
    
    Hover: bg rgba(79,70,229,0.03), transition 0.15s
    Animation: stagger fadeInUp
    
  Empty state:
    Centered illustration: 📊 large emoji
    "No recent transactions" — DM Sans 500, #9CA3AF
    "Start by adding your first transaction!" — smaller text
    CTA button: "Add Transaction" → /transactions
```

---

## 📄 PAGE 8 — TRANSACTIONS (/Transactions.jsx)

Layout: MainLayout

```
PAGE HEADER:
  Left: "Transactions" — Plus Jakarta Sans 700, 1.5rem gradient-text
  Right: "+ Add Transaction" primary button (opens modal)

FILTER/SEARCH BAR (card):
  Glass card, padding: 16px 20px
  Flex row, flex-wrap, gap: 12px
  
  1. SearchBar: Icon (🔍) inside input, placeholder "Search transactions..."
  2. Type dropdown: "All / Income / Expense" — custom styled select
  3. Category dropdown: searchable dropdown
  4. Date range: From + To date inputs
  5. Payment source: "All / Online / Cash / Credit Card"
  6. Sort: "Newest / Oldest / Amount ↑ / Amount ↓"
  7. Export buttons: "CSV" and "PDF" — small outlined buttons

TRANSACTIONS TABLE:
  Glass card, border-radius: 16px, overflow hidden
  
  Table header:
    Background: rgba(79,70,229,0.04)
    Padding: 10px 20px
    Font: DM Sans 600, 0.8125rem, #6B7280, UPPERCASE, letter-spacing: 0.06em
    Columns: Date | Type | Category | Description | Payment Source | Amount | Actions

  Table rows:
    Padding: 14px 20px
    Border-bottom: 1px solid #F3F4F6
    Hover: bg rgba(79,70,229,0.03)
    Animation: stagger fadeInUp for initial load

    - Date: DM Sans 400, 0.875rem, #6B7280
    - Type badge: "Income" (green badge) / "Expense" (red badge) — per badge system
    - Category: category emoji/icon + name
    - Description: DM Sans 400, 0.9375rem, #111827, truncate at 200px
    - Payment source: small badge (Online/Cash/Credit Card)
    - Amount: JetBrains Mono 600, 0.9375rem — green or red
    - Actions: Edit icon + Delete icon (icon buttons, 32px each)
               Show on row hover only (opacity 0 → 1, transition)

  Pagination:
    Flex row, gap: 8px, centered, margin-top: 20px
    Page buttons: 36px circles, border-radius: 8px
    Active: bg indigo, white text
    Inactive: bg white, border gray, hover: bg indigo-50

  Empty state: same pattern as Dashboard

ADD/EDIT TRANSACTION MODAL:
  Overlay: rgba(0,0,0,0.5) backdrop with blur(4px)
  Modal container:
    background: white
    border-radius: 20px
    width: 480px, max-height: 90vh, overflow-y: auto
    box-shadow: 0 24px 80px rgba(0,0,0,0.2)
    animation: slideInRight 0.3s cubic-bezier(0.22, 1, 0.36, 1)

  Modal header:
    "Add Transaction" / "Edit Transaction" — Plus Jakarta Sans 600, 1.125rem
    Close button (✕) — top-right, icon button

  Form fields (flex col, gap: 16px):
    - Type toggle: 2 pill buttons "Expense / Income"
                   Active: gradient background, white text
                   Inactive: border, muted text
    - Category: searchable dropdown
    - Amount: number input with ₹ prefix label
    - Date: date picker
    - Description: textarea (3 rows)
    - Payment Source: 3-option toggle (Online / Cash / Credit Card)
    
  Footer:
    Cancel (secondary) + Save/Update (primary gradient) buttons
    Loading state on submit button
```

---

## 📄 PAGE 9 — CATEGORIES (/Categories.jsx)

Layout: MainLayout

```
PAGE HEADER:
  Left: "Categories" — gradient-text heading
  Right: "+ New Category" — primary button

TABS:
  2 pill tabs: "Expense Categories" | "Income Categories"
  Active: gradient bg, white text, shadow
  Inactive: bg white, border, muted text

CATEGORIES GRID (2 columns, or 3 on wide screens):
  Each category card (hover-lift glass card):
    Left: Color-dot or emoji icon (40px circle, colored bg per category)
    Center: Category name (DM Sans 600, 0.9375rem) + "X transactions" (DM Sans 400, 0.8rem, muted)
    Right: Edit + Delete icon buttons (show on hover)
    
    Bottom: Mini progress bar showing transaction usage (relative to total)

  Default (system) categories:
    Marked with "System" badge (gray badge, "Default" text)
    Delete button disabled/hidden for system categories

  Custom categories:
    Full Edit + Delete enabled

  Animation: stagger fadeInUp on load

ADD/EDIT CATEGORY MODAL:
  Smaller modal (380px)
  Fields:
    - Name: text input
    - Type: Expense/Income radio pills
    - Color/Icon picker (optional): row of 8 color circles to choose accent color
  Buttons: Cancel + Save
```

---

## 📄 PAGE 10 — BUDGETS (/Budgets.jsx)

Layout: MainLayout

```
PAGE HEADER:
  Left: "Budgets" — gradient-text
  Right: "+ Set Budget" — primary button

MONTH/YEAR FILTER BAR (glass card):
  Month selector: styled dropdown
  Year selector: styled dropdown
  "Apply" button

BUDGET CARDS GRID (2 columns, or 3 on wide):
  Each budget card (glass card, hover-lift):
    HEADER ROW:
      Category emoji + name (DM Sans 600, 1rem)
      Month label (DM Sans 400, 0.8rem, muted): "April 2026"
    
    AMOUNTS ROW:
      Spent: "₹1,200" (JetBrains Mono 700, 1.25rem, colored by % used)
      "/": muted
      Budget: "₹2,000" (JetBrains Mono 400, 1.125rem, #6B7280)
    
    PROGRESS BAR:
      Height: 10px
      Background: #F3F4F6
      Border-radius: 999px
      Fill: gradient colored by percentage:
        0-60%:   green gradient
        60-80%:  amber gradient
        80-100%: orange gradient
        100%+:   red gradient (overflows, shows "OVER BUDGET" badge)
      Width: animated from 0 to actual% on mount (CSS transition 0.8s ease)
    
    FOOTER ROW:
      Percentage text: "60% used" — colored same as bar
      Edit + Delete icon buttons (right)
    
    Over-budget state:
      Card has: border-color: rgba(239,68,68,0.4), top accent bar: 4px red

  Empty state: "No budgets set" + illustration + CTA button

SET/EDIT BUDGET MODAL:
  Fields:
    - Category (dropdown, expense only) — disabled if editing
    - Amount (₹ input)
    - Month (select)
    - Year (select)
  On save: animated success state (checkmark flash)
```

---

## 📄 PAGE 11 — ANALYTICS (/Analytics.jsx)

Layout: MainLayout

```
PAGE HEADER:
  "Analytics" — gradient-text

FILTER BAR (glass card):
  Month + Year dropdowns + Payment Source filter
  "Apply Filters" primary button

ERROR STATE:
  Red alert banner

LOADING STATE:
  Centered spinner + "Loading analytics..." text

SUMMARY CARDS ROW (3 columns):
  Same SummaryCard design as Dashboard:
  - Total Income (green)
  - Total Expense (red)
  - Savings (indigo, can be negative = red)
  
  All values: JetBrains Mono 700, count-up animation

CHARTS SECTION:

  ROW 1 (2 columns, equal width):
    
    1. CATEGORY BREAKDOWN PIE CHART (CategoryChart.jsx):
       Card: glass, border-radius: 16px, padding: 20px
       Title: "Spending by Category" — Plus Jakarta Sans 600, 1rem
       Chart: Recharts PieChart, 260px height
       Colors: custom vibrant palette [#4F46E5, #10B981, #F59E0B, #EF4444, #8B5CF6, #3B82F6, #EC4899]
       Legend: below chart, horizontal flex-wrap, dot + label
       Empty: "No expense data for this period" centered

    2. PAYMENT SOURCE DONUT CHART (PaymentSourceChart.jsx):
       Card: same styling
       Title: "Payment Methods"
       Chart: Donut chart (innerRadius: 60), same color scheme
       Center label: "Transactions" count
       Legend: right side or below
       Sources: Online / Cash / Credit Card with percentages

  ROW 2 (full width):
    DAILY EXPENSE LINE CHART (DailyExpenseChart.jsx):
      Card: glass, padding: 20px
      Title: "Daily Expense Trend"
      Chart: Recharts LineChart, 220px height
      Line: color #4F46E5, strokeWidth: 2.5, dot: 5px filled
      Area fill: gradient from rgba(79,70,229,0.15) to transparent
      Grid: light gray dashes
      Tooltip: glass card style with backdrop blur
      X-axis: "Day 1...Day 31", Y-axis: ₹ amounts (JetBrains Mono)
      Curve: type="monotone"

  ROW 3 (full width):
    BUDGET VS ACTUAL BAR CHART (BudgetComparisonChart.jsx):
      Card: glass, padding: 20px
      Title: "Budget vs. Actual Spending"
      Subtitle: "Compare what you planned vs what you spent"
      Chart: Recharts BarChart, 280px height, grouped bars
      Budget bar: color #4F46E5 (solid)
      Actual bar: color #EF4444 (when over) / #10B981 (when under)
      Legend: Budget (indigo) | Actual (green/red)
      Tooltip: shows both values + difference
      Labels on bars (rotated if needed)
```

---

## 📄 PAGE 12 — RECURRING TRANSACTIONS (/Recurring.jsx)

Layout: MainLayout

```
PAGE HEADER:
  Left: "Recurring Transactions" — gradient-text
  Right: "+ Add Recurring" — primary button

LOADING / ERROR STATES:
  Spinner or error alert

RECURRING RULES TABLE:
  Glass card, overflow hidden

  Table header:
    Columns: Name | Category | Frequency | Amount | Next Date | Status | Actions

  Table rows:
    - Name + Description (DM Sans 500 + muted sub)
    - Category badge (colored)
    - Frequency: "Monthly / Weekly / Daily / Yearly" badge
    - Amount: JetBrains Mono 600, colored by type
    - Next Date: DM Sans 400
    - Status toggle: pill switch (active = green, paused = gray)
      Toggle animation: slide + color transition
    - Actions: Edit + Delete icon buttons

  Empty state: 🔁 icon, "No recurring rules yet", CTA button

ADD/EDIT RECURRING MODAL:
  Larger modal (500px) — similar to Transaction modal
  Fields:
    - Name (text input)
    - Type (Expense/Income toggle)
    - Category (dropdown)
    - Amount (₹ input)
    - Frequency (Monthly/Weekly/Daily/Yearly — radio pills)
    - Start Date (date input)
    - Payment Source
    - Description (textarea)
  Buttons: Cancel + Save

DELETE CONFIRM MODAL:
  Smaller modal (380px)
  Warning icon (⚠️) in red/amber circle
  "Delete Recurring Rule?" heading
  "This will stop all future automatic transactions for this rule."
  Cancel + Delete buttons
```

---

## 📄 PAGE 13 — NOTIFICATIONS (/Notifications.jsx)

Layout: MainLayout

```
PAGE HEADER:
  Left: "Notifications" — gradient-text
  Right: "Mark All as Read" button (secondary, shown only if unread exist)

LOADING STATE / ERROR STATE

NOTIFICATION LIST:
  Glass card, no table — stack of notification rows

  Each notification item:
    Padding: 16px 20px
    Border-bottom: 1px solid #F3F4F6
    Flex row, align-items: start, gap: 14px

    Unread: left border 3px solid #4F46E5, bg rgba(79,70,229,0.03)
    Read: bg white

    LEFT: Icon circle (40px):
      Budget alert: 🎯, amber bg
      Large transaction: 💸, indigo bg
      System: 🔔, gray bg

    CENTER:
      Title: DM Sans 600, 0.9375rem, #111827
      Message: DM Sans 400, 0.875rem, #6B7280, line-height: 1.5
      Timestamp: DM Sans 400, 0.75rem, #9CA3AF, margin-top: 4px

    RIGHT:
      Unread dot (8px, indigo, pulsing) — if unread
      Delete icon button (show on row hover)
      "Mark as read" link (show if unread, on hover)

  Hover: bg rgba(79,70,229,0.02), transition 0.15s

PAGINATION:
  Same pagination design as Transactions page

EMPTY STATE:
  🔔 large icon (64px, muted)
  "You're all caught up!" — Plus Jakarta Sans 600, 1.125rem
  "No notifications at the moment." — DM Sans 400, #9CA3AF
```

---

## 📄 PAGE 14 — SETTINGS (/Settings.jsx)

Layout: MainLayout

```
PAGE HEADER:
  "Settings" — gradient-text

CONTENT CARD (glass, single):
  TABS ROW:
    3 tab buttons: Profile | Password | Preferences
    Underline-style tabs:
      Active: border-bottom: 3px solid #4F46E5, color: #4F46E5, DM Sans 600
      Inactive: color: #6B7280, hover: #4F46E5
      Tab bar: border-bottom: 2px solid #E5E7EB

  TAB CONTENT AREA (animate with fadeInUp on tab switch):

  PROFILE TAB:
    User avatar: 80px circle (gradient bg, white initials, large)
    "Change photo" link below (placeholder)
    
    Fields:
      Full Name: text input
      Email: text input (readonly, grayed out — with lock icon)
      
    Save button: primary gradient

  PASSWORD TAB:
    Fields:
      Current Password
      New Password (with strength bar)
      Confirm New Password
    Save button

  PREFERENCES TAB:
    Toggle rows (each a flex row with label + ToggleSwitch):
      - Email Notifications (🔔)
      - Budget Alerts (🎯)
      - Large Transaction Alerts (💸)
      - Newsletter (📰)
    
    Currency selector (dropdown: ₹ INR / $ USD / € EUR)
    
    ToggleSwitch design:
      Width: 48px, height: 26px, border-radius: 999px
      Off: bg #D1D5DB
      On: bg linear-gradient(#4F46E5, #7C3AED)
      Thumb: white circle, 20px, transition: translateX 0.2s cubic-bezier(0.34,1.56,0.64,1)
    
    Save Preferences button

  SUCCESS/ERROR flash messages appear below buttons:
    Same alert styling as form pages but smaller
```

---

## 📄 PAGE 15 — ADMIN PANEL (/Admin.jsx)

Layout: Custom — AdminSidebar + header (no MainLayout)

```
HEADER: Same structure as MainLayout header but with:
  "🛡️ Admin Panel" text in violet instead of indigo
  Background: slightly darker (rgba(245,243,255,0.95)) — pale violet tint
  Extra breadcrumb: "SpendMatrix > Admin"

ADMIN SIDEBAR (AdminSidebar.jsx):
  Same width/structure as main sidebar
  Color scheme: VIOLET instead of indigo
  Tabs:
    📊 Overview    (StatsCard grid)
    👥 Users       (UserTable)
    💳 Transactions (TransactionTable)
    🔁 Recurring   (AdminRecurringTable)
    📋 Audit Logs  (AuditLogs component)

  Active: bg rgba(139,92,246,0.12), color #7C3AED, border-left violet
  Hover: bg rgba(139,92,246,0.06)

OVERVIEW TAB:
  4 StatsCard grid (2×2 or 4 cols):
    Total Users: 👥 violet
    Total Transactions: 💳 indigo
    Total Income: 📥 green
    Total Expense: 📤 red
  
  StatsCard design:
    Glass card, hover-lift
    Large icon circle (violet gradient for admin cards)
    Value: JetBrains Mono 700, 1.625rem
    Label: DM Sans 500, 0.8125rem, muted
    Sub: change % vs last month (green/red arrow + %)

USERS TAB (UserTable.jsx):
  Filter: search by name/email + status filter (All/Active/Blocked)
  
  Table:
    Columns: User | Email | Role | Status | Joined | Actions
    
    Role badge: "Admin" violet, "User" indigo
    Status badge: "Active" green, "Blocked" red
    
    Actions:
      Block/Unblock button (toggle)
      Delete button (with confirm modal)

TRANSACTIONS TAB (TransactionTable.jsx):
  Global view of ALL users' transactions
  Same table design as user Transactions page
  Extra column: "User" (shows user name)

RECURRING TAB (AdminRecurringTable.jsx):
  All recurring rules across all users
  Extra "User" column

AUDIT LOGS TAB:
  Filter: Action type + User ID inputs
  
  Table:
    Columns: Timestamp | User | Action | Details
    
    Action badges:
      USER_BLOCKED: amber badge
      USER_UNBLOCKED: green badge
      USER_DELETED: red badge
    
  Paginated (15 per page)

All tables follow same design as user Transactions table.
```

---

## 🔔 SHARED COMPONENT SPECS

### NotificationBell (NotificationBell.jsx)
```
Bell icon: 22px, Heroicons outline, color #6B7280
Hover: color #4F46E5, bg rgba(79,70,229,0.08) circle 36px

Badge (when unread > 0):
  Position: absolute, top: -4px, right: -4px
  Width: 18px, height: 18px
  Background: #EF4444
  Border-radius: 50%
  Border: 2px solid white
  Text: DM Sans 700, 10px, white
  Animation: pulse-glow

Dropdown (on click):
  Position: absolute, right: 0, top: 44px
  Width: 340px
  Glass card, border-radius: 14px
  Box-shadow: 0 20px 60px rgba(0,0,0,0.15)
  animation: slideInRight 0.2s ease

  Header: "Notifications" + "Mark all read" link
  List: up to 5 most recent, same row design as Notifications page
  Footer: "View All →" link → /notifications
```

### SummaryCard (SummaryCard.jsx)
```
As described in Dashboard page.
Props: title, amount, type (balance/income/expense)
Type determines: icon, color scheme, left accent bar color
Amount: JetBrains Mono, count-up animation on mount
```

### StatsCard (StatsCard.jsx — Admin)
```
Similar to SummaryCard but for admin use
Violet color scheme
Shows percentage change vs last period
```

### Modal (Modal.jsx)
```
Backdrop: rgba(0,0,0,0.5) with blur(4px)
Container: as described per page
Escape key closes
Click outside closes
Focus trap inside modal
Animation: fadeInUp 0.25s ease
```

### ToggleSwitch (ToggleSwitch.jsx)
```
As described in Settings > Preferences tab
Smooth cubic-bezier spring animation on thumb
```

### FilterBar (FilterBar.jsx)
```
Glass card, flex-wrap row
All inputs use the global input system
Dropdowns: custom styled (not browser default)
Each filter field: label above + input below
Reset button: small link "Clear Filters ✕"
```

### ExportButtons (ExportButtons.jsx)
```
Two small outlined buttons: "📥 CSV" + "📄 PDF"
Border: 1.5px solid #E5E7EB
Color: #374151
Hover: border indigo, color indigo
Loading state: spinner while generating
```

### CategoryDropdown (CategoryDropdown.jsx)
```
Searchable dropdown with category list
Search input inside dropdown
Categories grouped by type (if needed)
Each option: emoji/color dot + category name
Custom styled, not browser select
```

---

## 💡 SUGGESTED IMPROVEMENTS

1. **Add page transitions**: Use Framer Motion's `AnimatePresence` + `motion.div` for route-level transitions (slide left/right between pages).

2. **Dark Mode**: Add a theme toggle (🌙/☀️) in the header. Use CSS variables to switch between light and dark themes. Dark mode: `--color-bg: #0F172A`, `--color-surface: #1E293B`.

3. **Mobile Responsive Sidebar**: On screens < 768px, sidebar should collapse to a hamburger menu (slide-in drawer from left, overlay backdrop).

4. **Skeleton Loading**: Replace "Loading..." text with proper skeleton screens (shimmering gray bars matching the layout of real content).

5. **Toast Notifications**: Instead of inline error/success messages inside forms, use toast notifications (bottom-right, slide in, auto-dismiss after 4s):
   - Success: green left border
   - Error: red left border
   - Info: indigo left border
   Stack multiple toasts vertically.

6. **Keyboard Navigation & A11y**: All modals trap focus. All interactive elements are keyboard-accessible. ARIA labels on icons.

7. **Confetti on first transaction**: When a user logs their very first transaction, fire a small confetti burst (canvas-confetti library) as a delightful moment.

8. **Budget progress bar animation**: Animate the progress bars when navigating to the Budgets page (slide in from left, 0.8s ease).

9. **Currency formatting**: All ₹ values formatted with Indian numbering system (1,00,000 format), using `Intl.NumberFormat('en-IN')`.

10. **Empty State Illustrations**: Use inline SVG illustrations (minimalist, indigo line art style) for all empty states instead of just emoji. Categories, Budgets, Transactions, Recurring all need unique illustrations.

---

## 📦 DEPENDENCIES TO ADD

```json
{
  "framer-motion": "^11.x",      // Page transitions & advanced animations
  "canvas-confetti": "^1.9.x",   // First-transaction celebration
  "react-hot-toast": "^2.4.x",   // Toast notification system
  "lucide-react": "^0.383.x"     // Beautiful consistent icon set (replace emoji icons in nav)
}
```

Google Fonts import (add to index.html `<head>`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
```

Tailwind config (`tailwind.config.js`) — add custom font:
```js
theme: {
  extend: {
    fontFamily: {
      display: ['"Plus Jakarta Sans"', 'sans-serif'],
      body:    ['"DM Sans"', 'sans-serif'],
      mono:    ['"JetBrains Mono"', 'monospace'],
    }
  }
}
```

---

*End of Spend Matrix UI/UX Prompt — All 15 pages fully specified.*
