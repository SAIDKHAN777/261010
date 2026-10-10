// ======================================================================
// CLIENT LOGOS & TRUST BAR DATA SPECIFICATION
// ----------------------------------------------------------------------
// Supports real-time database updates from PostgreSQL / Supabase
// ======================================================================

export interface ClientLogoItem {
  id: string;
  name: string;
  logoUrl?: string;
  imageUrl?: string;
  tagline: string;
  category: string;
  badge?: string;
  metric?: string;
  websiteUrl?: string;
  displayOrder?: number;
}

export const DEFAULT_CLIENT_LOGOS: ClientLogoItem[] = [
  {
    id: 'synthetix-ai',
    name: 'Synthetix AI',
    tagline: 'Autonomous Multi-Agent Swarms',
    category: 'AI Enterprise',
    badge: 'Enterprise Partner',
    metric: '120k+ Daily Queries',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    displayOrder: 1,
  },
  {
    id: 'novaflow-labs',
    name: 'NovaFlow Labs',
    tagline: 'Event-Driven Workflow Automation',
    category: 'n8n Ecosystem',
    badge: 'Automation Client',
    metric: '4.8x Efficiency',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    displayOrder: 2,
  },
  {
    id: 'hyperscale-cloud',
    name: 'HyperScale Cloud',
    tagline: 'Distributed Serverless Engine',
    category: 'Next-Gen Infra',
    badge: 'Cloud Platform',
    metric: '99.99% SLA',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    displayOrder: 3,
  },
  {
    id: 'nexus-robotics',
    name: 'Nexus Robotics',
    tagline: 'Industrial Vision & Edge AI',
    category: 'Robotics & ML',
    badge: 'AI Systems',
    metric: 'Zero-Latency Edge',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    displayOrder: 4,
  },
  {
    id: 'aura-global',
    name: 'Aura Global',
    tagline: 'Performance Growth Operations',
    category: 'Growth Ops',
    badge: 'Marketing Client',
    metric: '2.8M Reach',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    displayOrder: 5,
  },
  {
    id: 'pulsestream',
    name: 'PulseStream',
    tagline: 'High-Throughput Kafka Stream',
    category: 'Enterprise Backend',
    badge: 'Backend Architecture',
    metric: '50k+ Evt/Sec',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    displayOrder: 6,
  },
  {
    id: 'omniedge-ai',
    name: 'OmniEdge AI',
    tagline: 'Sub-20ms Model Ingestion',
    category: 'Edge Computing',
    badge: 'Global Deploy',
    metric: '<18ms Latency',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    displayOrder: 7,
  },
  {
    id: 'vanguard-fin',
    name: 'Vanguard FinTech',
    tagline: 'Streaming Financial Telemetry',
    category: 'Fintech Platform',
    badge: 'Security Verified',
    metric: 'SOC-2 Compliant',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    displayOrder: 8,
  },
];
