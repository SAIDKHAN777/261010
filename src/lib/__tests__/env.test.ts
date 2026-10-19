import { describe, it, expect } from "vitest";
import { envSchema, validateEnv, validateDatabaseEnv, validateDatabaseUrl } from "../env";

describe("Environment Schema Validation", () => {
  const validConfig = {
    DATABASE_URL: "postgresql://postgres:secret123@db.supabase.co:6543/postgres?pgbouncer=true",
    DIRECT_URL: "postgresql://postgres:secret123@db.supabase.co:5432/postgres",
    UPSTASH_REDIS_REST_URL: "https://test.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "test-token",
    IP_HASH_SALT: "a-very-long-secure-salt-for-hashing-ip-at-least-32-chars",
    ADMIN_JWT_SECRET: "a-very-long-secure-secret-for-jwt-signing-at-least-32-chars",
    ADMIN_JWT_ISSUER: "https://api.saidkhan.dev",
    ADMIN_JWT_AUDIENCE: "https://saidkhan.dev",
    RESEND_API_KEY: "re_test_key",
    EMAIL_FROM: "test@saidkhan.dev",
    TELEGRAM_BOT_TOKEN: "123:test_token",
    TELEGRAM_ADMIN_CHAT_ID: "123456",
    GEMINI_API_KEY: "test_gemini_key",
    GEMINI_MODEL: "gemini-2.0-flash",
    GEMINI_MAX_OUTPUT_TOKENS: 1024,
    GEMINI_TEMPERATURE: 0.7,
    PERSONA_BIO: "Test Bio",
    PERSONA_PROJECTS_FALLBACK: "Test Projects",
    PERSONA_BOOKING_URL: "https://cal.com/test",
    PERSONA_TONE: "Professional",
    ALLOWED_ORIGINS: "http://localhost:3000,https://saidkhan.dev",
  };

  it("should pass validation with complete valid config", () => {
    const result = envSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it("should reject wildcard in ALLOWED_ORIGINS", () => {
    const invalidConfig = {
      ...validConfig,
      ALLOWED_ORIGINS: "*",
    };
    const result = envSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should reject IP_HASH_SALT shorter than 32 chars", () => {
    const invalidConfig = {
      ...validConfig,
      IP_HASH_SALT: "short-salt",
    };
    const result = envSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should reject ADMIN_JWT_SECRET shorter than 32 chars", () => {
    const invalidConfig = {
      ...validConfig,
      ADMIN_JWT_SECRET: "short-secret",
    };
    const result = envSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it("should accept valid postgresql:// and postgres:// protocols", () => {
    expect(() =>
      validateDatabaseUrl("postgres://user:pass@localhost:5432/db", "DATABASE_URL")
    ).not.toThrow();
    expect(() =>
      validateDatabaseUrl("postgresql://user:pass@localhost:5432/db", "DIRECT_URL")
    ).not.toThrow();
  });

  it("should reject invalid protocols without leaking connection secrets", () => {
    expect(() =>
      validateDatabaseUrl("mysql://user:super_secret_password@localhost:3306/db", "DATABASE_URL")
    ).toThrowError(/protocol must be 'postgresql:' or 'postgres:'/);

    try {
      validateDatabaseUrl("mysql://user:super_secret_password@localhost:3306/db", "DATABASE_URL");
    } catch (err: any) {
      expect(err.message).not.toContain("super_secret_password");
    }
  });

  it("should reject invalid port numbers", () => {
    expect(() =>
      validateDatabaseUrl("postgresql://user:pass@localhost:99999/db", "DATABASE_URL")
    ).toThrowError(/port must be between 1 and 65535/);
  });

  it("should reject explicitly disabled SSL", () => {
    expect(() =>
      validateDatabaseUrl("postgresql://user:pass@localhost:5432/db?sslmode=disable", "DATABASE_URL")
    ).toThrowError(/SSL must not be explicitly disabled/);

    expect(() =>
      validateDatabaseUrl("postgresql://user:pass@localhost:5432/db?ssl=false", "DIRECT_URL")
    ).toThrowError(/SSL must not be explicitly disabled/);
  });

  it("should validate database env via validateDatabaseEnv helper", () => {
    const validated = validateDatabaseEnv({
      DATABASE_URL: "postgresql://user:pass@localhost:6543/db",
      DIRECT_URL: "postgresql://user:pass@localhost:5432/db",
    });
    expect(validated.DATABASE_URL).toBe("postgresql://user:pass@localhost:6543/db");
    expect(validated.DIRECT_URL).toBe("postgresql://user:pass@localhost:5432/db");
  });
});
