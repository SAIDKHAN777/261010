import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SHOWCASE_ITEMS, ShowcaseItem } from '@/lib/showcaseData';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 1. Fetch What I Do items from Supabase what_i_do table
    let leftArcItems: ShowcaseItem[] = [];
    if (supabaseUrl && supabaseKey) {
      try {
        const widRes = await fetch(`${supabaseUrl}/rest/v1/what_i_do?order=display_order.asc`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          cache: 'no-store',
        });
        if (widRes.ok) {
          const widData = await widRes.json();
          if (Array.isArray(widData) && widData.length > 0) {
            leftArcItems = widData.map((row: any, idx: number) => ({
              id: row.id || `wid-${idx}`,
              side: 'left',
              title: row.title,
              category: row.category || 'Core Specialization',
              badge: row.badge || 'Active Service',
              color: row.color || '#f43f5e',
              iconName: row.icon_name || 'Bot',
              imageUrl: row.image_url || '',
              summary: row.summary || '',
              metric: row.metric || '100%',
              metricLabel: row.metric_label || 'Quality',
              techs: Array.isArray(row.techs) ? row.techs : ['AI', 'Engineering'],
              link: row.link || undefined,
              status: 'Active',
              displayOrder: row.display_order ?? idx + 1,
            }));
          }
        }
      } catch (e) {
        console.warn('Failed to fetch what_i_do:', e);
      }
    }

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
      console.warn('Failed to fetch projects:', e);
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
