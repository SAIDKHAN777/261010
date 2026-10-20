import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SHOWCASE_ITEMS, ShowcaseItem } from '@/lib/showcaseData';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch What I Do items directly from Supabase PostgreSQL database via Prisma
    let leftArcItems: ShowcaseItem[] = [];
    try {
      const widRows: any[] = await prisma.$queryRawUnsafe(`
        SELECT id, title, summary, image_url, badge, category, color, icon_name, metric, metric_label, techs, display_order 
        FROM what_i_do 
        ORDER BY display_order ASC
      `);

      if (Array.isArray(widRows) && widRows.length > 0) {
        leftArcItems = widRows.map((row: any, idx: number) => ({
          id: String(row.id || `wid-${idx}`),
          side: 'left',
          title: String(row.title || 'Specialized Service'),
          category: String(row.category || 'Core Specialization'),
          badge: String(row.badge || 'Active Service'),
          color: String(row.color || '#f43f5e'),
          iconName: String(row.icon_name || 'Bot'),
          imageUrl: String(row.image_url || ''),
          summary: String(row.summary || ''),
          metric: String(row.metric || '100%'),
          metricLabel: String(row.metric_label || 'Quality'),
          techs: Array.isArray(row.techs) && row.techs.length > 0 ? row.techs : ['AI', 'Engineering'],
          link: row.link ? String(row.link) : undefined,
          status: 'Active',
          displayOrder: typeof row.display_order === 'number' ? row.display_order : idx + 1,
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch what_i_do via Prisma:', e);
    }

    // Fallback only if database what_i_do table is empty
    if (leftArcItems.length === 0) {
      leftArcItems = DEFAULT_SHOWCASE_ITEMS.filter((item) => item.side === 'left');
    }

    // 2. Fetch Projects from Supabase projects table via Prisma
    let rightArcItems: ShowcaseItem[] = [];
    try {
      const dbProjects = await prisma.project.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
      });

      if (Array.isArray(dbProjects) && dbProjects.length > 0) {
        rightArcItems = dbProjects.map((p, idx) => ({
          id: p.id,
          side: 'right',
          title: p.title,
          category: 'Engineered System',
          badge: p.featured ? 'Featured Architecture' : 'Production Build',
          color: idx % 3 === 0 ? '#10b981' : idx % 3 === 1 ? '#0284c7' : '#8b5cf6',
          iconName: 'Workflow',
          imageUrl: p.coverImageUrl || '',
          summary: p.summary || p.description.slice(0, 160),
          metric: '99.9%',
          metricLabel: 'System SLA',
          techs: p.techStack && p.techStack.length > 0 ? p.techStack : ['Full-Stack', 'Next.js', 'AI Agents'],
          link: p.liveUrl || p.repoUrl || undefined,
          status: 'Live in Production',
          displayOrder: 7 + idx,
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch projects via Prisma:', e);
    }

    if (rightArcItems.length === 0) {
      rightArcItems = DEFAULT_SHOWCASE_ITEMS.filter((item) => item.side === 'right');
    }

    const combinedItems: ShowcaseItem[] = [...leftArcItems, ...rightArcItems];

    return NextResponse.json(
      {
        success: true,
        source: 'database',
        count: combinedItems.length,
        items: combinedItems,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, source: 'fallback', items: DEFAULT_SHOWCASE_ITEMS },
      { status: 200 }
    );
  }
}
