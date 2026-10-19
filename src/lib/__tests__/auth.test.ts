import { describe, it, expect } from "vitest";

// Ensure mock environment variables
process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";
process.env.DIRECT_URL = "postgresql://user:pass@localhost:5432/db";
process.env.UPSTASH_REDIS_REST_URL = "https://test.upstash.io";
process.env.UPSTASH_REDIS_REST_TOKEN = "test-token";
process.env.IP_HASH_SALT = "a-very-long-secure-salt-for-hashing-ip-at-least-32-chars";
process.env.ADMIN_JWT_SECRET = "a-very-long-secure-secret-for-jwt-signing-at-least-32-chars";
process.env.ADMIN_JWT_ISSUER = "https://api.saidkhan.dev";
process.env.ADMIN_JWT_AUDIENCE = "https://saidkhan.dev";
process.env.RESEND_API_KEY = "re_test_key";
process.env.EMAIL_FROM = "test@saidkhan.dev";
process.env.TELEGRAM_BOT_TOKEN = "123:test_token";
process.env.TELEGRAM_ADMIN_CHAT_ID = "123456";
process.env.GEMINI_API_KEY = "test_gemini_key";
process.env.GEMINI_MODEL = "gemini-2.0-flash";
process.env.GEMINI_MAX_OUTPUT_TOKENS = "1024";
process.env.GEMINI_TEMPERATURE = "0.7";
process.env.PERSONA_BIO = "Test Bio";
process.env.PERSONA_PROJECTS_FALLBACK = "Test Projects";
process.env.PERSONA_BOOKING_URL = "https://cal.com/test";
process.env.PERSONA_TONE = "Professional";
process.env.ALLOWED_ORIGINS = "http://localhost:3000,https://saidkhan.dev";

import { issueAdminToken, verifyAdminToken, requireAdmin } from "../auth";
import { UnauthorizedError } from "../errors";

describe("Admin JWT Authentication Suite", () => {
  it("should issue and successfully verify a valid admin token", async () => {
    const token = await issueAdminToken({ expiresIn: "1h" });
    expect(typeof token).toBe("string");

    const payload = await verifyAdminToken(token);
    expect(payload.role).toBe("admin");
    expect(payload.iss).toBe("https://api.saidkhan.dev");
    expect(payload.aud).toBe("https://saidkhan.dev");
    expect(typeof payload.exp).toBe("number");
  });

  it("should reject tampered or invalid tokens", async () => {
    const validToken = await issueAdminToken({ expiresIn: "1h" });
    const tampered = validToken.substring(0, validToken.length - 5) + "abcde";

    await expect(verifyAdminToken(tampered)).rejects.toThrow(UnauthorizedError);
  });

  it("should reject tokens with wrong secret", async () => {
    const token = await issueAdminToken({
      secretOverride: "another-super-secret-key-that-is-at-least-32-chars-long",
    });

    await expect(verifyAdminToken(token)).rejects.toThrow(UnauthorizedError);
  });

  it("requireAdmin should extract Bearer token from headers", async () => {
    const token = await issueAdminToken();
    const req = new Request("http://localhost/api/admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = await requireAdmin(req);
    expect(payload.role).toBe("admin");
  });

  it("requireAdmin should throw on missing or malformed header", async () => {
    const req1 = new Request("http://localhost/api/admin");
    await expect(requireAdmin(req1)).rejects.toThrow(UnauthorizedError);

    const req2 = new Request("http://localhost/api/admin", {
      headers: { Authorization: "Basic dXNlcjpwYXNz" },
    });
    await expect(requireAdmin(req2)).rejects.toThrow(UnauthorizedError);
  });
});
