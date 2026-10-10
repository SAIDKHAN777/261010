// ======================================================================
// PROVEN PERFORMANCE METRICS SPECIFICATION & DATA STORE
// ----------------------------------------------------------------------
// Supports real-time database updates from PostgreSQL / Supabase
// ======================================================================

export interface PerformanceStatItem {
  id: string;
  metric: string; // e.g. "1+", "25+", "99.8%", "100%"
  label: string;  // e.g. "Projects Engineered & Delivered"
  shortLabel?: string; // e.g. "Projects Delivered" (for mobile)
  accentColor?: string; // e.g. "rose-500", "rose-300"
  displayOrder: number;
}

export const DEFAULT_PERFORMANCE_STATS: PerformanceStatItem[] = [
  {
    id: 'projects-delivered',
    metric: '1+',
    label: 'Projects Engineered & Delivered',
    shortLabel: 'Projects',
    accentColor: 'text-rose-500',
    displayOrder: 1,
  },
  {
    id: 'client-satisfaction',
    metric: '99.8%',
    label: 'Client Satisfaction Rate',
    shortLabel: 'Client Satisfaction',
    accentColor: 'text-rose-300',
    displayOrder: 2,
  },
  {
    id: 'uptime-success',
    metric: '100%',
    label: 'Delivery & Uptime Success',
    shortLabel: 'Uptime Success',
    accentColor: 'text-rose-300',
    displayOrder: 3,
  },
];
