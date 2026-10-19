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

import { readJsonBody, getCorsHeaders, defineHandler } from "../http";
import { BadRequestError } from "../errors";

describe("HTTP Utilities and defineHandler Wrapper", () => {
  it("readJsonBody should parse valid JSON", async () => {
    const payload = { name: "Alice", message: "Hello" };
    const req = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const parsed = await readJsonBody<typeof payload>(req);
    expect(parsed).toEqual(payload);
  });

  it("readJsonBody should throw on empty or malformed body", async () => {
    const reqEmpty = new Request("http://localhost", { method: "POST" });
    await expect(readJsonBody(reqEmpty)).rejects.toThrow(BadRequestError);

    const reqMalformed = new Request("http://localhost", {
      method: "POST",
      body: "{ not valid json ",
    });
    await expect(readJsonBody(reqMalformed)).rejects.toThrow(BadRequestError);
  });

  it("getCorsHeaders should whitelist allowed origins", () => {
    const reqAllowed = new Request("http://localhost", {
      headers: { Origin: "https://saidkhan.dev" },
    });
    const headers = getCorsHeaders(reqAllowed);
    expect(headers["Access-Control-Allow-Origin"]).toBe("https://saidkhan.dev");

    const reqDisallowed = new Request("http://localhost", {
      headers: { Origin: "https://malicious-site.com" },
    });
    const emptyHeaders = getCorsHeaders(reqDisallowed);
    expect(emptyHeaders["Access-Control-Allow-Origin"]).toBeUndefined();
  });

  it("defineHandler should handle preflight OPTIONS with 204", async () => {
    const handler = defineHandler(async () => new Response("OK"));
    const req = new Request("http://localhost/api/test", {
      method: "OPTIONS",
      headers: { Origin: "https://saidkhan.dev" },
    });

    const res = await handler(req);
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://saidkhan.dev");
    expect(res.headers.get("x-request-id")).toBeDefined();
  });

  it("defineHandler should catch AppError and format as RFC 7807 response", async () => {
    const handler = defineHandler(async () => {
      throw new BadRequestError("Invalid parameter supplied");
    });
    const req = new Request("http://localhost/api/test", { method: "GET" });

    const res = await handler(req);
    expect(res.status).toBe(400);
    expect(res.headers.get("Content-Type")).toBe("application/problem+json");
    const json = await res.json();
    expect(json.status).toBe(400);
    expect(json.detail).toBe("Invalid parameter supplied");
  });
});
