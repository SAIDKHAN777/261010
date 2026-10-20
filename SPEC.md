# Specification: Apple-Style Scroll-Driven Interactive Image Sequence Portfolio

**Project:** Said Khan Portfolio — AI Solutions Architect & Full-Stack Engineer  
**Architecture:** Next.js 15 (App Router) + React 19 + Tailwind CSS + HTML5 Canvas Scrubbing  
**Protocol:** Specification-Driven Development (Spec-Kit)  

---

## Phase 1: Clarification & Scope Specification

### 1. Scope Definition
- **Objective:** Deliver a high-performance, cinematic, Apple-style scroll-scrubbed interactive canvas experience synced with user scroll across 50 photographic portrait frames of Said Khan.
- **Narrative Overlay:** 100% transparent floating layout featuring an editorial story and capabilities showcase without opaque cards, white boxes, or content obscuring the central model portrait.
- **Interaction Model:** Linear interpolation (Lerp) smoothing mousewheel/touch scroll deltas directly on HTML5 Canvas in `requestAnimationFrame` with high-DPI retina display support.
- **Micro-Interactions:** Monochromatic kinetic typography with per-character hover pop physics preserving pure white luminance.

### 2. Acceptance Criteria
1. **Canvas Engine & 50-Frame Scrubbing:**
   - Preload exactly 50 frames from `/PPFA/ezgif-frame-001.jpg` to `/PPFA/ezgif-frame-050.jpg`.
   - In-memory `HTMLImageElement` pre-decoding cache with zero canvas flash or flicker.
   - Smooth bidirectional scrubbing via `currentFrame += (targetFrame - currentFrame) * 0.1` inside a locked `requestAnimationFrame` loop.
   - Canvas stays centered with contain-fit aspect ratio math (`Math.min(canvas.width / img.width, canvas.height / img.height)`), ensuring the face/head is never clipped on any screen width or orientation.
   - Persistent frame buffer: Canvas never clears to black/white; the most recent valid frame remains drawn during state transitions.
2. **Scroll Timeline Content Phasing:**
   - Outer track height set to `min-h-[450vh]`.
   - Scroll 0% – 25% (Frames 1–12): Hero Introduction (Badge, Name, Bio, Micro-actions).
   - Scroll 26% – 35%: Crossfade transition window.
   - Scroll 36% – 65% (Frames 18–32): Editorial Article & 3 Core Capabilities.
   - Scroll 66% – 75%: Crossfade transition window.
   - Scroll 76% – 100% (Frames 38–50): Final CTA & Project Initiation.
3. **Typography & Visual Design:**
   - 100% transparent floating layout: No solid white cards, no opaque backings over portrait.
   - High-contrast pure white typography with crisp drop-shadow (`drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]`).
   - Kinetic hover: Text split into words (`inline-block whitespace-nowrap`), then characters (`<span>`) that elevate and scale (`scale-125 -translate-y-1`) on hover without color shifts.
   - Fixed Topbar / Navbar with Said Khan branding, mono links, and rose-crimson Consultation button (`#e11d48`).
4. **Engineering Standards & Performance:**
   - Strict `'use client';` Next.js 15 boundary with `isMounted` SSR hydration guard.
   - Zero memory leaks: `cancelAnimationFrame`, `window.removeEventListener('scroll')`, and `window.removeEventListener('resize')` cleaned up on unmount.
   - Zero GC thrashing in rAF loop (pre-allocated transformation variables).
   - High-DPI scaling: `canvas.width = window.innerWidth * window.devicePixelRatio`, `canvas.height = window.innerHeight * window.devicePixelRatio`.

---

## Phase 2: Architectural Contracts & Data Schemas

### 1. Canvas & Animation State Contracts
```typescript
export interface CanvasDimensions {
  width: number;
  height: number;
  dpr: number;
}

export interface ContainDrawParams {
  sourceWidth: number;
  sourceHeight: number;
  destX: number;
  destY: number;
  destWidth: number;
  destHeight: number;
}

export interface ScrollPhasingConfig {
  hero: { start: number; end: number; fadeOutStart: number; fadeOutEnd: number };
  editorial: { fadeInStart: number; fadeInEnd: number; start: number; end: number; fadeOutStart: number; fadeOutEnd: number };
  cta: { fadeInStart: number; fadeInEnd: number; start: number; end: number };
}
```

### 2. Component Hierarchy & Layout
```
app/
  layout.tsx          -> Root layout with dark background (#09090b), Inter & JetBrains Mono font classes
  page.tsx            -> Main Client Component containing:
    ├── CanvasEngine (Fixed viewport background, z-0)
    │     ├── HTML5 Canvas (high-DPI, contain-fit math)
    │     └── Preloader Progress Bar (visible during initial frame caching)
    ├── Topbar / Navbar (Fixed top-0, z-50, glassmorphism border-b)
    └── ScrollTrack (min-h-[450vh], relative)
          ├── Sticky / Floating Viewport Overlay (fixed inset-0, pointer-events-none, z-10)
          │     ├── HeroSection (Scroll 0% - 25%, pointer-events-auto when visible)
          │     ├── EditorialStorySection (Scroll 36% - 65%, pointer-events-auto when visible)
          │     └── FinalCtaSection (Scroll 76% - 100%, pointer-events-auto when visible)
          └── ScrollProgressHUD (Bottom-right frame counter & scrub progress pill)
```

---

## Phase 3: Atomic Task Breakdown (The Plan)

- [x] **Task 1: Project Setup & Package Configuration**
  - Install dependencies: `next`, `react`, `react-dom`, `typescript`, `@types/react`, `@types/react-dom`, `@types/node`, `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`.
  - Configure `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, and `next.config.ts`.
  - Verify asset placement in `public/PPFA/ezgif-frame-001.jpg` ... `050.jpg`.
  
- [ ] **Task 2: Global Styles & Typography Configuration**
  - Setup `app/globals.css` with dark theme styling, utility classes, and custom keyframes.
  - Setup `app/layout.tsx` with metadata, font definitions, and viewport settings.

- [ ] **Task 3: Implement Kinetic Typography Helper Components**
  - Implement `KineticWord` and `KineticText` components with character-by-character splitting.
  - Apply `inline-block whitespace-nowrap` on words and `inline-block transition-transform duration-150 hover:scale-125 hover:-translate-y-1` on characters with pure white text and crisp drop-shadow.

- [ ] **Task 4: Build High-DPI 60FPS Canvas Scrubbing Engine**
  - Image cache with `TOTAL_FRAMES = 50`.
  - Responsive contain-fit draw calculation.
  - Lerp math (`currentFrame += (targetFrame - currentFrame) * 0.1`) in `requestAnimationFrame`.
  - Proper unmount cleanup (canceling rAF, removing scroll and resize listeners).

- [ ] **Task 5: Implement Editorial Narrative Overlay & Section Phasing**
  - Topbar Navbar with Said Khan branding, navigation links, and consultation CTA.
  - Hero Section (0%–25%): Badge, headline, narrative bio, micro-actions.
  - Editorial Article / Story (36%–65%): Core capabilities, high-throughput systems, architectural philosophy.
  - Final CTA (76%–100%): "READY TO BUILD SOMETHING REAL?", end bound frame 50 lock.

- [ ] **Task 6: Verification, Build & Quality Audit**
  - Run Next.js production build (`npm run build`).
  - Verify zero hydration errors, zero SSR mismatches, zero memory leaks.
  - Conduct Google Code Review verification against the 9 Pillars.
