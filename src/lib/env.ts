import { z } from "zod";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // .env file might be absent or already loaded by runner
  }
}

export function validateDatabaseUrl(
  urlString: unknown,
  role: "DATABASE_URL" | "DIRECT_URL"
): string {
  if (!urlString || typeof urlString !== "string" || urlString.trim().length === 0) {
    throw new Error(`${role} is required and must be a non-empty string`);
  }

  const portMatch = urlString.match(/:([0-9]+)(?:\/|\?|#|$)/);
  if (portMatch) {
    const portNum = parseInt(portMatch[1], 10);
    if (isNaN(portNum) || portNum <= 0 || portNum > 65535) {
      throw new Error(`${role} port must be between 1 and 65535`);
    }
  }

  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    throw new Error(`${role} must be a valid URL`);
  }

  if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
    throw new Error(`${role} protocol must be 'postgresql:' or 'postgres:'`);
  }

  if (!parsed.hostname || parsed.hostname.trim().length === 0) {
    throw new Error(`${role} must have a valid hostname`);
  }

  if (parsed.port) {
    const port = parseInt(parsed.port, 10);
    if (isNaN(port) || port <= 0 || port > 65535) {
      throw new Error(`${role} port must be between 1 and 65535`);
    }
  }

  const sslMode = parsed.searchParams.get("sslmode")?.toLowerCase();
  const ssl = parsed.searchParams.get("ssl")?.toLowerCase();
  if (sslMode === "disable" || sslMode === "allow" || ssl === "false" || ssl === "0") {
    throw new Error(`${role} SSL must not be explicitly disabled`);
  }

  return urlString;
}

export function validateDatabaseEnv(
  input: Record<string, unknown> = process.env
): { DATABASE_URL: string; DIRECT_URL: string } {
  const dbUrl = validateDatabaseUrl(input.DATABASE_URL, "DATABASE_URL");
  const directUrl = validateDatabaseUrl(input.DIRECT_URL, "DIRECT_URL");
  return { DATABASE_URL: dbUrl, DIRECT_URL: directUrl };
}

function validateOriginsList(val: string): boolean {
  if (!val || val.includes("*")) {
    return false;
  }
  const origins = val
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (origins.length === 0) {
    return false;
  }

  for (const origin of origins) {
    if (origin.includes("*")) {
      return false;
    }
    try {
      const url = new URL(origin);
      if (
        (url.protocol !== "http:" && url.protocol !== "https:") ||
        url.origin !== origin
      ) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}

export const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .superRefine((val, ctx) => {
      try {
        validateDatabaseUrl(val, "DATABASE_URL");
      } catch (err: any) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: err.message,
        });
      }
    }),
  DIRECT_URL: z
    .string()
    .min(1, "DIRECT_URL is required")
    .superRefine((val, ctx) => {
      try {
        validateDatabaseUrl(val, "DIRECT_URL");
      } catch (err: any) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: err.message,
        });
      }
    }),

  UPSTASH_REDIS_REST_URL: z
    .string()
    .url("UPSTASH_REDIS_REST_URL must be a valid URL"),
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(1, "UPSTASH_REDIS_REST_TOKEN is required"),

  IP_HASH_SALT: z
    .string()
    .min(32, "IP_HASH_SALT must be at least 32 characters"),

  ADMIN_JWT_SECRET: z
    .string()
    .min(32, "ADMIN_JWT_SECRET must be at least 32 characters"),
  ADMIN_JWT_ISSUER: z.string().min(1, "ADMIN_JWT_ISSUER is required"),
  ADMIN_JWT_AUDIENCE: z.string().min(1, "ADMIN_JWT_AUDIENCE is required"),

  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  EMAIL_FROM: z.string().min(1, "EMAIL_FROM is required"),

  TELEGRAM_BOT_TOKEN: z.string().min(1, "TELEGRAM_BOT_TOKEN is required"),
  TELEGRAM_ADMIN_CHAT_ID: z.string().min(1, "TELEGRAM_ADMIN_CHAT_ID is required"),

  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  GEMINI_MODEL: z.string().min(1, "GEMINI_MODEL is required"),
  GEMINI_MAX_OUTPUT_TOKENS: z.coerce
    .number()
    .int("GEMINI_MAX_OUTPUT_TOKENS must be an integer")
    .positive("GEMINI_MAX_OUTPUT_TOKENS must be a positive integer"),
  GEMINI_TEMPERATURE: z.coerce
    .number()
    .min(0, "GEMINI_TEMPERATURE must be at least 0")
    .max(2, "GEMINI_TEMPERATURE cannot exceed 2"),

  PERSONA_BIO: z.string().min(1, "PERSONA_BIO is required"),
  PERSONA_PROJECTS_FALLBACK: z
    .string()
    .min(1, "PERSONA_PROJECTS_FALLBACK is required"),
  PERSONA_BOOKING_URL: z
    .string()
    .url("PERSONA_BOOKING_URL must be a valid URL"),
  PERSONA_TONE: z.string().min(1, "PERSONA_TONE is required"),

  ALLOWED_ORIGINS: z
    .string()
    .refine(
      (val) => !val.includes("*"),
      "Wildcard '*' is forbidden in ALLOWED_ORIGINS"
    )
    .refine(
      validateOriginsList,
      "ALLOWED_ORIGINS must be a comma-separated list of valid origins"
    ),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function resetEnvCache(): void {
  cachedEnv = null;
}

export function validateEnv(input: Record<string, unknown> = process.env): Env {
  const result = envSchema.safeParse(input);

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Environment validation failed: ${errorDetails}`);
  }

  if (input === process.env) {
    cachedEnv = result.data;
  }

  return result.data;
}

export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }
  return validateEnv(process.env);
}

export const env: Env = new Proxy({} as Env, {
  get(_target, prop: string | symbol) {
    const activeEnv = getEnv();
    return activeEnv[prop as keyof Env];
  },
  has(_target, prop: string | symbol) {
    const activeEnv = getEnv();
    return prop in activeEnv;
  },
  ownKeys(_target) {
    const activeEnv = getEnv();
    return Reflect.ownKeys(activeEnv);
  },
  getOwnPropertyDescriptor(_target, prop) {
    const activeEnv = getEnv();
    return Reflect.getOwnPropertyDescriptor(activeEnv, prop);
  },
});

export function getAllowedOriginsList(originsStr: string = env.ALLOWED_ORIGINS): string[] {
  return originsStr
    .split(",")
    .map((o) => o.trim())
    .filter((o) => o.length > 0);
}
