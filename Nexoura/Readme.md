# NEXORA — Animated AI Developer Platform (Marketing Website)

> A premium, animation-driven SaaS marketing website built to showcase advanced frontend, motion design, and UI/UX engineering skills for a resume/portfolio project.

**Tagline:** Build faster. Ship smarter. Automate everything.

---

## 📌 What This Project Is

NEXORA is a fictional AI developer platform. The product itself doesn't need to be real — the goal of this project is to demonstrate **frontend craftsmanship**: scroll-driven storytelling, interaction design, animation systems, 3D visuals, and performance-optimized architecture.

This README documents the plan **and gives you a ready-to-use, step-by-step prompt sequence** you can feed into an AI coding assistant (Claude, Cursor, etc.) to build the project section by section.

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | App architecture & build tooling |
| Tailwind CSS | Styling |
| Motion (Framer Motion) | UI/component animations |
| GSAP | Complex scroll animations |
| GSAP ScrollTrigger | Scroll-controlled animation triggers |
| Lenis | Smooth scrolling |
| Three.js + React Three Fiber | 3D visual experience |
| Lucide React | Icons |

---

## 🗂️ Folder Architecture

```
src/
├── components/
│   ├── navbar/
│   ├── buttons/
│   ├── cards/
│   ├── typography/
│   └── common/
├── sections/
│   ├── Hero/
│   ├── Trusted/
│   ├── Introduction/
│   ├── AIWorkspace/
│   ├── Github/
│   ├── Automation/
│   ├── Analytics/
│   ├── Demo/
│   ├── Testimonials/
│   ├── Pricing/
│   ├── FAQ/
│   └── CTA/
├── animations/
│   ├── fade.ts
│   ├── reveal.ts
│   ├── parallax.ts
│   └── scroll.ts
├── hooks/
├── utils/
├── assets/
├── App.jsx
└── main.jsx
```

---

## 🧱 Page Structure

```
Navbar
Hero
Trusted By
Product Introduction
AI Workspace
GitHub Intelligence
Smart Automation
Developer Analytics
Signature Horizontal Scroll Showcase
Interactive Demo
Testimonials
Pricing
FAQ
Final CTA
Footer
```

---

## 🎞️ Animation System (Design Rule)

Don't animate everything equally. Build a hierarchy:

```
Hero               → Subtle
Feature cards       → Medium
Main showcase       → Strong
Horizontal section  → Very strong
```

Categories to implement as reusable utilities:
- **Entrance:** fade, slide, scale, blur→sharp, staggered text
- **Hover:** magnetic buttons, card tilt, image zoom, border glow, cursor-follow
- **Scroll:** parallax, pinning, horizontal scroll, scale transitions, progress bars
- **Background:** gradient movement, noise, particles, glow blobs, grid movement

---

## 🚀 Step-by-Step Build Prompts

Copy these prompts **in order** into your AI coding assistant. Each one assumes the previous steps are already done.

### Phase 1 — Foundation

**Prompt 1 — Project setup**
```
Set up a new React + Vite project called "nexora". Configure Tailwind CSS.
Initialize a Git repository. Create the folder structure: components/,
sections/, animations/, hooks/, utils/, assets/ inside src/.
```

**Prompt 2 — Design system**
```
Create a design system for NEXORA: a dark, premium SaaS aesthetic.
Define a Tailwind config with a custom color palette (deep background,
accent gradient color, neutral text tones), a type scale using a modern
sans-serif display font for headings and a clean body font, consistent
spacing scale, and reusable Button and Card components with hover states.
```

**Prompt 3 — Navbar**
```
Build a responsive Navbar component for NEXORA with a logo, nav links,
a CTA button, and a mobile hamburger menu with a slide-in animation.
Add a subtle background blur/opacity change on scroll.
```

**Prompt 4-5 — Hero section**
```
Build the Hero section for NEXORA. Include: a large animated headline
("Build faster. Ship smarter. Automate everything.") with staggered
text reveal, an animated gradient background, floating UI elements,
a mouse-following glow/cursor effect, magnetic CTA buttons ("Get
Started" and "Explore"), an animated product preview mockup, and a
scroll indicator at the bottom. This section should establish the
site's animation quality in the first 5-10 seconds.
```

**Prompt 6-7 — Trusted By + Introduction**
```
Build a "Trusted By" section with a horizontally auto-scrolling logo
marquee. Then build a Product Introduction section titled "The Future
of Development" with scroll-triggered fade/slide-in text and supporting
visuals. Use GSAP ScrollTrigger for the scroll animations.
```

---

### Phase 2 — Product Storytelling

**Prompt 8-9 — AI Workspace section**
```
Build the "AI Workspace" feature section. On scroll, animate a code
editor mockup appearing, then simulate an AI suggestion typing itself
into the editor, followed by the code changing and a success indicator
appearing. Use GSAP ScrollTrigger to sequence these steps against
scroll position.
```

**Prompt 10 — GitHub Intelligence section**
```
Build the "GitHub Intelligence" feature section. Animate repository
cards appearing, followed by commit and pull request indicators, then
an activity graph, all visually connecting into one system as the
user scrolls.
```

**Prompt 11 — Smart Automation section**
```
Build the "Smart Automation" feature section with its own distinct
animation style (e.g., connected workflow nodes lighting up in
sequence as the user scrolls, representing automated pipeline steps).
```

**Prompt 12 — Developer Analytics section**
```
Build the "Developer Analytics" feature section featuring animated
charts/graphs (using Motion or GSAP) that draw themselves in as the
section enters the viewport.
```

**Prompt 13-14 — Signature horizontal scroll showcase**
```
Build the signature showcase section: pin the section in place while
its content scrolls horizontally through Feature 01 → 02 → 03 → 04 as
the user scrolls vertically. Use GSAP ScrollTrigger with pinning and a
horizontal timeline. Add a progress indicator showing position within
the section.
```

---

### Phase 3 — Premium Detailsśś

**Prompt 15 — 3D visual**
```
Add a 3D visual element to NEXORA using React Three Fiber — for example,
an abstract animated geometric object or particle field near the hero
or product showcase, with subtle mouse-based rotation/parallax.
```

**Prompt 16 — Interactive demo**
```
Build an "Interactive Demo" section where users can click through
tabs or steps to see a simulated product interaction (e.g., a fake
terminal or code-generation flow), with smooth transitions between
states.
```

**Prompt 17 — Testimonials**
```
Build a Testimonials section with an auto-playing or draggable
carousel of customer quotes, animated card transitions.
```

**Prompt 18 — Pricing**
```
Build a Pricing section with 2-3 pricing tiers, a monthly/yearly
toggle with animated price transitions, and a highlighted "recommended"
plan.
```

**Prompt 19 — FAQ**
```
Build an FAQ section using an animated accordion (expand/collapse
with smooth height transitions).
```

**Prompt 20 — Final CTA + Footer**
```
Build a Final CTA section with a bold headline and button, animated
gradient background. Then build a Footer with nav columns, social
links, and legal links.
```

**Prompt 21 — Animation polish pass**
```
Review all sections and apply the animation hierarchy rule: Hero =
subtle, feature cards = medium, main showcase = strong, horizontal
section = very strong. Smooth out timing, easing, and stagger values
across the site. Integrate Lenis for global smooth scrolling.
```

---

### Phase 4 — Production Quality

**Prompt 22 — Responsive design**
```
Make NEXORA fully responsive across mobile, tablet, and desktop.
Adapt animations for mobile (reduce/simplify where needed), and
ensure the horizontal scroll showcase degrades gracefully on touch
devices.
```

**Prompt 23 — Accessibility & performance**
```
Audit NEXORA for accessibility (semantic HTML, focus states, alt
text, reduced-motion support via prefers-reduced-motion) and
performance (image optimization, code splitting/lazy loading,
Lighthouse score improvements).
```

**Prompt 24 — SEO & metadata**
```
Add SEO meta tags, Open Graph tags, a favicon, and a custom 404 page
to NEXORA.
```

**Prompt 25 — Deploy**
```
Prepare NEXORA for production deployment (e.g., to Vercel or
Netlify): production build config, environment checks, and final
QA pass.
```

---

## 🗓️ Suggested Timeline (4 Weeks)

| Week | Focus |
|---|---|
| 1 | Foundation: setup, design system, navbar, hero, intro |
| 2 | Main experience: 4 feature sections + horizontal showcase |
| 3 | Premium details: 3D, demo, testimonials, pricing, FAQ, CTA |
| 4 | Production quality: responsive, accessibility, performance, SEO, deploy |

---

## 📄 Resume Entry (once complete)

**NEXORA — Animated AI Developer Platform**
> Designed and developed a premium SaaS marketing website using React, Vite, Tailwind CSS, GSAP, Motion, Lenis, and Three.js, featuring scroll-driven storytelling, interactive UI animations, 3D visualizations, responsive layouts, and performance-optimized frontend architecture.

---

## 🧩 Portfolio Context

| Project | Demonstrates |
|---|---|
| SMARTSPENDai | Full-stack + AI + FinTech |
| AuraOS | AI + productivity + system/product design |
| **NEXORA** | Advanced frontend + animation + UI/UX |

**Build order:** Design system → Hero → Navbar → Feature storytelling → Signature scroll animation → 3D → Remaining sections → Responsive → Performance → Deploy

> Goal: NEXORA should feel like a real $10M SaaS startup website — not a college animation project.
