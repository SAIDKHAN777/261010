// ======================================================================
// SHOWCASE & PORTFOLIO DATA CONFIGURATION (Database-Ready Schema)
// Easily updated via API, CMS, Supabase, Prisma, or MongoDB
// ======================================================================

export interface ShowcaseItem {
  id: string;
  side: 'left' | 'right';
  title: string;
  category: string;
  badge: string;
  color: string;
  iconName?: string;
  imageUrl?: string; // Database photo/thumbnail URL (Supabase, S3, Cloudinary, etc.)
  summary: string;
  metric: string;
  metricLabel: string;
  techs: string[];
  link?: string;
  status?: string;
  displayOrder?: number;
}

export const DEFAULT_SHOWCASE_ITEMS: ShowcaseItem[] = [
  // --------------------------------------------------------------------
  // LEFT ARC: WHAT I DO (AI, Agentic Systems & Advanced Capabilities)
  // --------------------------------------------------------------------
  {
    id: 'omni-agent',
    side: 'left',
    title: 'OmniAgent Core',
    category: 'Autonomous Multi-Agent',
    badge: 'Flagship Architecture',
    color: '#10b981',
    iconName: 'Bot',
    imageUrl: '', // Can be updated with an image URL from database
    summary:
      'Distributed multi-agent orchestration framework featuring cognitive reasoning, dynamic tool execution, memory persistence, and auto-fallback routing.',
    metric: '120ms',
    metricLabel: 'P99 Tool Resolution',
    techs: ['Python', 'LangChain', 'FastAPI', 'Qdrant', 'Claude 3.5'],
    status: 'In Production',
    displayOrder: 1,
  },
  {
    id: 'neural-flow',
    side: 'left',
    title: 'NeuralFlow Engine',
    category: 'RAG & Cognitive Search',
    badge: 'Enterprise Intelligence',
    color: '#06b6d4',
    iconName: 'Cpu',
    imageUrl: '',
    summary:
      'High-throughput vector search and contextual retrieval pipeline processing millions of unstructured documents with sub-second hybrid reranking.',
    metric: '4.2M+',
    metricLabel: 'Vectors Indexed',
    techs: ['Pinecone', 'OpenAI', 'Next.js', 'PostgreSQL', 'Docker'],
    status: 'Client Deployed',
    displayOrder: 2,
  },
  {
    id: 'agentic-ops',
    side: 'left',
    title: 'AgenticOps Control',
    category: 'AI Pipeline Monitoring',
    badge: 'Autonomous Reliability',
    color: '#8b5cf6',
    iconName: 'Activity',
    imageUrl: '',
    summary:
      'Real-time observability platform tracking LLM token consumption, latency regressions, hallucination scoring, and automatic prompt tuning.',
    metric: '99.98%',
    metricLabel: 'Eval Accuracy',
    techs: ['LangSmith', 'OpenTelemetry', 'TypeScript', 'Tailwind', 'Go'],
    status: 'Live Analytics',
    displayOrder: 3,
  },
  {
    id: 'code-pilot',
    side: 'left',
    title: 'Synthetix Code AI',
    category: 'Code Intelligence',
    badge: 'Developer Automation',
    color: '#ec4899',
    iconName: 'Code2',
    imageUrl: '',
    summary:
      'Context-aware code refactoring and test-generation agent hooked directly into GitHub CI/CD webhooks with automated PR reviews.',
    metric: '68%',
    metricLabel: 'Review Time Saved',
    techs: ['Node.js', 'AST Parser', 'GitHub Actions', 'Claude Sonnet'],
    status: 'Internal Tool',
    displayOrder: 4,
  },
  {
    id: 'deep-crawl',
    side: 'left',
    title: 'DeepCrawl Intelligence',
    category: 'Autonomous Web Agents',
    badge: 'Data Synthesis',
    color: '#3b82f6',
    iconName: 'Globe',
    imageUrl: '',
    summary:
      'Headless browser swarm navigating complex single-page apps, bypassing CAPTCHAs, and structuring web data into clean GraphQL schemas.',
    metric: '180k/hr',
    metricLabel: 'Pages Synthesized',
    techs: ['Playwright', 'Puppeteer', 'Redis', 'Python', 'FastAPI'],
    status: 'Cluster Active',
    displayOrder: 5,
  },
  {
    id: 'sentinel-guard',
    side: 'left',
    title: 'Sentinel Guard AI',
    category: 'AI Safety & Red Teaming',
    badge: 'Security Architecture',
    color: '#14b8a6',
    iconName: 'Zap',
    imageUrl: '',
    summary:
      'Real-time prompt injection firewall and PII token masking proxy safeguarding production LLM deployments from adversarial exploits.',
    metric: '0.001%',
    metricLabel: 'Adversarial Leakage',
    techs: ['Rust', 'Wasm', 'FastAPI', 'Regex Engine', 'PyTorch'],
    status: 'Production Hardened',
    displayOrder: 6,
  },

  // --------------------------------------------------------------------
  // RIGHT ARC: PROJECTS (Engineered Platforms, Automations & SaaS)
  // --------------------------------------------------------------------
  {
    id: 'n8n-hub',
    side: 'right',
    title: 'n8n Enterprise Hub',
    category: 'Autonomous Workflow Engine',
    badge: 'Event Orchestration',
    color: '#ea4c89',
    iconName: 'Workflow',
    imageUrl: '',
    summary:
      'Scalable event-driven n8n workflow cluster connecting 200+ enterprise apps, Stripe billing webhooks, CRM sync, and LLM triage routing.',
    metric: '50,000+',
    metricLabel: 'Daily Invocations',
    techs: ['n8n', 'PostgreSQL', 'Docker', 'Webhooks', 'Redis'],
    status: 'High Throughput',
    displayOrder: 7,
  },
  {
    id: 'cloud-saas',
    side: 'right',
    title: 'CloudScale SaaS Platform',
    category: 'Next-Gen Web Platform',
    badge: 'Full-Stack Architecture',
    color: '#0284c7',
    iconName: 'Layers',
    imageUrl: '',
    summary:
      'Modern multi-tenant web application featuring RBAC security, server-side caching, automated PDF reports, and real-time Stripe checkout.',
    metric: '99.99%',
    metricLabel: 'Uptime SLA',
    techs: ['Next.js 15', 'React 19', 'Tailwind', 'Supabase', 'Stripe'],
    status: 'Active Subscribers',
    displayOrder: 8,
  },
  {
    id: 'autonomous-crm',
    side: 'right',
    title: 'Autonomous CRM Core',
    category: 'AI Pipeline & Enrichment',
    badge: 'Revenue Operations',
    color: '#10b981',
    iconName: 'TrendingUp',
    imageUrl: '',
    summary:
      'Automated sales intelligence pipeline that enriches incoming leads, predicts deal closing probabilities, and writes personalized outbound briefs.',
    metric: '3.4x',
    metricLabel: 'Conversion Uplift',
    techs: ['Python', 'PostgreSQL', 'FastAPI', 'Redis', 'OpenAI'],
    status: 'Client Proven',
    displayOrder: 9,
  },
  {
    id: 'web3-deck',
    side: 'right',
    title: 'Realtime Telemetry Deck',
    category: 'High-Frequency Analytics',
    badge: 'Sub-Second Dashboard',
    color: '#8b5cf6',
    iconName: 'Globe',
    imageUrl: '',
    summary:
      'Sub-second real-time streaming telemetry and financial dashboard visualizing high-volume event streams with WebGL hardware acceleration.',
    metric: '100k+',
    metricLabel: 'Events / Sec',
    techs: ['TypeScript', 'WebGL', 'WebSockets', 'Tailwind', 'Canvas'],
    status: 'Realtime Live',
    displayOrder: 10,
  },
  {
    id: 'sync-pulse',
    side: 'right',
    title: 'SyncPulse Event Stream',
    category: 'Distributed Message Broker',
    badge: 'Enterprise Backend',
    color: '#f59e0b',
    iconName: 'Database',
    imageUrl: '',
    summary:
      'Distributed pub/sub event pipeline with guaranteed at-least-once delivery, dead-letter automatic retries, and Prometheus metrics monitoring.',
    metric: '0.00%',
    metricLabel: 'Message Drop Rate',
    techs: ['Kafka', 'Docker', 'Go', 'Redis', 'Kubernetes'],
    status: 'Cluster Verified',
    displayOrder: 11,
  },
  {
    id: 'omni-edge',
    side: 'right',
    title: 'OmniEdge API Mesh',
    category: 'Edge Computing Infrastructure',
    badge: 'Ultra-Low Latency',
    color: '#f97316',
    iconName: 'Sparkles',
    imageUrl: '',
    summary:
      'Globally distributed edge compute API running on Cloudflare Workers with geo-distributed database replication and instant caching.',
    metric: '<25ms',
    metricLabel: 'Global P99 Latency',
    techs: ['Cloudflare Workers', 'GraphQL', 'TypeScript', 'Prisma'],
    status: 'Worldwide Deployed',
    displayOrder: 12,
  },
];
