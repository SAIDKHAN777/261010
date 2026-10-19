import { ZodError } from "zod";

export interface FieldError {
  field: string;
  message: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  request_id: string;
  errors?: FieldError[];
}

export const PROBLEM_STATUS_MAP: Record<
  number,
  { slug: string; title: string }
> = {
  400: { slug: "bad-request", title: "Bad Request" },
  401: { slug: "unauthorized", title: "Unauthorized" },
  403: { slug: "forbidden", title: "Forbidden" },
  404: { slug: "not-found", title: "Not Found" },
  409: { slug: "conflict", title: "Conflict" },
  422: { slug: "validation-error", title: "Validation Error" },
  429: { slug: "rate-limit-exceeded", title: "Rate Limit Exceeded" },
  500: { slug: "internal-server-error", title: "Internal Server Error" },
  503: { slug: "service-unavailable", title: "Service Unavailable" },
};

export class AppError extends Error {
  public readonly status: number;
  public readonly slug: string;
  public readonly title: string;
  public readonly errors?: FieldError[];

  constructor(
    status: number,
    detail: string,
    errors?: FieldError[],
    customTitle?: string
  ) {
    super(detail);
    this.name = "AppError";
    this.status = status;
    const mapping = PROBLEM_STATUS_MAP[status] ?? {
      slug: status >= 500 ? "internal-server-error" : "bad-request",
      title: status >= 500 ? "Internal Server Error" : "Bad Request",
    };
    this.slug = mapping.slug;
    this.title = customTitle ?? mapping.title;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(detail = "The request is malformed or invalid", errors?: FieldError[]) {
    super(400, detail, errors);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(detail = "Authentication is required to access this resource") {
    super(401, detail);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(detail = "You do not have permission to access this resource") {
    super(403, detail);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(detail = "The requested resource was not found") {
    super(404, detail);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(detail = "The request could not be completed due to a conflict") {
    super(409, detail);
    this.name = "ConflictError";
  }
}

export class ValidationError extends AppError {
  constructor(detail = "Validation failed for the submitted data", errors?: FieldError[]) {
    super(422, detail, errors);
    this.name = "ValidationError";
  }
}

export class RateLimitExceededError extends AppError {
  constructor(detail = "Too many requests. Please try again later.") {
    super(429, detail);
    this.name = "RateLimitExceededError";
  }
}

export class InternalServerError extends AppError {
  constructor(detail = "An internal server error occurred") {
    super(500, detail);
    this.name = "InternalServerError";
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(detail = "The service is temporarily unavailable") {
    super(503, detail);
    this.name = "ServiceUnavailableError";
  }
}

export function buildProblemDetails(
  status: number,
  detail: string,
  instance: string,
  requestId: string,
  errors?: FieldError[]
): ProblemDetails {
  const mapping = PROBLEM_STATUS_MAP[status] ?? {
    slug: status >= 500 ? "internal-server-error" : "bad-request",
    title: status >= 500 ? "Internal Server Error" : "Bad Request",
  };

  const problem: ProblemDetails = {
    type: `https://api.saidkhan.dev/problems/${mapping.slug}`,
    title: mapping.title,
    status,
    detail,
    instance,
    request_id: requestId,
  };

  if (errors && errors.length > 0) {
    problem.errors = errors;
  }

  return problem;
}

export function createProblemResponse(
  status: number,
  detail: string,
  instance: string,
  requestId: string,
  errors?: FieldError[],
  extraHeaders?: HeadersInit
): Response {
  const problem = buildProblemDetails(
    status,
    detail,
    instance,
    requestId,
    errors
  );

  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/problem+json");
  headers.set("x-request-id", requestId);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return new Response(JSON.stringify(problem), {
    status,
    headers,
  });
}

export function toProblemResponse(
  error: unknown,
  instance: string,
  requestId: string,
  extraHeaders?: HeadersInit
): Response {
  if (error instanceof AppError) {
    return createProblemResponse(
      error.status,
      error.message,
      instance,
      requestId,
      error.errors,
      extraHeaders
    );
  }

  if (error instanceof ZodError) {
    const fieldErrors: FieldError[] = error.issues.map((issue) => ({
      field: issue.path.join(".") || "root",
      message: issue.message,
    }));

    return createProblemResponse(
      422,
      "Validation failed for the submitted data",
      instance,
      requestId,
      fieldErrors,
      extraHeaders
    );
  }

  // Safe internal server error fallback: never leak internal exception details
  return createProblemResponse(
    500,
    "An internal server error occurred",
    instance,
    requestId,
    undefined,
    extraHeaders
  );
}
