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
process.env.PERSONA_BIO = "Said is an experienced software engineer";
process.env.PERSONA_PROJECTS_FALLBACK = "Built multiple scalable web apps";
process.env.PERSONA_BOOKING_URL = "https://cal.com/saidkhan";
process.env.PERSONA_TONE = "Professional and concise";
process.env.ALLOWED_ORIGINS = "http://localhost:3000,https://saidkhan.dev";

import { buildSystemInstruction, type PersonaProjectGrounding } from "../persona";

describe("AI Persona & System Instruction Builder", () => {
  it("should inject fallback projects when no dynamic projects provided", () => {
    const instruction = buildSystemInstruction([], {
      PERSONA_BIO: "Said is an experienced software engineer",
      PERSONA_PROJECTS_FALLBACK: "Built multiple scalable web apps",
      PERSONA_BOOKING_URL: "https://cal.com/saidkhan",
      PERSONA_TONE: "Professional and concise",
    });
    expect(instruction).toContain("Said is an experienced software engineer");
    expect(instruction).toContain("Built multiple scalable web apps");
    expect(instruction).toContain("https://cal.com/saidkhan");
    expect(instruction).toContain("Professional and concise");
    expect(instruction).not.toContain("{{BIO}}");
    expect(instruction).not.toContain("{{PROJECTS_FALLBACK}}");
  });

  it("should ground dynamic projects when provided", () => {
    const dynamicProjects: PersonaProjectGrounding[] = [
      {
        title: "Distributed AI Pipeline",
        summary: "High throughput inference platform",
        description: "Built with Node.js and Gemini 2.0",
        techStack: ["TypeScript", "Next.js", "PostgreSQL"],
        liveUrl: "https://ai.example.com",
        repoUrl: "https://github.com/example/ai",
      },
    ];

    const instruction = buildSystemInstruction(dynamicProjects);
    expect(instruction).toContain("Project 1: Distributed AI Pipeline");
    expect(instruction).toContain("Summary: High throughput inference platform");
    expect(instruction).toContain("Tech Stack: TypeScript, Next.js, PostgreSQL");
    expect(instruction).toContain("Live URL: https://ai.example.com");
    expect(instruction).toContain("Repository: https://github.com/example/ai");
  });

  it("should throw error if an unresolved template token remains", () => {
    expect(() =>
      buildSystemInstruction([], {
        PERSONA_BIO: "{{BIO}} infinite loop",
      })
    ).toThrow(/unresolved/i);
  });
});
