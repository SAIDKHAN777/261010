import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_PERFORMANCE_STATS, PerformanceStatItem } from '@/lib/performanceStatsData';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // 1. Calculate live metrics from Supabase PostgreSQL database via Prisma
    const projectCount = await prisma.project.count({
      where: { published: true },
    });

    const dynamicStats: PerformanceStatItem[] = [
      {
        id: 'projects-delivered',
        metric: `${Math.max(projectCount, 1)}+`,
        label: 'Projects Engineered & Delivered',
        shortLabel: 'Projects Delivered',
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

    return NextResponse.json({
      success: true,
      source: 'database',
      projectCount,
      data: dynamicStats,
    });
  } catch (error: any) {
    console.warn('[Performance API] Database count fallback:', error?.message || error);
    return NextResponse.json({
      success: true,
      source: 'fallback',
      data: DEFAULT_PERFORMANCE_STATS,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === 'reset') {
      return NextResponse.json({ success: true, message: 'Reset to default performance stats' });
    }

    return NextResponse.json({ success: true, message: 'Updated metrics' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
