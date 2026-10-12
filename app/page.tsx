'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  ArrowDown,
  Sparkles,
  Bot,
  Zap,
  Layers,
  CheckCircle2,
  Send,
  X,
  Code2,
  Workflow,
  Cpu,
  Mail,
  ChevronRight,
  TrendingUp,
  ExternalLink,
  Globe,
  Database,
  Boxes,
  Activity,
} from 'lucide-react';
import { DEFAULT_SHOWCASE_ITEMS, type ShowcaseItem } from '@/lib/showcaseData';
import { DEFAULT_PERFORMANCE_STATS, type PerformanceStatItem } from '@/lib/performanceStatsData';
import TrustBarCarousel from '@/components/TrustBarCarousel';
import TechnicalBriefForm from '@/components/TechnicalBriefForm';
import AboutContactSection from '@/components/AboutContactSection';

// ======================================================================
// CONSTANTS & ASSET CONFIGURATION
// ======================================================================
const TOTAL_FRAMES = 50;
const FRAME_PATH_PREFIX = '/PPFA/ezgif-frame-';
const FRAME_PATH_SUFFIX = '.jpg';

// Helper to generate padded frame paths: /PPFA/ezgif-frame-001.jpg -> 050.jpg
const getFrameUrl = (frameIndex: number): string => {
  const padded = String(frameIndex).padStart(3, '0');
  return `${FRAME_PATH_PREFIX}${padded}${FRAME_PATH_SUFFIX}`;
};

// ======================================================================
// AUTHENTIC TECHNOLOGY VECTOR LOGOS (From User Reference Image)
// ======================================================================
const TechIcons = {
  html5: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M1.5 0h21l-1.9 21.7L12 24l-8.6-2.3L1.5 0zm17 4.3H5.5l.4 4.5h12.2l-.4 4.7-5.7 1.6-5.7-1.6-.3-3.2H3.5l.6 5.8 7.9 2.2 7.9-2.2 1-11.8z" />
    </svg>
  ),
  css3: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M1.5 0h21l-1.9 21.7L12 24l-8.6-2.3L1.5 0zm16.5 4.3H6l.3 3.5h11.4l-.4 4.5-5.3 1.5-5.3-1.5-.2-2.3H3.9l.4 4.8 7.7 2.1 7.7-2.1 1-10.5z" />
    </svg>
  ),
  sass: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.8 13.5c-1.8.8-3.4 1-4.8.4-.7-.3-1.2-.8-1.5-1.4-.4-.8-.4-1.8.2-2.7.7-1.1 2-2 3.6-2.5 1.3-.4 2.5-.3 3.4.2.5.3.8.8.8 1.4 0 .9-.7 1.8-1.8 2.2-.9.4-2 .4-2.8 0-.4-.2-.6-.5-.5-.8 0-.3.4-.5.8-.4.5.1 1.1.1 1.6-.1.6-.2 1-.7 1-1.1 0-.2-.1-.4-.4-.5-.4-.2-1.2-.3-2 .1-1.2.4-2.2 1.1-2.6 1.8-.4.6-.3 1.3 0 1.8.3.4.7.7 1.2.9 1.1.4 2.5.2 4-.5.4-.2.8.1.9.5.1.4-.1.8-.5 1z" />
    </svg>
  ),
  javascript: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M0 0h24v24H0V0zm22 17.7c-.3-1.6-1.5-2.6-3.2-2.6-1.7 0-2.8.9-2.8 2.2 0 1.2.7 1.8 2.3 2.4l.7.3c1.9.7 2.7 1.4 2.7 2.8 0 2.2-1.8 3.5-4.4 3.5-2.7 0-4.1-1.3-4.5-3.3l2.8-.7c.3 1.2 1 1.7 1.8 1.7 1 0 1.6-.6 1.6-1.4 0-.8-.5-1.3-1.8-1.8l-1.1-.4c-2.3-.9-3.2-2-3.2-3.8 0-2.3 1.8-3.7 4.1-3.7 2.1 0 3.6 1.1 4.1 2.8l-2.7 1zM9.5 10.5v10.1c0 2.2-1.2 3.4-3.3 3.4-1.9 0-3-.9-3.5-2.3l2.7-1.2c.2.8.6 1.1 1 1.1.5 0 .8-.4.8-1.4V10.5h2.3z" />
    </svg>
  ),
  java: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9 19c3.5.5 7-.5 8-1.5-.5.5-2.5 1-4.5 1-2 0-3.5-.5-3.5-.5zm-1.5 2c4 .5 8-.5 9-1.5-.5.5-2.5 1-4.5 1-2.5 0-4.5-.5-4.5-.5zm5.5-16c1 1.5.5 3-1 4.5-1 1-1.5 2-1 3.5.5-1.5 1-2.5 2-3.5 1.5-1.5 2-3 0-4.5zm3 2c1 1.5.5 3-1 4.5-1 1-1.5 2-1 3.5.5-1.5 1-2.5 2-3.5 1.5-1.5 2-3 0-4.5z" />
    </svg>
  ),
  python: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.9 0c-3.1 0-5.8.5-5.8 2.8v2.9h6v.8H3.8c-2.4 0-4.3 1.9-4.3 4.2 0 2.4 1.7 4.2 4.1 4.2h2.5v-3.7c0-2.3 1.9-4.1 4.2-4.1h6.4c1.8 0 3.3-1.5 3.3-3.3V2.8C20 1 17 .1 14 .1c-.7 0-1.4 0-2.1-.1zm-3.2 1.8a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3.4 9.4c-1.8 0-3.3 1.5-3.3 3.3v4.3C8.8 21.2 11.8 22 14.8 22c.7 0 1.4 0 2.1.1 3.1 0 5.8-.5 5.8-2.8v-2.9h-6v-.8h8.3c2.4 0 4.3-1.9 4.3-4.2 0-2.4-1.7-4.2-4.1-4.2h-2.5v3.7c0 2.3-1.9 4.1-4.2 4.1h-6.4zm3.3 8.8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
    </svg>
  ),
  react: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm0-7c-4.4 0-8 1.3-8 3s3.6 3 8 3 8-1.3 8-3-3.6-3-8-3zm0 13c-4.4 0-8 1.3-8 3s3.6 3 8 3 8-1.3 8-3-3.6-3-8-3zm-6.1-9.9c-2.2 3.8-2.2 7.7 0 8.7s5.1-.6 7.3-4.4-2.2-7.7 0-8.7-5.1.6-7.3 4.4zm12.2 0c-2.2-3.8-5.1-4.4-7.3-4.4s-2.2 4.9 0 8.7 5.1 4.4 7.3 4.4 2.2-4.9 0-8.7z" />
    </svg>
  ),
  bootstrap: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 0h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3zm5.7 5.7v12.6h5.4c2.8 0 4.5-1.5 4.5-3.8 0-1.6-.9-2.8-2.3-3.3 1.1-.5 1.8-1.5 1.8-2.9 0-2.1-1.6-3.6-4.1-3.6H8.7zm3.1 2.6h2.2c1.1 0 1.8.6 1.8 1.6s-.7 1.6-1.8 1.6h-2.2V8.3zm0 5.4h2.4c1.3 0 2.1.7 2.1 1.8s-.8 1.8-2.1 1.8h-2.4v-3.6z" />
    </svg>
  ),
  nodejs: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0L1.6 6v12L12 24l10.4-6V6L12 0zm0 2.3l8.4 4.8v9.8L12 21.7l-8.4-4.8V7.1L12 2.3zm-1.8 6.5c-2.2 0-3.7 1.3-3.7 3.2 0 3.3 4.9 2.4 4.9 4.3 0 .7-.6 1.1-1.6 1.1-1.3 0-2.3-.6-2.8-1.4l-1.3 1.3c.9 1.3 2.4 2.1 4.1 2.1 2.4 0 3.9-1.3 3.9-3.2 0-3.4-4.9-2.6-4.9-4.4 0-.6.5-1 1.4-1 1.1 0 1.9.5 2.4 1.1l1.3-1.3c-.8-1-2.1-1.7-3.7-1.7z" />
    </svg>
  ),
  mongodb: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C11.5 4 8 8 8 13c0 4 2 8 4 11 2-3 4-7 4-11 0-5-3.5-9-4-13zm-.5 13.5v6c-1.5-2-2-4.5-2-6.5 0-2.5 1-4.5 2-6.5v7zm1 0v-7c1 2 2 4 2 6.5 0 2-.5 4.5-2 6.5v-6z" />
    </svg>
  ),
  github: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.2.9 2.4v3.5c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  ),
  linux: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2c-3.3 0-5 2.8-5 6.2 0 1.8.6 4.1 1.1 5.3-1.1.6-2.2 2.4-2.2 4.1 0 3 2.8 3.5 4.5 4.1-.6.6-1.1 1.8-1.1 3 0 1.8 1.7 2.3 3.4 2.3s3.4-.6 3.4-2.3c0-1.2-.6-2.4-1.1-3 1.7-.6 4.5-1.1 4.5-4.1 0-1.8-1.1-3.5-2.2-4.1.6-1.2 1.1-3.5 1.1-5.3 0-3.4-1.7-6.2-5-6.2z" />
    </svg>
  ),
  typescript: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" {...props}>
      <rect width="100" height="100" rx="16" fill="#3178c6" />
      <path
        d="M51 58.5h-12V84h-8.8V58.5h-12V50.8H51v7.7zm13.2 14.8c2.4 1.7 5.7 2.7 9 2.7 3.8 0 5.8-1.7 5.8-4.2 0-2.4-1.6-3.7-6.2-5.7l-3.3-1.4c-7.3-3.1-10.7-7-10.7-12.7 0-7.8 6.1-13.4 15.6-13.4 5.2 0 9.2 1.3 12.3 3.3l-3.5 7.6c-2.3-1.4-5.3-2.3-8.3-2.3-3.6 0-5.7 1.7-5.7 4 0 2.2 1.6 3.4 6.2 5.4l3.3 1.4c8.4 3.6 11.4 7.5 11.4 13.3 0 8.4-6.5 13.8-16.7 13.8-6.4 0-11.4-1.8-14.7-4.4l3.6-7.7z"
        fill="#ffffff"
      />
    </svg>
  ),
  n8n: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" {...props}>
      <text x="50" y="38" textAnchor="middle" fontWeight="900" fontSize="28" fontFamily="system-ui, sans-serif" fill="#18181b">
        N8N
      </text>
      <g fill="#ea4b71" stroke="#ea4b71" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 65 L42 65 L58 65" fill="none" />
        <path d="M58 65 C68 65 68 52 78 52" fill="none" />
        <path d="M58 65 C68 65 68 78 78 78" fill="none" />
        <circle cx="22" cy="65" r="6" fill="#ffffff" strokeWidth="5" />
        <circle cx="42" cy="65" r="6" fill="#ffffff" strokeWidth="5" />
        <circle cx="58" cy="65" r="6" fill="#ffffff" strokeWidth="5" />
        <circle cx="78" cy="52" r="6" fill="#ffffff" strokeWidth="5" />
        <circle cx="78" cy="78" r="6" fill="#ffffff" strokeWidth="5" />
      </g>
    </svg>
  ),
};

export interface SkillOrb {
  id: string;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  glow: string;
  border: string;
  xPct: number; // Organic scatter X position (0 to 100%)
  yPct: number; // Organic scatter Y position (0 to 100%)
  sizeDesktop: number; // in px
  sizeMobile: number; // in px
  floatSpeedX: number; // independent floating speed X
  floatSpeedY: number; // independent floating speed Y
  floatAmp: number; // independent floating amplitude in px
  phase: number; // phase offset in radians
  pulseSpeed: number; // "miti miti" breathing pulse speed
  pulseAmp: number; // "miti miti" breathing pulse amplitude
  techs: string[];
  summary: string;
}

const SKILL_ORBS: SkillOrb[] = [
  // --- CENTER FLAGSHIP HUB ---
  {
    id: 'react-core',
    name: 'React & Next.js',
    badge: 'CORE ARCH',
    icon: TechIcons.react,
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.65)',
    border: 'border-cyan-500',
    xPct: 74,
    yPct: 46,
    sizeDesktop: 106,
    sizeMobile: 78,
    floatSpeedX: 0.9,
    floatSpeedY: 0.8,
    floatAmp: 11,
    phase: 0.0,
    pulseSpeed: 2.1,
    pulseAmp: 0.065,
    techs: ['Next.js 15', 'React 19', 'Server Actions', 'High-DPI Canvas'],
    summary: 'Building state-of-the-art web architectures with 60FPS fluid canvas motion, atomic state modeling, and SSR resilience.',
  },
  // --- LEFT SIDE CLUSTER (7 skills) ---
  {
    id: 'html5',
    name: 'HTML5',
    badge: 'SEMANTIC',
    icon: TechIcons.html5,
    color: '#ea580c',
    glow: 'rgba(234, 88, 12, 0.55)',
    border: 'border-orange-500',
    xPct: 14,
    yPct: 22,
    sizeDesktop: 88,
    sizeMobile: 64,
    floatSpeedX: 0.8,
    floatSpeedY: 1.1,
    floatAmp: 8,
    phase: 0.5,
    pulseSpeed: 2.3,
    pulseAmp: 0.06,
    techs: ['Canvas API', 'Semantic Markup', 'Web Audio', 'Accessibility'],
    summary: 'Standard-compliant semantic markup, accessible HTML5 Canvas graphics, and performance ergonomics.',
  },
  {
    id: 'css3',
    name: 'CSS3',
    badge: 'SYSTEMS',
    icon: TechIcons.css3,
    color: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.55)',
    border: 'border-sky-400',
    xPct: 28,
    yPct: 15,
    sizeDesktop: 86,
    sizeMobile: 62,
    floatSpeedX: 1.2,
    floatSpeedY: 0.9,
    floatAmp: 7,
    phase: 1.8,
    pulseSpeed: 1.9,
    pulseAmp: 0.055,
    techs: ['Tailwind CSS', 'Flexbox / Grid', 'Keyframe Motion', '3D Transforms'],
    summary: 'Engineering award-winning cyber luxury styles, sub-pixel physical transitions, and glassmorphic aesthetics.',
  },
  {
    id: 'linux',
    name: 'Linux',
    badge: 'SYS / OS',
    icon: TechIcons.linux,
    color: '#d97706',
    glow: 'rgba(217, 119, 6, 0.55)',
    border: 'border-amber-500',
    xPct: 22,
    yPct: 38,
    sizeDesktop: 86,
    sizeMobile: 62,
    floatSpeedX: 0.9,
    floatSpeedY: 1.3,
    floatAmp: 9,
    phase: 3.2,
    pulseSpeed: 2.4,
    pulseAmp: 0.06,
    techs: ['Bash Scripting', 'Server Hardening', 'Process Management', 'Nginx'],
    summary: 'Production server operations, Unix daemon configuration, network routing, and shell automation scripts.',
  },
  {
    id: 'github',
    name: 'GitHub',
    badge: 'CI / CD',
    icon: TechIcons.github,
    color: '#181717',
    glow: 'rgba(24, 23, 23, 0.65)',
    border: 'border-zinc-300',
    xPct: 10,
    yPct: 50,
    sizeDesktop: 88,
    sizeMobile: 64,
    floatSpeedX: 1.1,
    floatSpeedY: 0.8,
    floatAmp: 10,
    phase: 4.5,
    pulseSpeed: 2.0,
    pulseAmp: 0.055,
    techs: ['GitHub Actions', 'Branch Strategies', 'Code Review', 'Automation CI'],
    summary: 'Enterprise version control, automated deployment pipelines, and collaborative software engineering standards.',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    badge: 'TYPES',
    icon: TechIcons.typescript,
    color: '#3178c6',
    glow: 'rgba(49, 120, 198, 0.6)',
    border: 'border-blue-500',
    xPct: 24,
    yPct: 60,
    sizeDesktop: 88,
    sizeMobile: 64,
    floatSpeedX: 0.85,
    floatSpeedY: 1.15,
    floatAmp: 9,
    phase: 1.4,
    pulseSpeed: 2.2,
    pulseAmp: 0.065,
    techs: ['Strict Types', 'Generics', 'Utility Types', 'AST Compiler'],
    summary: 'Enterprise type-safe engineering, advanced generic modeling, and compile-time defect prevention.',
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    badge: 'UI CSS',
    icon: TechIcons.bootstrap,
    color: '#9333ea',
    glow: 'rgba(147, 51, 234, 0.55)',
    border: 'border-purple-500',
    xPct: 13,
    yPct: 75,
    sizeDesktop: 86,
    sizeMobile: 62,
    floatSpeedX: 0.7,
    floatSpeedY: 1.2,
    floatAmp: 8,
    phase: 2.1,
    pulseSpeed: 2.5,
    pulseAmp: 0.06,
    techs: ['Grid Systems', 'Responsive Breakpoints', 'Utility Classes'],
    summary: 'Rapid prototyping, ergonomic layout grids, and accessible cross-browser UI primitives.',
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    badge: 'DATABASE',
    icon: TechIcons.mongodb,
    color: '#059669',
    glow: 'rgba(5, 150, 105, 0.55)',
    border: 'border-emerald-500',
    xPct: 29,
    yPct: 83,
    sizeDesktop: 88,
    sizeMobile: 64,
    floatSpeedX: 1.0,
    floatSpeedY: 0.9,
    floatAmp: 9,
    phase: 5.7,
    pulseSpeed: 1.95,
    pulseAmp: 0.055,
    techs: ['Document Modeling', 'Aggregation Pipelines', 'Indexing', 'Mongoose'],
    summary: 'Schema-flexible document databases optimized for high-write event automation and content management.',
  },

  // --- RIGHT SIDE CLUSTER (7 skills) ---
  {
    id: 'sass',
    name: 'Sass',
    badge: 'SCSS',
    icon: TechIcons.sass,
    color: '#db2777',
    glow: 'rgba(219, 39, 119, 0.55)',
    border: 'border-pink-500',
    xPct: 67,
    yPct: 26,
    sizeDesktop: 86,
    sizeMobile: 62,
    floatSpeedX: 1.3,
    floatSpeedY: 0.7,
    floatAmp: 8,
    phase: 1.2,
    pulseSpeed: 2.35,
    pulseAmp: 0.06,
    techs: ['SCSS Modules', 'Mixins', 'Variable Theming', 'Inheritance'],
    summary: 'Modular styling architectures, design token pre-processing, and scalable enterprise style systems.',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    badge: 'ES6+ WEB',
    icon: TechIcons.javascript,
    color: '#ca8a04',
    glow: 'rgba(202, 138, 4, 0.55)',
    border: 'border-yellow-500',
    xPct: 87,
    yPct: 32,
    sizeDesktop: 88,
    sizeMobile: 64,
    floatSpeedX: 0.8,
    floatSpeedY: 1.2,
    floatAmp: 9,
    phase: 3.8,
    pulseSpeed: 2.1,
    pulseAmp: 0.06,
    techs: ['ES6+', 'TypeScript', 'Async/Await', 'Event Loops'],
    summary: 'Deep expertise in asynchronous JavaScript, DOM performance benchmarks, and event-driven architectures.',
  },
  {
    id: 'python',
    name: 'Python',
    badge: 'AI & ML',
    icon: TechIcons.python,
    color: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.55)',
    border: 'border-sky-400',
    xPct: 89,
    yPct: 56,
    sizeDesktop: 88,
    sizeMobile: 64,
    floatSpeedX: 1.1,
    floatSpeedY: 1.0,
    floatAmp: 9,
    phase: 4.9,
    pulseSpeed: 2.25,
    pulseAmp: 0.065,
    techs: ['FastAPI', 'LangChain', 'PyTorch', 'Data Pipelines'],
    summary: 'Core language for artificial intelligence, automated reasoning graphs, and high-throughput server backends.',
  },
  {
    id: 'n8n',
    name: 'n8n',
    badge: 'AUTOMATION',
    icon: TechIcons.n8n,
    color: '#ea4b71',
    glow: 'rgba(234, 75, 113, 0.6)',
    border: 'border-rose-500',
    xPct: 72,
    yPct: 65,
    sizeDesktop: 88,
    sizeMobile: 64,
    floatSpeedX: 0.95,
    floatSpeedY: 1.1,
    floatAmp: 9,
    phase: 3.5,
    pulseSpeed: 2.4,
    pulseAmp: 0.07,
    techs: ['Webhook Triggers', 'AI Agent Nodes', 'Custom APIs', 'Event Pipelines'],
    summary: 'Visual AI workflow automation, enterprise system orchestration, webhook processing, and self-hosted autonomous pipelines.',
  },
  {
    id: 'java',
    name: 'Java',
    badge: 'BACKEND',
    icon: TechIcons.java,
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.55)',
    border: 'border-red-500',
    xPct: 84,
    yPct: 78,
    sizeDesktop: 86,
    sizeMobile: 62,
    floatSpeedX: 0.8,
    floatSpeedY: 1.3,
    floatAmp: 8,
    phase: 2.6,
    pulseSpeed: 2.05,
    pulseAmp: 0.055,
    techs: ['OOP Architecture', 'JVM Optimization', 'Enterprise APIs'],
    summary: 'Object-oriented application development, typed system design, and algorithmic problem solving.',
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    badge: 'RUNTIME',
    icon: TechIcons.nodejs,
    color: '#16a34a',
    glow: 'rgba(22, 163, 74, 0.55)',
    border: 'border-green-500',
    xPct: 59,
    yPct: 84,
    sizeDesktop: 88,
    sizeMobile: 64,
    floatSpeedX: 1.2,
    floatSpeedY: 0.9,
    floatAmp: 10,
    phase: 6.1,
    pulseSpeed: 2.3,
    pulseAmp: 0.06,
    techs: ['Express', 'Worker Threads', 'NPM Ecosystem', 'Microservices'],
    summary: 'Event-driven server runtimes powering API gateways, automation webhooks, and scalable worker clusters.',
  },
];

// ======================================================================
// KINETIC TYPOGRAPHY COMPONENT (Letter-by-Letter Monochromatic Pop / Fule Utha)
// ======================================================================
interface KineticTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  variant?: 'light' | 'dark';
}

function KineticText({
  children,
  className = '',
  as: Component = 'span',
  variant = 'light',
}: KineticTextProps) {
  // Split input into words to prevent unnatural mid-word line wraps
  const words = children.split(' ');
  const charClass = variant === 'dark' ? 'kinetic-char-dark' : 'kinetic-char';

  return (
    <Component
      className={`pointer-events-auto ${className}`}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIdx) => (
            <span
              key={charIdx}
              className={`${charClass} inline-block select-none will-change-transform cursor-pointer`}
            >
              {char}
            </span>
          ))}
          {wordIdx < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </Component>
  );
}


// ======================================================================
// 3D FLOATING SKILL ORBS NETWORK COMPONENT
// ======================================================================
interface SkillSpheresNetworkProps {
  scrollProgress: number;
  opacity: number;
}

function SkillSpheresNetwork({ scrollProgress, opacity }: SkillSpheresNetworkProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 800,
  });
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [time, setTime] = useState<number>(0);

  // Smooth 60FPS organic anti-gravity floating physics loop
  useEffect(() => {
    let animId: number;
    let localTime = 0;
    const loop = () => {
      localTime += 0.02;
      setTime(localTime);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Measure container dimensions for responsive orbit placement
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const isMobile = dimensions.width < 768;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;

  // Center coordinates for parallax and bloom anchor
  const cx = dimensions.width / 2;
  const cy = dimensions.height / 2;

  // Radial bloom expansion synchronized with scroll
  // Starts emerging when entering Skills section (scroll 0.20), blooms to 100% by scroll 0.28
  const bloomProgress = Math.min(
    Math.max((scrollProgress - 0.20) / 0.08, 0),
    1
  );


  // Calculate organic scattered coordinates for all orbs (non-circular, asymmetrical 3D field)
  const computedOrbs = SKILL_ORBS.map((orb) => {
    // Responsive anchor target in pixels
    const targetX = (orb.xPct / 100) * dimensions.width;
    const targetY = (orb.yPct / 100) * dimensions.height;

    // Organic independent anti-gravity float physics + scroll rotation influence
    const scrollAngle = scrollProgress * 8;
    const floatX = Math.cos(time * orb.floatSpeedX + orb.phase + scrollAngle * 0.4) * (isMobile ? orb.floatAmp * 0.5 : orb.floatAmp);
    const floatY = Math.sin(time * orb.floatSpeedY + orb.phase + scrollAngle * 0.5) * (isMobile ? orb.floatAmp * 0.6 : orb.floatAmp * 1.25);

    // Subtle magnetic parallax response to cursor
    const parallaxFactor = 0.015;
    const parallaxX = (mousePos.x - cx) * parallaxFactor;
    const parallaxY = (mousePos.y - cy) * parallaxFactor;

    // Organic bloom expansion: emerges smoothly outwards from initial soft cluster
    const startX = cx + (targetX - cx) * 0.12;
    const startY = cy + (targetY - cy) * 0.12;

    const currentAnchorX = startX + (targetX - startX) * bloomProgress;
    const currentAnchorY = startY + (targetY - startY) * bloomProgress;

    const x = currentAnchorX + floatX + parallaxX;
    const y = currentAnchorY + floatY + parallaxY;
    const size = isMobile ? orb.sizeMobile : orb.sizeDesktop;

    // "Miti miti" rhythmic breathing scale & glow twinkle (boro choto)
    const pulseCycle = Math.sin(time * orb.pulseSpeed + orb.phase);
    const pulseScale = 1 + pulseCycle * orb.pulseAmp;
    const glowMultiplier = 1 + pulseCycle * 0.25;

    return {
      ...orb,
      x,
      y,
      size,
      pulseScale,
      glowMultiplier,
      scale: 0.2 + 0.8 * bloomProgress,
    };
  });

  // Satellite decorative floating dots (mini bubbles scattered organically)
  const satelliteDots = [
    { xPct: 20, yPct: 30, size: 14, color: '#f43f5e', speed: 0.4 },
    { xPct: 40, yPct: 20, size: 10, color: '#38bdf8', speed: -0.3 },
    { xPct: 18, yPct: 65, size: 16, color: '#a855f7', speed: 0.5 },
    { xPct: 80, yPct: 35, size: 12, color: '#10b981', speed: -0.4 },
    { xPct: 75, yPct: 72, size: 18, color: '#fb923c', speed: 0.35 },
    { xPct: 92, yPct: 68, size: 11, color: '#ec4899', speed: -0.45 },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
    >
      {/* Right Side Headline: SKILLS */}
      <div
        style={{
          opacity: Math.min(bloomProgress * 1.5, 1),
          transform: `translateY(${(1 - Math.min(bloomProgress * 1.5, 1)) * 16}px)`,
        }}
        className="absolute top-2 sm:top-4 md:top-6 right-6 sm:right-10 lg:right-16 z-20 text-right pointer-events-auto select-none transition-all duration-300 pr-2 sm:pr-4"
      >
        <KineticText
          as="h2"
          className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold tracking-[0.12em] text-white uppercase drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)] leading-tight"
        >
          SKILLS
        </KineticText>
      </div>

      {/* SVG Ambient Glow Layer (Zero connector lines - pristine floating look) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <radialGradient id="centerGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e11d48" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft Ambient Glow */}
        <circle cx={cx} cy={cy} r={Math.min(dimensions.width, dimensions.height) * 0.45 * bloomProgress} fill="url(#centerGlowGrad)" />
      </svg>

      {/* Satellite Floating Dots (Atmospheric mini-bubbles) */}
      {bloomProgress > 0.1 &&
        satelliteDots.map((dot, i) => {
          const baseX = (dot.xPct / 100) * dimensions.width;
          const baseY = (dot.yPct / 100) * dimensions.height;
          const dotX = baseX + Math.cos(time * dot.speed + i) * 12;
          const dotY = baseY + Math.sin(time * dot.speed + i) * 15;

          return (
            <div
              key={`dot-${i}`}
              style={{
                left: `${dotX}px`,
                top: `${dotY}px`,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                backgroundColor: dot.color,
                boxShadow: `0 0 12px ${dot.color}`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute rounded-full opacity-60 pointer-events-none z-10 transition-transform duration-75"
            />
          );
        })}

      {/* Floating 3D Skill Spheres */}
      <div className="absolute inset-0 pointer-events-auto z-20">
        {computedOrbs.map((orb) => {
          const Icon = orb.icon;
          const isCenter = orb.id === 'react-core';
          const isHovered = hoveredSkillId === orb.id;

          return (
            <div
              key={orb.id}
              onMouseEnter={() => setHoveredSkillId(orb.id)}
              onMouseLeave={() => setHoveredSkillId(null)}
              style={{
                left: `${orb.x}px`,
                top: `${orb.y}px`,
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                transform: `translate(-50%, -50%) scale(${orb.scale * (isHovered ? 1.15 : orb.pulseScale)})`,
                background: isHovered
                  ? 'radial-gradient(circle at 35% 28%, #ffffff 0%, #f8fafc 45%, #e2e8f0 80%, #cbd5e1 100%)'
                  : 'radial-gradient(circle at 35% 28%, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.92) 45%, rgba(226,232,240,0.88) 80%, rgba(203,213,225,0.85) 100%)',
                boxShadow: isHovered
                  ? `0 14px 35px rgba(0, 0, 0, 0.35), 0 0 32px ${orb.glow}, inset -3px -3px 8px rgba(148, 163, 184, 0.45), inset 3px 3px 6px rgba(255, 255, 255, 1)`
                  : `0 ${10 * orb.glowMultiplier}px ${25 * orb.glowMultiplier}px rgba(0, 0, 0, 0.24), 0 0 ${16 * orb.glowMultiplier}px rgba(255, 255, 255, 0.5), inset -2px -2px 6px rgba(148, 163, 184, 0.35), inset 2px 2px 5px rgba(255, 255, 255, 0.95)`,
                transition: isHovered
                  ? 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease-out'
                  : 'box-shadow 0.25s ease-out',
              }}
              className={`absolute rounded-full cursor-pointer flex flex-col items-center justify-center p-1 sm:p-1.5 select-none backdrop-blur-2xl border-2 ${
                isHovered ? 'border-white ring-2 ring-white/80' : 'border-white/85 shadow-lg'
              }`}
            >
              {/* 3D Specular Highlight Glass Overlay */}
              <div
                aria-hidden="true"
                style={{
                  background:
                    'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0) 65%)',
                }}
                className="absolute inset-0 rounded-full pointer-events-none"
              />

              {/* Sphere Content */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-1">
                {/* Authentic Tech Vector Logo */}
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-xl flex items-center justify-center mb-0.5 transition-all duration-200"
                  style={{
                    color: orb.color,
                    filter: `drop-shadow(0 2px 4px ${orb.color}60)`,
                  }}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Skill / Technology Name with Kinetic Char Pop */}
                <KineticText
                  variant="dark"
                  className="font-sans font-bold text-[9px] sm:text-[10px] md:text-[11px] text-zinc-900 leading-tight px-0.5 drop-shadow-sm"
                >
                  {orb.name}
                </KineticText>

                {/* Subtitle / Category Badge with Kinetic Char Pop */}
                <div style={{ color: orb.color }} className="mt-0.5">
                  <KineticText
                    variant="dark"
                    className="font-mono text-[7px] sm:text-[7.5px] font-semibold tracking-wider uppercase"
                  >
                    {orb.badge}
                  </KineticText>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ======================================================================
// DUAL-ARC CURVED CARDS SHOWCASE COMPONENT (Inspired by iPad Reference UI)
// Two curved lines of tilted cards on left and right, center showcase
// ======================================================================
interface LocalLegacyShowcaseItem {
  id: string;
  side: 'left' | 'right';
  title: string;
  category: string;
  badge: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  summary: string;
  metric: string;
  metricLabel: string;
  techs: string[];
  status: string;
}

const SHOWCASE_ITEMS: LocalLegacyShowcaseItem[] = [
  // LEFT ARC: AI & Autonomous Agent Architectures
  {
    id: 'omni-agent',
    side: 'left',
    title: 'OmniAgent Core',
    category: 'Autonomous Multi-Agent',
    badge: 'Flagship Architecture',
    color: '#10b981',
    icon: Bot,
    summary:
      'Distributed multi-agent orchestration framework featuring cognitive reasoning, dynamic tool execution, memory persistence, and auto-fallback routing.',
    metric: '120ms',
    metricLabel: 'P99 Tool Resolution',
    techs: ['Python', 'LangChain', 'FastAPI', 'Qdrant', 'Claude 3.5'],
    status: 'Production Deployed',
  },
  {
    id: 'neural-rag',
    side: 'left',
    title: 'NeuralFlow RAG',
    category: 'Hybrid Vector Search',
    badge: 'Enterprise Intelligence',
    color: '#38bdf8',
    icon: Cpu,
    summary:
      'Ultra-fast hybrid retrieval-augmented generation engine with semantic re-ranking, high-density document chunking, and live context streaming.',
    metric: '99.4%',
    metricLabel: 'Semantic Precision',
    techs: ['Next.js 15', 'Pinecone', 'OpenAI', 'TypeScript', 'Tailwind'],
    status: 'Enterprise Active',
  },
  {
    id: 'voice-pilot',
    side: 'left',
    title: 'VoicePilot Realtime',
    category: 'Low-Latency Speech AI',
    badge: 'Conversational Voice',
    color: '#a855f7',
    icon: Zap,
    summary:
      'Full-duplex bidirectional voice agent combining Deepgram streaming transcription, ultra-fast LLM inference, and ElevenLabs speech synthesis.',
    metric: '<320ms',
    metricLabel: 'End-to-End Latency',
    techs: ['WebRTC', 'WebSockets', 'Deepgram', 'ElevenLabs', 'Node.js'],
    status: 'Client Verified',
  },
  {
    id: 'knowledge-graph',
    side: 'left',
    title: 'Cognitive Graph LLM',
    category: 'Graph Neural Reasoning',
    badge: 'Deep Intelligence',
    color: '#f59e0b',
    icon: Boxes,
    summary:
      'Enterprise knowledge graph mapping complex business domains to structured Cypher queries and multi-hop associative LLM reasoning.',
    metric: '10M+',
    metricLabel: 'Connected Nodes',
    techs: ['Neo4j', 'Cypher', 'Llama 3.3', 'Python', 'FastAPI'],
    status: 'Live Cluster',
  },
  {
    id: 'vision-sense',
    side: 'left',
    title: 'VisionSense 3D',
    category: 'Spatial Intelligence',
    badge: 'Computer Vision',
    color: '#14b8a6',
    icon: Activity,
    summary:
      'Real-time multi-camera spatial video feed processing, object tracking, and automatic visual anomaly detection for physical operations.',
    metric: '60 FPS',
    metricLabel: 'Realtime Pipeline',
    techs: ['YOLOv10', 'PyTorch', 'OpenCV', 'CUDA', 'FastAPI'],
    status: 'High Concurrency',
  },
  {
    id: 'code-pilot',
    side: 'left',
    title: 'CodePilot QA Agent',
    category: 'Autonomous Code Review',
    badge: 'CI/CD Automation',
    color: '#f43f5e',
    icon: Code2,
    summary:
      'Self-improving code review and security agent capable of scanning PR diffs, catching edge-case regressions, and generating automated fix commits.',
    metric: '94%',
    metricLabel: 'Automated Fix Rate',
    techs: ['GitHub API', 'Docker', 'TypeScript', 'Claude 3.5', 'ESLint'],
    status: 'Production Grade',
  },

  // RIGHT ARC: Automations & Full-Stack Platforms
  {
    id: 'n8n-hub',
    side: 'right',
    title: 'n8n Enterprise Hub',
    category: 'Autonomous Workflow Engine',
    badge: 'Event Orchestration',
    color: '#ea4c89',
    icon: Workflow,
    summary:
      'Scalable event-driven n8n workflow cluster connecting 200+ enterprise apps, Stripe billing webhooks, CRM sync, and LLM triage routing.',
    metric: '50,000+',
    metricLabel: 'Daily Invocations',
    techs: ['n8n', 'PostgreSQL', 'Docker', 'Webhooks', 'Redis'],
    status: 'High Throughput',
  },
  {
    id: 'cloud-saas',
    side: 'right',
    title: 'CloudScale SaaS Platform',
    category: 'Next-Gen Web Platform',
    badge: 'Full-Stack Architecture',
    color: '#0284c7',
    icon: Layers,
    summary:
      'Modern multi-tenant web application featuring RBAC security, server-side caching, automated PDF reports, and real-time Stripe checkout.',
    metric: '99.99%',
    metricLabel: 'Uptime SLA',
    techs: ['Next.js 15', 'React 19', 'Tailwind', 'Supabase', 'Stripe'],
    status: 'Active Subscribers',
  },
  {
    id: 'autonomous-crm',
    side: 'right',
    title: 'Autonomous CRM Core',
    category: 'AI Pipeline & Enrichment',
    badge: 'Revenue Operations',
    color: '#10b981',
    icon: TrendingUp,
    summary:
      'Automated sales intelligence pipeline that enriches incoming leads, predicts deal closing probabilities, and writes personalized outbound briefs.',
    metric: '3.4x',
    metricLabel: 'Conversion Uplift',
    techs: ['Python', 'PostgreSQL', 'FastAPI', 'Redis', 'OpenAI'],
    status: 'Client Proven',
  },
  {
    id: 'web3-deck',
    side: 'right',
    title: 'Realtime Telemetry Deck',
    category: 'High-Frequency Analytics',
    badge: 'Sub-Second Dashboard',
    color: '#8b5cf6',
    icon: Globe,
    summary:
      'Sub-second real-time streaming telemetry and financial dashboard visualizing high-volume event streams with WebGL hardware acceleration.',
    metric: '100k+',
    metricLabel: 'Events / Sec',
    techs: ['TypeScript', 'WebGL', 'WebSockets', 'Tailwind', 'Canvas'],
    status: 'Realtime Live',
  },
  {
    id: 'sync-pulse',
    side: 'right',
    title: 'SyncPulse Event Stream',
    category: 'Distributed Message Broker',
    badge: 'Enterprise Backend',
    color: '#f59e0b',
    icon: Database,
    summary:
      'Distributed pub/sub event pipeline with guaranteed at-least-once delivery, dead-letter automatic retries, and Prometheus metrics monitoring.',
    metric: '0.00%',
    metricLabel: 'Message Drop Rate',
    techs: ['Kafka', 'Docker', 'Go', 'Redis', 'Kubernetes'],
    status: 'Cluster Verified',
  },
  {
    id: 'edge-api',
    side: 'right',
    title: 'EdgePulse Global API',
    category: 'Edge Compute Infrastructure',
    badge: 'Global CDN Network',
    color: '#f97316',
    icon: Sparkles,
    summary:
      'Globally distributed edge compute API running on Cloudflare Workers with geo-distributed database replication and instant caching.',
    metric: '<25ms',
    metricLabel: 'Global P99 Latency',
    techs: ['Cloudflare Workers', 'GraphQL', 'TypeScript', 'Prisma'],
    status: 'Worldwide Deployed',
  },
];

const SHOWCASE_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  Bot,
  Cpu,
  Activity,
  Code2,
  Globe,
  Zap,
  Workflow,
  Layers,
  TrendingUp,
  Database,
  Sparkles,
};

interface DualArcShowcaseProps {
  scrollProgress: number;
  opacity: number;
  onOpenConsultation?: () => void;
}

function DualArcShowcase({
  scrollProgress,
}: DualArcShowcaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1200,
    height: 800,
  });
  const [items, setItems] = useState<ShowcaseItem[]>(DEFAULT_SHOWCASE_ITEMS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [interactiveOffset, setInteractiveOffset] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const currentProgressRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);

  // Background dynamic database synchronization
  useEffect(() => {
    fetch('/api/showcase')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
      })
      .catch((err) => console.warn('Showcase API sync error:', err));
  }, []);

  // Synchronize target flow progress with scrollProgress + interactive offsets
  useEffect(() => {
    // scrollProgress in Slot 4 runs from ~0.48 to 0.74
    // Smooth downward flow as user scrolls down
    const scrollDriven = (scrollProgress - 0.48) * 3.8;
    targetProgressRef.current = scrollDriven + interactiveOffset;
  }, [scrollProgress, interactiveOffset]);

  // Smooth 60FPS inertial damping Lerp loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      currentProgressRef.current +=
        (targetProgressRef.current - currentProgressRef.current) * 0.085;
      setCurrentProgress(currentProgressRef.current);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = dimensions.width < 768;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;

  const leftItems = useMemo(
    () => items.filter((item) => item.side === 'left'),
    [items]
  );
  const rightItems = useMemo(
    () => items.filter((item) => item.side === 'right'),
    [items]
  );

  // Dense continuous packaging with no empty gaps right from the start/top edge
  const displayLeftItems = useMemo(() => {
    if (leftItems.length === 0) return [];
    const source = leftItems.length < 6 ? [...leftItems, ...leftItems] : leftItems;
    return source.map((item, idx) => ({
      item,
      uniqueKey: `left-${item.id}-${idx}`,
    }));
  }, [leftItems]);

  const displayRightItems = useMemo(() => {
    if (rightItems.length === 0) return [];
    const source = rightItems.length < 6 ? [...rightItems, ...rightItems] : rightItems;
    return source.map((item, idx) => ({
      item,
      uniqueKey: `right-${item.id}-${idx}`,
    }));
  }, [rightItems]);

  const N_left = Math.max(displayLeftItems.length, 1);
  const N_right = Math.max(displayRightItems.length, 1);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    setInteractiveOffset((prev) => prev + e.deltaY * 0.0006);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current !== null) {
      const delta = e.touches[0].clientY - touchStartY.current;
      touchStartY.current = e.touches[0].clientY;
      setInteractiveOffset((prev) => prev - delta * 0.0018);
    }
  };
  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  // Parametric geometry configuration responsive to screen width
  const baseLeftXPct = isMobile ? 6 : isTablet ? 8 : 10;
  const baseRightXPct = isMobile ? 94 : isTablet ? 92 : 90;
  const bulgePct = isMobile ? 12 : isTablet ? 15 : 18;
  const centerYPct = 50;
  // Span from -3% to 103% so cards start right at the very top edge with ZERO empty gaps
  const halfHeightPct = isMobile ? 54 : 53;
  const cardSizePx = isMobile ? 48 : isTablet ? 60 : 68;
  const iconSizeClass = isMobile ? 'w-5 h-5' : isTablet ? 'w-6 h-6' : 'w-7 h-7';

  // Left curve: starts from above top edge, travels directly on curved arc, seamless infinite stream
  const leftCalculated = displayLeftItems.map(({ item, uniqueKey }, idx) => {
    const t = ((idx / N_left + currentProgress) % 1 + 1) % 1;
    const yPct = centerYPct - halfHeightPct + 2 * halfHeightPct * t;
    const xPct = baseLeftXPct + 4 * bulgePct * t * (1 - t);
    const rotationDeg = -(1 - 2 * t) * 22;

    let opacity = 1;
    let scale = 1;
    if (t < 0.04) {
      // Smooth fade at the extreme top edge
      const factor = t / 0.04;
      opacity = Math.max(0, factor);
      scale = 0.65 + 0.35 * factor;
    } else if (t > 0.96) {
      // Smooth fade at the extreme bottom edge
      const factor = (1 - t) / 0.04;
      opacity = Math.max(0, factor);
      scale = 0.65 + 0.35 * Math.max(0, factor);
    } else {
      const midDist = 1 - 2 * Math.abs(t - 0.5);
      scale = 1.0 + 0.12 * midDist;
      opacity = 1;
    }

    const zIndex = Math.round(15 + (1 - Math.abs(t - 0.5) * 2) * 15);

    return { item, uniqueKey, xPct, yPct, rotationDeg, scale, opacity, zIndex, t };
  });

  // Right curve: starts from above top edge, travels directly on curved arc, seamless infinite stream
  const rightCalculated = displayRightItems.map(({ item, uniqueKey }, idx) => {
    const t = ((idx / N_right + currentProgress + 0.08) % 1 + 1) % 1;
    const yPct = centerYPct - halfHeightPct + 2 * halfHeightPct * t;
    const xPct = baseRightXPct - 4 * bulgePct * t * (1 - t);
    const rotationDeg = (1 - 2 * t) * 22;

    let opacity = 1;
    let scale = 1;
    if (t < 0.04) {
      const factor = t / 0.04;
      opacity = Math.max(0, factor);
      scale = 0.65 + 0.35 * factor;
    } else if (t > 0.96) {
      const factor = (1 - t) / 0.04;
      opacity = Math.max(0, factor);
      scale = 0.65 + 0.35 * Math.max(0, factor);
    } else {
      const midDist = 1 - 2 * Math.abs(t - 0.5);
      scale = 1.0 + 0.12 * midDist;
      opacity = 1;
    }

    const zIndex = Math.round(15 + (1 - Math.abs(t - 0.5) * 2) * 15);

    return { item, uniqueKey, xPct, yPct, rotationDeg, scale, opacity, zIndex, t };
  });

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none px-4 sm:px-8 cursor-grab active:cursor-grabbing"
    >

      {/* Left Headline: WHAT I DO */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-10 md:left-14 lg:left-16 xl:left-24 z-20 text-left pointer-events-auto select-none transition-all duration-300">
        <KineticText
          as="h2"
          className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold tracking-[0.12em] text-white uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.98)] leading-tight"
        >
          WHAT I DO
        </KineticText>
      </div>

      {/* Right Headline: PROJECTS */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 sm:right-10 md:right-14 lg:right-16 xl:right-24 z-20 text-right pointer-events-auto select-none transition-all duration-300">
        <KineticText
          as="h2"
          className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-bold tracking-[0.12em] text-white uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.98)] leading-tight"
        >
          PROJECTS
        </KineticText>
      </div>

      {/* Left Curved Revolving Cards Wheel */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {leftCalculated.map((card) => {
          const isSelected = selectedId === card.item.id;
          const isHovered = hoveredId === card.uniqueKey;
          const Icon =
            (card.item.iconName && SHOWCASE_ICON_MAP[card.item.iconName]) || Sparkles;

          return (
            <div
              key={card.uniqueKey}
              style={{
                left: `${card.xPct}%`,
                top: `${card.yPct}%`,
                width: `${cardSizePx}px`,
                height: `${cardSizePx}px`,
                transform: 'translate(-50%, -50%)',
                opacity: isSelected || isHovered ? 1 : card.opacity,
                zIndex: isSelected ? 60 : isHovered ? 50 : card.zIndex,
                pointerEvents: card.opacity < 0.05 ? 'none' : 'auto',
                willChange: 'transform, left, top',
              }}
              className="absolute pointer-events-none flex items-center justify-center"
            >
              <button
                onClick={() => {
                  setSelectedId((prev) => (prev === card.item.id ? null : card.item.id));
                  if (card.item.link) {
                    window.open(card.item.link, '_blank', 'noopener,noreferrer');
                  }
                }}
                onMouseEnter={() => setHoveredId(card.uniqueKey)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={card.item.title}
                title={card.item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `rotate(${
                    isSelected || isHovered ? 0 : card.rotationDeg
                  }deg) scale(${
                    isSelected
                      ? card.scale * 1.6
                      : isHovered
                      ? card.scale * 1.55
                      : card.scale
                  })`,
                  backgroundColor: isSelected
                    ? 'rgba(255, 255, 255, 0.96)'
                    : isHovered
                    ? 'rgba(24, 24, 34, 0.95)'
                    : 'rgba(15, 15, 20, 0.88)',
                  borderColor: isSelected
                    ? card.item.color
                    : isHovered
                    ? (card.item.color || '#f43f5e')
                    : 'rgba(255, 255, 255, 0.20)',
                  boxShadow: isSelected
                    ? `0 0 35px ${card.item.color}90, 0 16px 32px rgba(0,0,0,0.85)`
                    : isHovered
                    ? `0 0 28px ${card.item.color || '#f43f5e'}80, 0 12px 24px rgba(0,0,0,0.7)`
                    : '0 6px 14px rgba(0,0,0,0.4)',
                  transition:
                    'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 300ms ease, border-color 300ms ease, background-color 300ms ease',
                  willChange: 'transform',
                }}
                className="pointer-events-auto rounded-2xl border backdrop-blur-xl flex items-center justify-center cursor-pointer select-none group overflow-hidden"
              >
                {card.item.imageUrl ? (
                  <img
                    src={card.item.imageUrl}
                    alt={card.item.title}
                    className="w-full h-full object-contain p-2 rounded-2xl transition-transform duration-300 ease-out group-hover:scale-115 pointer-events-none"
                    loading="lazy"
                  />
                ) : (
                  <Icon
                    className={`${iconSizeClass} transition-transform duration-300 ease-out group-hover:scale-115 pointer-events-none`}
                    style={{
                      color: isSelected ? '#000000' : card.item.color,
                    }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Right Curved Revolving Cards Wheel */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {rightCalculated.map((card) => {
          const isSelected = selectedId === card.item.id;
          const isHovered = hoveredId === card.uniqueKey;
          const Icon =
            (card.item.iconName && SHOWCASE_ICON_MAP[card.item.iconName]) || Sparkles;

          return (
            <div
              key={card.uniqueKey}
              style={{
                left: `${card.xPct}%`,
                top: `${card.yPct}%`,
                width: `${cardSizePx}px`,
                height: `${cardSizePx}px`,
                transform: 'translate(-50%, -50%)',
                opacity: isSelected || isHovered ? 1 : card.opacity,
                zIndex: isSelected ? 60 : isHovered ? 50 : card.zIndex,
                pointerEvents: card.opacity < 0.05 ? 'none' : 'auto',
                willChange: 'transform, left, top',
              }}
              className="absolute pointer-events-none flex items-center justify-center"
            >
              <button
                onClick={() => {
                  setSelectedId((prev) => (prev === card.item.id ? null : card.item.id));
                  if (card.item.link) {
                    window.open(card.item.link, '_blank', 'noopener,noreferrer');
                  }
                }}
                onMouseEnter={() => setHoveredId(card.uniqueKey)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={card.item.title}
                title={card.item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `rotate(${
                    isSelected || isHovered ? 0 : card.rotationDeg
                  }deg) scale(${
                    isSelected
                      ? card.scale * 1.6
                      : isHovered
                      ? card.scale * 1.55
                      : card.scale
                  })`,
                  backgroundColor: isSelected
                    ? 'rgba(255, 255, 255, 0.96)'
                    : isHovered
                    ? 'rgba(24, 24, 34, 0.95)'
                    : 'rgba(15, 15, 20, 0.88)',
                  borderColor: isSelected
                    ? card.item.color
                    : isHovered
                    ? (card.item.color || '#f43f5e')
                    : 'rgba(255, 255, 255, 0.20)',
                  boxShadow: isSelected
                    ? `0 0 35px ${card.item.color}90, 0 16px 32px rgba(0,0,0,0.85)`
                    : isHovered
                    ? `0 0 28px ${card.item.color || '#f43f5e'}80, 0 12px 24px rgba(0,0,0,0.7)`
                    : '0 6px 14px rgba(0,0,0,0.4)',
                  transition:
                    'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 300ms ease, border-color 300ms ease, background-color 300ms ease',
                  willChange: 'transform',
                }}
                className="pointer-events-auto rounded-2xl border backdrop-blur-xl flex items-center justify-center cursor-pointer select-none group overflow-hidden"
              >
                {card.item.imageUrl ? (
                  <img
                    src={card.item.imageUrl}
                    alt={card.item.title}
                    className="w-full h-full object-contain p-2 rounded-2xl transition-transform duration-300 ease-out group-hover:scale-115 pointer-events-none"
                    loading="lazy"
                  />
                ) : (
                  <Icon
                    className={`${iconSizeClass} transition-transform duration-300 ease-out group-hover:scale-115 pointer-events-none`}
                    style={{
                      color: isSelected ? '#000000' : card.item.color,
                    }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ======================================================================
// MAIN PAGE COMPONENT (Apple-Style Scroll Scrubbing Experience)
// ======================================================================
export default function Page() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [loadedFramesCount, setLoadedFramesCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeFrameDisplay, setActiveFrameDisplay] = useState<number>(1);
  const [isConsultationOpen, setIsConsultationOpen] = useState<boolean>(false);
  const [consultationStatus, setConsultationStatus] = useState<
    'idle' | 'submitting' | 'success'
  >('idle');

  // DOM & Animation References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesCacheRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const rAFIdRef = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef<number | null>(null);

  // Proven Performance Metrics (Live Database / API Supported)
  const [performanceStats, setPerformanceStats] = useState<PerformanceStatItem[]>(DEFAULT_PERFORMANCE_STATS);

  // SSR hydration guard
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Dynamic fetch for Proven Performance metrics from database / API
  useEffect(() => {
    if (!isMounted) return;
    fetch('/api/metrics')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          setPerformanceStats(json.data);
        }
      })
      .catch((err) => {
        console.warn('[Performance Stats] Fallback to local default:', err);
      });
  }, [isMounted]);

  // ====================================================================
  // 1. IN-MEMORY ASSET PRE-DECODING CACHE (Zero Flashes / 50 Frames)
  // ====================================================================
  useEffect(() => {
    if (!isMounted) return;

    let isCancelled = false;
    let loadedCount = 0;
    const cache: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);

      img.onload = () => {
        if (isCancelled) return;
        loadedCount++;
        setLoadedFramesCount(loadedCount);
        if (loadedCount >= TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        if (isCancelled) return;
        loadedCount++;
        setLoadedFramesCount(loadedCount);
        if (loadedCount >= TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      cache.push(img);
    }

    imagesCacheRef.current = cache;

    return () => {
      isCancelled = true;
    };
  }, [isMounted]);

  // ====================================================================
  // 2. 60FPS DUAL-BOUND SCROLL LISTENER & TARGET BINDING
  // ====================================================================
  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) return;

      const progress = Math.max(0, Math.min(1, scrollY / docHeight));
      setScrollProgress(progress);

      // 1:1 Scroll Bounds: Scroll 0% = Frame 1; Scroll 100% = Exact Frame 50
      const exactTarget = 1 + progress * (TOTAL_FRAMES - 1);
      targetFrameRef.current = exactTarget;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial run to calculate baseline
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMounted]);

  // ====================================================================
  // 3. RESPONSIVE CONTAIN-FIT CANVAS RENDER LOOP (High-DPI 4K & No Cut-offs)
  // ====================================================================
  useEffect(() => {
    if (!isMounted) return;

    // Reuse coordinate and scale variables across frames to prevent GC thrashing
    let prevWidth = 0;
    let prevHeight = 0;
    let prevDpr = 0;

    const render = () => {
      // Lerp smoothing: currentFrame += (targetFrame - currentFrame) * 0.1
      currentFrameRef.current +=
        (targetFrameRef.current - currentFrameRef.current) * 0.1;

      // Snap when negligibly close to avoid perpetual micro-increments
      if (
        Math.abs(targetFrameRef.current - currentFrameRef.current) < 0.005
      ) {
        currentFrameRef.current = targetFrameRef.current;
      }

      const frameIndex = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.round(currentFrameRef.current))
      );
      setActiveFrameDisplay(frameIndex);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const img = imagesCacheRef.current[frameIndex - 1];

        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          const displayWidth = window.innerWidth;
          const displayHeight = window.innerHeight;

          // Resize buffer if viewport or device pixel ratio changed
          if (
            prevWidth !== displayWidth ||
            prevHeight !== displayHeight ||
            prevDpr !== dpr
          ) {
            canvas.width = Math.floor(displayWidth * dpr);
            canvas.height = Math.floor(displayHeight * dpr);
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;

            prevWidth = displayWidth;
            prevHeight = displayHeight;
            prevDpr = dpr;
          }

          // Enable high-quality bicubic smoothing for sharp rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // If frame image is loaded and ready, draw with aspect-ratio containment math
          if (img && img.complete && img.naturalWidth > 0) {
            const hRatio = canvas.width / img.naturalWidth;
            const vRatio = canvas.height / img.naturalHeight;
            const ratio = Math.max(hRatio, vRatio);

            const centerShiftX = (canvas.width - img.naturalWidth * ratio) / 2;
            const centerShiftY =
              (canvas.height - img.naturalHeight * ratio) / 2;

            // Clear buffer before painting new frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw contain-fit image centered horizontally & vertically
            ctx.drawImage(
              img,
              0,
              0,
              img.naturalWidth,
              img.naturalHeight,
              centerShiftX,
              centerShiftY,
              img.naturalWidth * ratio,
              img.naturalHeight * ratio
            );

            lastDrawnFrameRef.current = frameIndex;
          } else if (lastDrawnFrameRef.current !== null) {
            // FALLBACK SAFETY: NEVER clear to black or white if current frame is loading;
            // persist the last successfully rendered frame!
            const fallbackImg =
              imagesCacheRef.current[lastDrawnFrameRef.current - 1];
            if (
              fallbackImg &&
              fallbackImg.complete &&
              fallbackImg.naturalWidth > 0
            ) {
              const hRatio = canvas.width / fallbackImg.naturalWidth;
              const vRatio = canvas.height / fallbackImg.naturalHeight;
              const ratio = Math.max(hRatio, vRatio);

              const centerShiftX =
                (canvas.width - fallbackImg.naturalWidth * ratio) / 2;
              const centerShiftY =
                (canvas.height - fallbackImg.naturalHeight * ratio) / 2;

              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(
                fallbackImg,
                0,
                0,
                fallbackImg.naturalWidth,
                fallbackImg.naturalHeight,
                centerShiftX,
                centerShiftY,
                fallbackImg.naturalWidth * ratio,
                fallbackImg.naturalHeight * ratio
              );
            }
          }
        }
      }

      rAFIdRef.current = requestAnimationFrame(render);
    };

    rAFIdRef.current = requestAnimationFrame(render);

    return () => {
      if (rAFIdRef.current !== null) {
        cancelAnimationFrame(rAFIdRef.current);
      }
    };
  }, [isMounted]);

  // ====================================================================
  // 4. TIMELINE PHASING OPACITY CALCULATIONS
  // ====================================================================
  // Phase 1 (Scroll 0% - 22%): Hero Introduction (Hi, I'm Said Khan & Stats)
  const heroOpacity = useMemo(() => {
    if (scrollProgress <= 0.20) return 1;
    if (scrollProgress >= 0.26) return 0;
    return 1 - (scrollProgress - 0.20) / (0.26 - 0.20);
  }, [scrollProgress]);

  // Phase 2 (Scroll 22% - 48%): Skills Spheres Network (14 3D Floating Orbs)
  const skillsOpacity = useMemo(() => {
    if (scrollProgress < 0.20) return 0;
    if (scrollProgress >= 0.20 && scrollProgress <= 0.26) {
      return (scrollProgress - 0.20) / (0.26 - 0.20);
    }
    if (scrollProgress > 0.26 && scrollProgress <= 0.46) return 1;
    if (scrollProgress > 0.46 && scrollProgress <= 0.52) {
      return 1 - (scrollProgress - 0.46) / (0.52 - 0.46);
    }
    return 0;
  }, [scrollProgress]);

  // Phase 3 (Scroll 48% - 74%): Dual-Arc Curved Cards Showcase (Curated Works)
  const showcaseOpacity = useMemo(() => {
    if (scrollProgress < 0.48) return 0;
    if (scrollProgress >= 0.48 && scrollProgress <= 0.54) {
      return (scrollProgress - 0.48) / (0.54 - 0.48);
    }
    if (scrollProgress > 0.54 && scrollProgress <= 0.72) return 1;
    if (scrollProgress > 0.72 && scrollProgress <= 0.78) {
      return 1 - (scrollProgress - 0.72) / (0.78 - 0.72);
    }
    return 0;
  }, [scrollProgress]);

  // Phase 4 (Scroll 74% - 100%): Final Call to Action & Conclusion
  const ctaOpacity = useMemo(() => {
    if (scrollProgress < 0.74) return 0;
    if (scrollProgress >= 0.74 && scrollProgress <= 0.82) {
      return (scrollProgress - 0.74) / (0.82 - 0.74);
    }
    return 1;
  }, [scrollProgress]);

  // Enterprise Active Navigation Section Tracker (UI/UX Design Protocol)
  const activeSection = useMemo(() => {
    if (scrollProgress < 0.25) return 'about';
    if (scrollProgress < 0.48) return 'skills';
    if (scrollProgress < 0.76) return 'projects';
    return 'contact';
  }, [scrollProgress]);

  // Programmatic scroll helper for navigation
  const scrollToPercent = useCallback((targetPercent: number) => {
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetPercent * docHeight,
      behavior: 'smooth',
    });
  }, []);

  // Consultation submission handler
  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationStatus('submitting');
    setTimeout(() => {
      setConsultationStatus('success');
      setTimeout(() => {
        setIsConsultationOpen(false);
        setConsultationStatus('idle');
      }, 2000);
    }, 1000);
  };

  return (
    <main className="relative bg-[#050505] text-white selection:bg-[#e11d48] selection:text-white overflow-x-hidden font-sans">
      {/* ================================================================
          SLOT 1: MINIMALIST FLOATING TOPBAR / NAVBAR (Z-Index: 50)
          ================================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 lg:px-20 py-4 sm:py-5 flex items-center justify-between transition-all bg-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)] pointer-events-auto">
        {/* Left Brand: Serif typography with subtitle matching user reference */}
        <div
          onClick={() => scrollToPercent(0)}
          className="cursor-pointer group select-none flex flex-col justify-center flex-shrink-0"
        >
          <span className="font-serif font-bold text-xl sm:text-2xl text-white tracking-normal group-hover:text-rose-200 transition-colors drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-tight">
            <KineticText>Said Khan</KineticText>
          </span>
          <span className="font-serif text-xs sm:text-[13px] text-zinc-300 font-normal tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] mt-0.5">
            <KineticText>AI Solutions Architect</KineticText>
          </span>
        </div>

        {/* Right Navigation & Consultation CTA Button */}
        <div className="flex items-center gap-5 sm:gap-8 md:gap-10 lg:gap-14">
          <nav
            aria-label="Main Navigation"
            role="navigation"
            className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-11"
          >
            <button
              onClick={() => scrollToPercent(0)}
              aria-current={activeSection === 'about' ? 'page' : undefined}
              className={`relative py-1 font-serif text-sm sm:text-base md:text-[17px] tracking-normal transition-all duration-200 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] ${
                activeSection === 'about'
                  ? 'text-white font-semibold'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <KineticText>Overview</KineticText>
              {activeSection === 'about' && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.9)] transition-all duration-300" />
              )}
            </button>
            <button
              onClick={() => scrollToPercent(0.35)}
              aria-current={activeSection === 'skills' ? 'page' : undefined}
              className={`relative py-1 font-serif text-sm sm:text-base md:text-[17px] tracking-normal transition-all duration-200 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] ${
                activeSection === 'skills'
                  ? 'text-white font-semibold'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <KineticText>Architecture</KineticText>
              {activeSection === 'skills' && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.9)] transition-all duration-300" />
              )}
            </button>
            <button
              onClick={() => scrollToPercent(0.62)}
              aria-current={activeSection === 'projects' ? 'page' : undefined}
              className={`relative py-1 font-serif text-sm sm:text-base md:text-[17px] tracking-normal transition-all duration-200 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] ${
                activeSection === 'projects'
                  ? 'text-white font-semibold'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <KineticText>Projects</KineticText>
              {activeSection === 'projects' && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.9)] transition-all duration-300" />
              )}
            </button>
          </nav>

          {/* Crimson Consultation Button */}
          <button
            onClick={() => setIsConsultationOpen(true)}
            className="font-serif px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-[#e11d48] hover:bg-[#f43f5e] rounded-[3px] shadow-[0_0_15px_rgba(225,29,72,0.45)] hover:shadow-[0_0_22px_rgba(225,29,72,0.75)] active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer whitespace-nowrap"
          >
            <KineticText>Consultation</KineticText>
          </button>
        </div>
      </header>

      {/* ================================================================
          PRELOADER STATUS PILL (Floats subtly without blocking viewport)
          ================================================================ */}
      {!isLoaded && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-3 transition-opacity duration-500 shadow-2xl pointer-events-none">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
          <span className="font-mono text-xs text-zinc-300 tracking-wider">
            Loading 4K Frames: {Math.round((loadedFramesCount / TOTAL_FRAMES) * 100)}%
          </span>
        </div>
      )}

      {/* ================================================================
          FIXED DEAD-CENTER HTML5 CANVAS (Contain-Fit 60FPS Video Scrub)
          ================================================================ */}
      <div
        aria-hidden="true"
        className="fixed inset-0 w-screen h-screen flex items-center justify-center pointer-events-none z-0"
      >
        <canvas
          ref={canvasRef}
          className="block max-w-full max-h-full pointer-events-none select-none"
        />
      </div>

      {/* Subtle bottom vignette to ensure ultra-crisp editorial reading */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      {/* ================================================================
          FIXED FLOATING NARRATIVE VIEWPORT (100% Transparent Over Portrait)
          ================================================================ */}
      <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between overflow-hidden">
        {/* Spacer for Topbar */}
        <div className="h-24 sm:h-28 w-full" />

        {/* Central Narrative Zone - aligned with topbar horizontal grid */}
        <div className="relative flex-1 w-full px-6 sm:px-12 lg:px-20 flex items-center">
          {/* ------------------------------------------------------------
              SLOT 2: HERO SECTION CONTENT (Scroll 0% - 25%)
              ------------------------------------------------------------ */}
          <section
            style={{
              opacity: heroOpacity,
              transform: `translateY(${(1 - heroOpacity) * -20}px)`,
              pointerEvents: heroOpacity > 0.05 ? 'auto' : 'none',
              transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
            }}
            className="absolute inset-0 px-6 sm:px-12 lg:px-20 flex items-center justify-between w-full"
          >
            {/* Left Column: Hero Headline, Narrative Bio, and CTA */}
            <div className="flex flex-col justify-center max-w-xl lg:max-w-2xl xl:max-w-3xl pointer-events-auto">
              {/* Headline matching image typography */}
              <h1 className="font-sans font-medium sm:font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] mb-4 sm:mb-5">
                <span className="block"><KineticText>Hi, I&apos;m</KineticText></span>
                <span className="block"><KineticText>Said Khan.</KineticText></span>
              </h1>

              {/* Narrative Bio Paragraphs */}
              <div className="space-y-3 sm:space-y-3.5 max-w-xl lg:max-w-2xl">
                <p className="text-sm sm:text-base md:text-lg lg:text-[18px] text-zinc-100 font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  <KineticText>I&apos;m an AI Engineer, AI Automation Expert, and Full-Stack Developer. I use AI and modern technology to turn ideas into practical, intelligent, and reliable digital solutions.</KineticText>
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[18px] text-zinc-100 font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  <KineticText>I build AI-powered software, automation systems, full-stack applications, and personal AI agents. What I enjoy most is understanding a real problem, finding a smarter approach, and turning that idea into something people can actually use.</KineticText>
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[18px] text-zinc-100 font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  <KineticText>Alongside software and AI, I have experience in Digital Marketing, which gives me a broader perspective on technology, business, and people. I believe great technology isn&apos;t just about making something work; it&apos;s about creating something that genuinely adds value.</KineticText>
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-[18px] text-zinc-100 font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  <KineticText>If you have an idea, I&apos;d love to help turn it into something real.</KineticText>
                </p>
              </div>

              {/* Mobile Compact Metrics (for small screens - Live DB / API Dynamic) */}
              <div className="md:hidden mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                {performanceStats.map((item, idx) => (
                  <React.Fragment key={item.id || idx}>
                    {idx > 0 && <div className="w-px h-6 bg-white/20" />}
                    <div>
                      <div className={`text-2xl font-light ${item.accentColor || 'text-rose-300'}`}>
                        {item.metric}
                      </div>
                      <div className="text-[11px] text-zinc-300">
                        {item.shortLabel || item.label}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right Column: Proven Performance Metrics (Live DB / API Dynamic) */}
            <div className="hidden md:flex flex-col justify-center max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg w-full ml-auto pointer-events-auto">
              <div className="border-l-[3px] border-rose-500 pl-6 sm:pl-8 lg:pl-10 py-2">
                {/* Section Header */}
                <span className="block font-sans text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-rose-400 mb-4 sm:mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  PROVEN PERFORMANCE
                </span>

                {/* Dynamically mapped performance stats from database/API */}
                {performanceStats.map((item, idx) => (
                  <div key={item.id || idx} className="group transition-transform duration-200 hover:translate-x-1.5">
                    <div
                      className={`font-sans font-light text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-none mb-1.5 drop-shadow-[0_2px_16px_rgba(244,63,94,0.4)] group-hover:drop-shadow-[0_4px_24px_rgba(244,63,94,0.65)] transition-all ${
                        item.accentColor || 'text-rose-300'
                      }`}
                    >
                      {item.metric}
                    </div>
                    <div className="text-white text-sm sm:text-base md:text-lg font-normal tracking-wide leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                      {item.label}
                    </div>
                    {idx < performanceStats.length - 1 && (
                      <div className="w-full h-px bg-white/20 my-4 sm:my-5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ------------------------------------------------------------
              SLOT 3: 3D FLOATING SKILL SPHERES CONSTELLATION (Scroll 20% - 48%)
              ------------------------------------------------------------ */}
          <section
            style={{
              opacity: skillsOpacity,
              transform: `translateY(${(1 - skillsOpacity) * 20}px)`,
              pointerEvents: skillsOpacity > 0.05 ? 'auto' : 'none',
              transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
            }}
            className="absolute inset-0 w-full h-full"
          >
            <SkillSpheresNetwork
              scrollProgress={scrollProgress}
              opacity={skillsOpacity}
            />
          </section>

          {/* ------------------------------------------------------------
              SLOT 4: DUAL-ARC CURVED CARDS SHOWCASE (Scroll 48% - 74%)
              Two curved lines of tilted cards on left and right, center showcase
              ------------------------------------------------------------ */}
          <section
            style={{
              opacity: showcaseOpacity,
              transform: `translateY(${(1 - showcaseOpacity) * 20}px)`,
              pointerEvents: showcaseOpacity > 0.05 ? 'auto' : 'none',
              transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
            }}
            className="absolute inset-0 w-full h-full"
          >
            <DualArcShowcase
              scrollProgress={scrollProgress}
              opacity={showcaseOpacity}
              onOpenConsultation={() => setIsConsultationOpen(true)}
            />
          </section>

          {/* ------------------------------------------------------------
              SLOT 5: ABOUT ME & CONTACT SECTION (Scroll 74% - 100%)
              ------------------------------------------------------------ */}
          <section
            style={{
              opacity: ctaOpacity,
              transform: `translateY(${(1 - ctaOpacity) * 20}px)`,
              pointerEvents: ctaOpacity > 0.05 ? 'auto' : 'none',
              transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
            }}
            className="absolute inset-0 w-full h-full pointer-events-auto"
          >
            <AboutContactSection />
          </section>
        </div>

        {/* ==============================================================
            BOTTOM TELEMETRY HUD (Frame Counter & Scrub Status)
            ============================================================== */}
        <footer className="w-full px-6 lg:px-12 py-5 flex items-center justify-between pointer-events-auto">
          {/* Left Telemetry */}
          <div className="flex items-center gap-4 font-mono text-[11px] text-zinc-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            <span className="hidden sm:inline-block">
              FRAME [ {String(activeFrameDisplay).padStart(2, '0')} /{' '}
              {TOTAL_FRAMES} ]
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline-block text-zinc-500">
              60FPS LERP SYNCHRONIZED
            </span>
          </div>

          {/* Center Scrub Progress Bar */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const target = clickX / rect.width;
              scrollToPercent(target);
            }}
            className="w-48 sm:w-64 h-1.5 bg-zinc-800/80 rounded-full overflow-hidden cursor-pointer relative group border border-white/10"
          >
            <div
              className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-75"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Right Status */}
          <div className="font-mono text-[11px] text-zinc-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            <span>SCRUB: {Math.round(scrollProgress * 100)}%</span>
          </div>
        </footer>
      </div>

      {/* ================================================================
          OUTER SCROLL TRACK (600vh Virtual Distance for Silky Scrubbing)
          ================================================================ */}
      <div
        className="min-h-[600vh] relative pointer-events-none"
        aria-hidden="true"
      />

      {/* ================================================================
          CONSULTATION MODAL (High-Converting Project Intake)
          ================================================================ */}
      {isConsultationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl">
            <button
              onClick={() => setIsConsultationOpen(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-zinc-900 border border-white/20 text-zinc-400 hover:text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <TechnicalBriefForm onSuccess={() => setIsConsultationOpen(false)} />
          </div>
        </div>
      )}
    </main>
  );
}
