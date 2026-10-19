import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  RateLimitExceededError,
  InternalServerError,
  ServiceUnavailableError,
  buildProblemDetails,
  createProblemResponse,
  toProblemResponse,
} from "../errors";

describe("RFC 7807 AppError and Subclasses", () => {
  it("should create AppError with default mapping", () => {
    const err = new AppError(400, "Bad payload");
    expect(err.status).toBe(400);
    expect(err.slug).toBe("bad-request");
    expect(err.title).toBe("Bad Request");
    expect(err.message).toBe("Bad payload");
  });

  it("should instantiate specialized errors correctly", () => {
    expect(new BadRequestError().status).toBe(400);
    expect(new UnauthorizedError().status).toBe(401);
    expect(new ForbiddenError().status).toBe(403);
    expect(new NotFoundError().status).toBe(404);
    expect(new ConflictError().status).toBe(409);
    expect(new ValidationError().status).toBe(422);
    expect(new RateLimitExceededError().status).toBe(429);
    expect(new InternalServerError().status).toBe(500);
    expect(new ServiceUnavailableError().status).toBe(503);
  });

  it("should build ProblemDetails conforming to RFC 7807", () => {
    const details = buildProblemDetails(
      422,
      "Invalid field",
      "/api/contact",
      "req-123",
      [{ field: "email", message: "Invalid email" }]
    );
    expect(details.status).toBe(422);
    expect(details.title).toBe("Validation Error");
    expect(details.type).toBe("https://api.saidkhan.dev/problems/validation-error");
    expect(details.instance).toBe("/api/contact");
    expect(details.request_id).toBe("req-123");
    expect(details.errors).toEqual([{ field: "email", message: "Invalid email" }]);
  });

  it("createProblemResponse should return proper headers and body", async () => {
    const res = createProblemResponse(404, "Not Found", "/api/item", "req-999");
    expect(res.status).toBe(404);
    expect(res.headers.get("Content-Type")).toBe("application/problem+json");
    expect(res.headers.get("x-request-id")).toBe("req-999");
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");

    const json = await res.json();
    expect(json.status).toBe(404);
    expect(json.detail).toBe("Not Found");
  });

  it("toProblemResponse should map ZodError cleanly to 422", async () => {
    const schema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
    });
    const parsed = schema.safeParse({ name: "A", email: "not-an-email" });
    expect(parsed.success).toBe(false);

    if (!parsed.success) {
      const res = toProblemResponse(parsed.error, "/api/test", "req-zod");
      expect(res.status).toBe(422);
      const json = await res.json();
      expect(json.errors).toHaveLength(2);
      expect(json.errors[0].field).toBe("name");
      expect(json.errors[1].field).toBe("email");
    }
  });

  it("toProblemResponse should never leak internal 500 error stack traces", async () => {
    const nativeError = new Error("Database password leaked in connection string!");
    const res = toProblemResponse(nativeError, "/api/secret", "req-500");
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.detail).toBe("An internal server error occurred");
    expect(json.errors).toBeUndefined();
    expect(JSON.stringify(json)).not.toContain("password leaked");
  });
});
