import { defineHandler, readJsonBody } from "@/lib/http";
import { getClientIpIdentity } from "@/lib/ip";
import { checkChatRateLimit } from "@/infrastructure/ratelimit";
import { chatRequestSchema } from "@/domain/chat";
import { prisma } from "@/lib/prisma";
import { buildSystemInstruction } from "@/lib/persona";
import { streamGeminiChat } from "@/infrastructure/gemini";
import { ServiceUnavailableError } from "@/lib/errors";

export const runtime = "nodejs";

export const POST = defineHandler(
  async (request, context) => {
    const ipHash = getClientIpIdentity(request);
    await checkChatRateLimit(ipHash);

    const rawBody = await readJsonBody(request);
    const { messages } = chatRequestSchema.parse(rawBody);

    // Fetch published projects dynamically for grounding
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    const systemInstruction = buildSystemInstruction(projects);

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 30_000);

    let geminiStream;
    try {
      geminiStream = await streamGeminiChat(
        messages,
        systemInstruction,
        abortController.signal
      );
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("[Chat] Failed to initialize Gemini stream");
      throw new ServiceUnavailableError(
        "AI upstream generation service is currently unavailable"
      );
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of geminiStream) {
            if (chunk.text) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ text: chunk.text })}\n\n`
                )
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("[ChatStream] Upstream generation interrupted");
          const errorPayload = {
            type: "https://api.saidkhan.dev/problems/service-unavailable",
            title: "Service Unavailable",
            status: 503,
            detail: "AI upstream generation interrupted",
            instance: "/api/v1/chat",
            request_id: context.requestId,
          };
          controller.enqueue(
            encoder.encode(
              `event: error\ndata: ${JSON.stringify(errorPayload)}\n\n`
            )
          );
          controller.close();
        } finally {
          clearTimeout(timeoutId);
        }
      },
      cancel() {
        clearTimeout(timeoutId);
        abortController.abort();
      },
    });

    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform, no-store",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  },
  { noStore: true }
);
