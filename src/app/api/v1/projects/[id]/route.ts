import { defineHandler, readJsonBody } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  cuidSchema,
  updateProjectSchema,
} from "@/domain/project";
import { NotFoundError } from "@/lib/errors";

export const runtime = "nodejs";

export const GET = defineHandler<{ id: string }>(async (request, context) => {
  const { id } = await context.params!;
  cuidSchema.parse(id);

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  if (!project.published) {
    // Only authenticated admin can view unpublished projects
    try {
      await requireAdmin(request);
    } catch {
      throw new NotFoundError("Project not found");
    }
  }

  return new Response(JSON.stringify(project), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

export const PATCH = defineHandler<{ id: string }>(
  async (request, context) => {
    await requireAdmin(request);

    const { id } = await context.params!;
    cuidSchema.parse(id);

    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError("Project not found");
    }

    const rawBody = await readJsonBody(request);
    const data = updateProjectSchema.parse(rawBody);

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.summary !== undefined ? { summary: data.summary } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.tech_stack !== undefined ? { techStack: data.tech_stack } : {}),
        ...(data.repo_url !== undefined ? { repoUrl: data.repo_url ?? null } : {}),
        ...(data.live_url !== undefined ? { liveUrl: data.live_url ?? null } : {}),
        ...(data.cover_image_url !== undefined ? { coverImageUrl: data.cover_image_url } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
      },
    });

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
  { noStore: true }
);

export const DELETE = defineHandler<{ id: string }>(
  async (request, context) => {
    await requireAdmin(request);

    const { id } = await context.params!;
    cuidSchema.parse(id);

    // Idempotent deletion
    await prisma.project.deleteMany({
      where: { id },
    });

    return new Response(null, { status: 204 });
  },
  { noStore: true }
);
