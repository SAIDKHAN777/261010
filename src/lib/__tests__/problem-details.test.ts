import { describe, it, expect } from "vitest";
import { parseProblemDetails } from "../problem-details";

describe("parseProblemDetails", () => {
  it("correctly parses RFC 9457 JSON response", async () => {
    const payload = {
      type: "https://api.saidkhan.dev/problems/rate-limit-exceeded",
      title: "Rate Limit Exceeded",
      status: 429,
      detail: "Too many requests. Please try again later.",
      instance: "/api/v1/contact",
      request_id: "req-12345",
      errors: [{ field: "email", message: "Rate limit hit" }],
    };

    const response = new Response(JSON.stringify(payload), {
      status: 429,
      headers: {
        "Content-Type": "application/problem+json",
        "Retry-After": "60",
      },
    });

    const parsed = await parseProblemDetails(response);
    expect(parsed.status).toBe(429);
    expect(parsed.type).toBe("https://api.saidkhan.dev/problems/rate-limit-exceeded");
    expect(parsed.title).toBe("Rate Limit Exceeded");
    expect(parsed.detail).toBe("Too many requests. Please try again later.");
    expect(parsed.requestId).toBe("req-12345");
    expect(parsed.retryAfterSeconds).toBe(60);
    expect(parsed.errors).toHaveLength(1);
  });

  it("gracefully falls back on non-JSON response body", async () => {
    const response = new Response("Bad Gateway", {
      status: 502,
      statusText: "Bad Gateway",
    });

    const parsed = await parseProblemDetails(response, "Service unavailable");
    expect(parsed.status).toBe(502);
    expect(parsed.title).toBe("Bad Gateway");
    expect(parsed.detail).toBe("Bad Gateway");
  });
});
