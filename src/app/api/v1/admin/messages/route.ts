import { z } from "zod";
import { defineHandler } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encodeCursor, decodeCursor } from "@/domain/pagination";
import { NotifyStatus, type Prisma } from "@prisma/client";

export const runtime = "nodejs";

const adminMessagesQuerySchema = z.object({
  page_size: z.coerce.number().int().min(1).max(100).default(20),
  page_token: z.string().optional(),
  status: z.nativeEnum(NotifyStatus).optional(),
});

export const GET = defineHandler(
  async (request) => {
    await requireAdmin(request);

    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    const query = adminMessagesQuerySchema.parse(searchParams);

    const where: Prisma.ContactMessageWhereInput = {};
    if (query.status) {
      where.notifyStatus = query.status;
    }

    if (query.page_token) {
      const cursor = decodeCursor(query.page_token);
      where.OR = [
        { createdAt: { lt: cursor.createdAt } },
        { createdAt: cursor.createdAt, id: { lt: cursor.id } },
      ];
    }

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: query.page_size + 1,
    });

    let nextPageToken: string | null = null;
    if (messages.length > query.page_size) {
      messages.pop();
      const last = messages[messages.length - 1];
      if (last) {
        nextPageToken = encodeCursor(last.createdAt, last.id);
      }
    }

    return new Response(
      JSON.stringify({
        items: messages,
        next_page_token: nextPageToken,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  },
  { noStore: true }
);
