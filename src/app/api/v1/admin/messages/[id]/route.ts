import { defineHandler } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cuidSchema } from "@/domain/project";
import { NotFoundError } from "@/lib/errors";

export const runtime = "nodejs";

export const GET = defineHandler<{ id: string }>(
  async (request, context) => {
    await requireAdmin(request);

    const { id } = await context.params!;
    cuidSchema.parse(id);

    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundError("Contact message not found");
    }

    return new Response(JSON.stringify(message), {
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
    await prisma.contactMessage.deleteMany({
      where: { id },
    });

    return new Response(null, { status: 204 });
  },
  { noStore: true }
);
