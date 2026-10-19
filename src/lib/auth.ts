import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { env } from "./env";
import { UnauthorizedError } from "./errors";

export interface AdminTokenPayload extends JWTPayload {
  role: "admin";
  iss: string;
  aud: string;
  exp: number;
}

export async function verifyAdminToken(
  token: string,
  secretOverride?: string
): Promise<AdminTokenPayload> {
  if (!token || typeof token !== "string") {
    throw new UnauthorizedError("Token must be a non-empty string");
  }

  const secretString = secretOverride ?? env.ADMIN_JWT_SECRET;
  const secretKey = new TextEncoder().encode(secretString);

  try {
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: env.ADMIN_JWT_ISSUER,
      audience: env.ADMIN_JWT_AUDIENCE,
      algorithms: ["HS256"],
    });

    if (typeof payload.exp !== "number" || Number.isNaN(payload.exp)) {
      throw new UnauthorizedError("Token is missing required expiration claim");
    }

    if (payload.role !== "admin") {
      throw new UnauthorizedError("Token role must be admin");
    }

    return payload as AdminTokenPayload;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError("Invalid or expired authentication token");
  }
}

export async function requireAdmin(request: Request): Promise<AdminTokenPayload> {
  const authHeader =
    request.headers.get("authorization") ??
    request.headers.get("Authorization");

  if (!authHeader) {
    throw new UnauthorizedError("Missing Authorization header");
  }

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    throw new UnauthorizedError("Authorization header must use Bearer scheme");
  }

  const token = parts[1];
  if (!token) {
    throw new UnauthorizedError("Missing Bearer authentication token");
  }

  return verifyAdminToken(token);
}

export async function issueAdminToken(options?: {
  expiresIn?: string | number;
  secretOverride?: string;
}): Promise<string> {
  const secretString = options?.secretOverride ?? env.ADMIN_JWT_SECRET;
  const secretKey = new TextEncoder().encode(secretString);
  const expiry = options?.expiresIn ?? "30d";

  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(env.ADMIN_JWT_ISSUER)
    .setAudience(env.ADMIN_JWT_AUDIENCE)
    .setExpirationTime(expiry)
    .sign(secretKey);
}
