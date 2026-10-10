import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DEFAULT_CLIENT_LOGOS, ClientLogoItem } from '@/lib/clientsData';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // 1. Fetch live client companies from Supabase PostgreSQL database via Prisma
    const dbClients = await prisma.clientCompany.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });

    if (Array.isArray(dbClients) && dbClients.length > 0) {
      const mappedDbClients: ClientLogoItem[] = dbClients.map((c, idx) => ({
        id: c.id,
        name: c.name,
        logoUrl: c.logoUrl,
        imageUrl: c.logoUrl,
        tagline: 'Trusted Enterprise Partner',
        category: 'Client Partner',
        badge: 'Verified Client',
        metric: 'Enterprise System',
        displayOrder: c.order ?? idx,
      }));

      // Combine real database clients at the front with default logos
      const combined = [
        ...mappedDbClients,
        ...DEFAULT_CLIENT_LOGOS.filter(
          (def) => !mappedDbClients.some((m) => m.name.toLowerCase() === def.name.toLowerCase())
        ),
      ];

      return NextResponse.json({
        success: true,
        source: 'database',
        count: combined.length,
        data: combined,
      });
    }

    // Fallback to high-fidelity defaults if database table is empty
    return NextResponse.json({
      success: true,
      source: 'default',
      data: DEFAULT_CLIENT_LOGOS,
    });
  } catch (error: any) {
    console.warn('[Clients API] Database query fallback:', error?.message || error);
    return NextResponse.json({
      success: true,
      source: 'fallback',
      data: DEFAULT_CLIENT_LOGOS,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.name && body.logoUrl) {
      const newClient = await prisma.clientCompany.create({
        data: {
          name: body.name,
          logoUrl: body.logoUrl,
          published: body.published ?? true,
          order: body.order ?? 0,
        },
      });

      return NextResponse.json({ success: true, client: newClient });
    }

    return NextResponse.json({ success: false, error: 'Name and logoUrl are required' }, { status: 400 });
  } catch (err: any) {
    console.error('[Clients API POST Error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
