import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SHOWCASE_ITEMS, ShowcaseItem } from '@/lib/showcaseData';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // 1. Fetch published projects from Supabase PostgreSQL database via Prisma
    const dbProjects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    if (Array.isArray(dbProjects) && dbProjects.length > 0) {
      const mappedDbProjects: ShowcaseItem[] = dbProjects.map((p, idx) => ({
        id: p.id,
        side: 'right', // Right arc: Projects
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

      // Keep the Left Arc capabilities (omni-agent, neural-flow, agentic-ops, etc.)
      const leftArcItems = DEFAULT_SHOWCASE_ITEMS.filter((item) => item.side === 'left');
      
      // Combine DB projects into the right arc
      const combinedItems: ShowcaseItem[] = [
        ...leftArcItems,
        ...mappedDbProjects,
        // Include remaining default right arc items that don't collide
        ...DEFAULT_SHOWCASE_ITEMS.filter(
          (item) => item.side === 'right' && !mappedDbProjects.some((dp) => dp.title.toLowerCase() === item.title.toLowerCase())
        ),
      ];

      return NextResponse.json(
        {
          success: true,
          source: 'database',
          count: combinedItems.length,
          items: combinedItems,
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
          },
        }
      );
    }

    // Default to high-fidelity showcase items
    return NextResponse.json(
      { success: true, source: 'default', items: DEFAULT_SHOWCASE_ITEMS },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        },
      }
    );
  } catch (error: any) {
    console.warn('[Showcase API] Database fetch fallback to default:', error?.message || error);
    return NextResponse.json(
      { success: true, source: 'fallback', items: DEFAULT_SHOWCASE_ITEMS },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (payload.title && payload.summary) {
      const slug = (payload.slug || payload.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const project = await prisma.project.create({
        data: {
          title: payload.title,
          slug,
          summary: payload.summary,
          description: payload.description || payload.summary,
          techStack: Array.isArray(payload.techs) ? payload.techs : [],
          coverImageUrl: payload.imageUrl || null,
          liveUrl: payload.link || null,
          featured: payload.featured ?? false,
          published: payload.published ?? true,
        },
      });

      return NextResponse.json({ success: true, project });
    }

    return NextResponse.json({ success: false, error: 'Title and summary are required' }, { status: 400 });
  } catch (err: any) {
    console.error('[Showcase API POST Error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
