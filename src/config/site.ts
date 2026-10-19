/**
 * Public Site Configuration & Grounded Constants
 * Safe for consumption across Server and Client Components.
 * Strictly decoupled from server-only environment secrets.
 */

export const SITE_CONFIG = {
  name: "Said Khan",
  title: "AI Engineer, AI Automation Expert & Full-Stack Developer",
  roleTitle: "AI Solutions Architect & Full-Stack Systems Engineer",
  tagline: "Architecting practical AI systems, intelligent workflow automation, and reliable full-stack applications.",
  domain: "https://saidkhan.dev",
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL ||
    "https://cal.com/saidkhan/architecture-consultation",
  navItems: [
    { label: "Overview", href: "#home" },
    { label: "Architecture", href: "#architecture" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],
  quickPrompts: [
    {
      id: "rate-limiting",
      label: "Distributed Rate Limiting",
      prompt: "Explain how Said architected the distributed sliding-window rate limiting system with Upstash Redis.",
    },
    {
      id: "madrasa-erp",
      label: "Madrasa ERP Architecture",
      prompt: "How did Said design the concurrency control and data isolation architecture for the Madrasa Management ERP?",
    },
    {
      id: "ai-agents",
      label: "Autonomous Agent Runtimes",
      prompt: "What are Said Khan's architectural philosophies and design patterns for building autonomous AI agent workflows?",
    },
  ] as const,
  cvAvailableNotice: "Architecture CV is available upon request for institutional clients & enterprise partners.",
  status: {
    availability: "Available for AI Engineering, Automation & Full-Stack Systems",
    indicator: "active",
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
