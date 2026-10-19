export interface ParsedProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  requestId?: string;
  errors?: Array<{ field: string; message: string }>;
  retryAfterSeconds?: number;
}

/**
 * Parses an HTTP Response adhering to RFC 9457 Problem Details.
 * Safely handles fallback responses, text payloads, and network failures.
 */
export async function parseProblemDetails(
  response: Response,
  fallbackDetail = "An unexpected error occurred"
): Promise<ParsedProblemDetails> {
  const status = response.status;
  const retryHeader = response.headers.get("retry-after");
  const retryAfterSeconds = retryHeader ? parseInt(retryHeader, 10) : undefined;

  let bodyText = "";
  try {
    bodyText = await response.text();
  } catch {
    return {
      type: "about:blank",
      title: response.statusText || "Request Failed",
      status,
      detail: fallbackDetail,
      instance: "",
      retryAfterSeconds: isNaN(retryAfterSeconds ?? NaN) ? undefined : retryAfterSeconds,
    };
  }

  try {
    const json = JSON.parse(bodyText);
    return {
      type: typeof json.type === "string" ? json.type : "about:blank",
      title: typeof json.title === "string" ? json.title : response.statusText || "Error",
      status: typeof json.status === "number" ? json.status : status,
      detail: typeof json.detail === "string" ? json.detail : fallbackDetail,
      instance: typeof json.instance === "string" ? json.instance : "",
      requestId: typeof json.request_id === "string" ? json.request_id : undefined,
      errors: Array.isArray(json.errors) ? json.errors : undefined,
      retryAfterSeconds: isNaN(retryAfterSeconds ?? NaN) ? undefined : retryAfterSeconds,
    };
  } catch {
    return {
      type: "about:blank",
      title: response.statusText || "Error",
      status,
      detail: bodyText.trim().length > 0 ? bodyText.slice(0, 300) : fallbackDetail,
      instance: "",
      retryAfterSeconds: isNaN(retryAfterSeconds ?? NaN) ? undefined : retryAfterSeconds,
    };
  }
}
