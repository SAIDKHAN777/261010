import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminToken } from "./src/lib/auth";
import { getCorsHeaders } from "./src/lib/http";
import { buildProblemDetails } from "./src/lib/errors";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Layer 1 authentication check for admin routes
  if (pathname.startsWith("/api/v1/admin") || pathname.startsWith("/api/admin")) {
    if (request.method === "OPTIONS") {
      return NextResponse.next();
    }

    if (
      pathname === "/api/v1/admin/auth/login" ||
      pathname === "/api/admin/auth/login"
    ) {
      return NextResponse.next();
    }

    const authHeader = request.headers.get("authorization");
    const requestId = crypto.randomUUID();
    const cors = getCorsHeaders(request);

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      const problem = buildProblemDetails(
        401,
        "Authentication is required to access admin endpoints",
        pathname,
        requestId
      );

      const headers = new Headers(cors);
      headers.set("Content-Type", "application/problem+json");
      headers.set("x-request-id", requestId);
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      headers.set("Cache-Control", "no-store");

      return new NextResponse(JSON.stringify(problem), {
        status: 401,
        headers,
      });
    }

    const token = authHeader.substring(7).trim();

    try {
      await verifyAdminToken(token);
    } catch {
      const problem = buildProblemDetails(
        401,
        "Invalid or expired admin authentication token",
        pathname,
        requestId
      );

      const headers = new Headers(cors);
      headers.set("Content-Type", "application/problem+json");
      headers.set("x-request-id", requestId);
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      headers.set("Cache-Control", "no-store");

      return new NextResponse(JSON.stringify(problem), {
        status: 401,
        headers,
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/v1/admin/:path*", "/api/admin/:path*"],
};
