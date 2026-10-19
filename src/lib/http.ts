import { BadRequestError, toProblemResponse } from "./errors";
import { getAllowedOriginsList } from "./env";

export const MAX_BODY_BYTES = 1_048_576; // 1 MiB

export interface HandlerContext<
  TParams = Record<string, string | string[] | undefined>,
> {
  params?: Promise<TParams>;
  requestId: string;
}

export interface DefineHandlerOptions {
  noStore?: boolean;
}

export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  if (!origin) {
    return {};
  }

  const allowedOrigins = getAllowedOriginsList();
  if (allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Allow-Credentials": "true",
      "Vary": "Origin",
    };
  }

  return {};
}

export async function readJsonBody<T = unknown>(request: Request): Promise<T> {
  if (request.bodyUsed) {
    throw new BadRequestError("Request body has already been consumed");
  }

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader !== null) {
    const parsedLength = parseInt(contentLengthHeader, 10);
    if (!Number.isNaN(parsedLength) && parsedLength > MAX_BODY_BYTES) {
      throw new BadRequestError("Request body exceeds maximum size of 1 MiB");
    }
  }

  if (!request.body) {
    throw new BadRequestError("Request body cannot be empty");
  }

  const reader = request.body.getReader();
  let totalBytes = 0;
  const chunks: Uint8Array[] = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > MAX_BODY_BYTES) {
          await reader.cancel("Request body exceeds maximum size of 1 MiB");
          throw new BadRequestError(
            "Request body exceeds maximum size of 1 MiB"
          );
        }
        chunks.push(value);
      }
    }
  } catch (err) {
    if (err instanceof BadRequestError) {
      throw err;
    }
    throw new BadRequestError("Failed to read request body stream");
  }

  if (chunks.length === 0) {
    throw new BadRequestError("Request body cannot be empty");
  }

  const buffer = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const text = new TextDecoder("utf-8").decode(buffer);

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new BadRequestError("Malformed JSON in request body");
  }
}

export function defineHandler<
  TParams = Record<string, string | string[] | undefined>,
>(
  handler: (
    request: Request,
    context: HandlerContext<TParams>
  ) => Promise<Response>,
  options?: DefineHandlerOptions
): (
  request: Request,
  rawContext?: any
) => Promise<Response> {
  return async (
    request: Request,
    rawContext?: any
  ): Promise<Response> => {
    const requestId = crypto.randomUUID();
    const corsHeaders = getCorsHeaders(request);

    let pathname = "/";
    try {
      pathname = new URL(request.url).pathname;
    } catch {
      // Fallback pathname
    }

    const isNoStore =
      Boolean(options?.noStore) ||
      pathname.includes("/admin") ||
      pathname.includes("/chat");

    if (request.method === "OPTIONS") {
      const headers = new Headers(corsHeaders);
      headers.set("x-request-id", requestId);
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      if (isNoStore) {
        headers.set("Cache-Control", "no-store");
      }
      return new Response(null, {
        status: 204,
        headers,
      });
    }

    const handlerContext: HandlerContext<TParams> = {
      params: rawContext?.params,
      requestId,
    };

    try {
      const response = await handler(request, handlerContext);

      const headers = new Headers(response.headers);
      headers.set("x-request-id", requestId);
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

      if (isNoStore) {
        headers.set("Cache-Control", "no-store");
      }

      for (const [key, value] of Object.entries(corsHeaders)) {
        if (!headers.has(key)) {
          headers.set(key, value);
        }
      }

      const body =
        response.status === 204 || response.status === 304
          ? null
          : response.body;

      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      const extraHeaders = new Headers(corsHeaders);
      if (isNoStore) {
        extraHeaders.set("Cache-Control", "no-store");
      }
      return toProblemResponse(error, pathname, requestId, extraHeaders);
    }
  };
}
