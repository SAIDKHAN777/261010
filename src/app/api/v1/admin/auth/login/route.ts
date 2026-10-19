import { NextResponse } from "next/server";
import { issueAdminToken, verifyAdminToken } from "@/lib/auth";
import { env } from "@/lib/env";
import { getCorsHeaders } from "@/lib/http";
import { UnauthorizedError } from "@/lib/errors";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const cors = getCorsHeaders(request);
  let body: { secret?: string } = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: cors }
    );
  }

  const { secret } = body;

  if (!secret || typeof secret !== "string" || secret.trim() !== env.ADMIN_JWT_SECRET.trim()) {
    return NextResponse.json(
      { error: "Invalid admin secret key provided." },
      { status: 401, headers: cors }
    );
  }

  // Issue 7-day session token
  const token = await issueAdminToken({ expiresIn: "7d" });

  const response = NextResponse.json(
    {
      success: true,
      token,
      expiresIn: "7d",
      message: "Admin authentication successful. Session active.",
    },
    { status: 200, headers: cors }
  );

  return response;
}

export async function GET(request: Request) {
  const cors = getCorsHeaders(request);
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: cors }
    );
  }

  const token = authHeader.substring(7).trim();

  try {
    const payload = await verifyAdminToken(token);
    return NextResponse.json(
      {
        authenticated: true,
        role: payload.role,
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
      },
      { status: 200, headers: cors }
    );
  } catch {
    return NextResponse.json(
      { authenticated: false, error: "Token invalid or expired" },
      { status: 401, headers: cors }
    );
  }
}
