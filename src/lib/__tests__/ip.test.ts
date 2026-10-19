import { describe, it, expect, beforeEach } from "vitest";

// Set mock environment variables for test execution
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

import { extractClientIp, hashIp, extractCountryCode, getClientIpIdentity } from "../ip";

describe("IP Privacy & Extraction Utilities", () => {
  it("should extract IP from x-real-ip header if present", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "203.0.113.195" },
    });
    expect(extractClientIp(req)).toBe("203.0.113.195");
  });

  it("should fallback to 127.0.0.1 when headers are missing", () => {
    const req = new Request("http://localhost");
    expect(extractClientIp(req)).toBe("127.0.0.1");
  });

  it("should consistently hash IP using HMAC-SHA256", () => {
    const hash1 = hashIp("192.168.1.1", "custom-salt-of-at-least-32-characters-length");
    const hash2 = hashIp("192.168.1.1", "custom-salt-of-at-least-32-characters-length");
    const hash3 = hashIp("192.168.1.2", "custom-salt-of-at-least-32-characters-length");

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1).toHaveLength(64); // SHA-256 hex output length
  });

  it("should extract and normalize 2-letter ISO country code", () => {
    const req1 = new Request("http://localhost", {
      headers: { "x-vercel-ip-country": "bd" },
    });
    expect(extractCountryCode(req1)).toBe("BD");

    const req2 = new Request("http://localhost", {
      headers: { "x-vercel-ip-country": "INVALID" },
    });
    expect(extractCountryCode(req2)).toBe("XX");

    const req3 = new Request("http://localhost");
    expect(extractCountryCode(req3)).toBe("XX");

    const req4 = new Request("http://localhost", {
      headers: { "x-vercel-ip-country": "ZZ" },
    });
    expect(extractCountryCode(req4)).toBe("XX");
  });
});
