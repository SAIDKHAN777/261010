import { defineHandler, readJsonBody } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  projectQuerySchema,
  createProjectSchema,
} from "@/domain/project";
import { encodeCursor, decodeCursor } from "@/domain/pagination";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export const GET = defineHandler(async (request) => {
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());
  const query = projectQuerySchema.parse(searchParams);

  const isAsc = query.order_by === "created_at_asc";
  const where: Prisma.ProjectWhereInput = {
    published: true,
    ...(query.tech_stack && query.tech_stack.length > 0
      ? { techStack: { hasSome: query.tech_stack } }
      : {}),
  };

  if (query.page_token) {
    const cursor = decodeCursor(query.page_token);
    if (isAsc) {
      where.OR = [
        { createdAt: { gt: cursor.createdAt } },
        { createdAt: cursor.createdAt, id: { gt: cursor.id } },
      ];
    } else {
      where.OR = [
        { createdAt: { lt: cursor.createdAt } },
        { createdAt: cursor.createdAt, id: { lt: cursor.id } },
      ];
    }
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: [
      { createdAt: isAsc ? "asc" : "desc" },
      { id: isAsc ? "asc" : "desc" },
    ],
    take: query.page_size + 1,
  });

  let nextPageToken: string | null = null;
  if (projects.length > query.page_size) {
    projects.pop();
    const lastItem = projects[projects.length - 1];
    if (lastItem) {
      nextPageToken = encodeCursor(lastItem.createdAt, lastItem.id);
    }
  }

  return new Response(
    JSON.stringify({
      items: projects,
      next_page_token: nextPageToken,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
});

export const POST = defineHandler(
  async (request) => {
    await requireAdmin(request);

    const rawBody = await readJsonBody(request);
    const data = createProjectSchema.parse(rawBody);

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        description: data.description,
        techStack: data.tech_stack,
        repoUrl: data.repo_url ?? null,
        liveUrl: data.live_url ?? null,
        coverImageUrl: data.cover_image_url ?? null,
        featured: data.featured,
        published: data.published,
      },
    });

    return new Response(JSON.stringify(project), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  },
  { noStore: true }
);
