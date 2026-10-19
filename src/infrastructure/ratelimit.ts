import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";
import {
  RateLimitExceededError,
  ServiceUnavailableError,
} from "../lib/errors";

let contactRatelimit: Ratelimit | null = null;
function getContactRatelimit(): Ratelimit {
  if (!contactRatelimit) {
    contactRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      prefix: "rl:contact",
      analytics: false,
    });
  }
  return contactRatelimit;
}

let chatRatelimit: Ratelimit | null = null;
function getChatRatelimit(): Ratelimit {
  if (!chatRatelimit) {
    chatRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      prefix: "rl:chat",
      analytics: false,
    });
  }
  return chatRatelimit;
}

let cvDownloadRatelimit: Ratelimit | null = null;
function getCvDownloadRatelimit(): Ratelimit {
  if (!cvDownloadRatelimit) {
    cvDownloadRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 h"),
      prefix: "rl:cv",
      analytics: false,
    });
  }
  return cvDownloadRatelimit;
}

export async function checkContactRateLimit(ipHash: string): Promise<void> {
  try {
    const result = await getContactRatelimit().limit(ipHash);
    if (!result.success) {
      throw new RateLimitExceededError(
        "Contact submission rate limit exceeded. Please try again later."
      );
    }
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      throw error;
    }
    console.error("[RateLimit] Upstash Redis error for contact:", error);
    throw new ServiceUnavailableError(
      "Service temporarily unavailable. Please try again."
    );
  }
}

export async function checkChatRateLimit(ipHash: string): Promise<void> {
  try {
    const result = await getChatRatelimit().limit(ipHash);
    if (!result.success) {
      throw new RateLimitExceededError(
        "AI chat rate limit exceeded (10 messages/hour). Please try again later."
      );
    }
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      throw error;
    }
    console.error("[RateLimit] Upstash Redis error for chat:", error);
    throw new ServiceUnavailableError(
      "AI assistant is temporarily unavailable. Please try again later."
    );
  }
}

export async function checkCvDownloadRateLimit(ipHash: string): Promise<void> {
  try {
    const result = await getCvDownloadRatelimit().limit(ipHash);
    if (!result.success) {
      throw new RateLimitExceededError(
        "CV download rate limit exceeded. Please try again later."
      );
    }
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      throw error;
    }
    console.error("[RateLimit] Upstash Redis error for CV download:", error);
    throw new ServiceUnavailableError(
      "Download service temporarily unavailable. Please try again later."
    );
  }
}
