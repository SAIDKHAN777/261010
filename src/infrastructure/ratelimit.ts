import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";
import {
  RateLimitExceededError,
  ServiceUnavailableError,
} from "../lib/errors";

const contactRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "rl:contact",
  analytics: false,
});

const chatRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  prefix: "rl:chat",
  analytics: false,
});

const cvDownloadRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 h"),
  prefix: "rl:cv",
  analytics: false,
});

export async function checkContactRateLimit(ipHash: string): Promise<void> {
  try {
    const result = await contactRatelimit.limit(ipHash);
    if (!result.success) {
      throw new RateLimitExceededError(
        "Contact submission rate limit exceeded. Please try again later."
      );
    }
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      throw error;
    }
    // Fail open: log safe operational metadata and continue
    console.error("[RateLimit] Contact rate limit unavailable, failing open");
  }
}

export async function checkChatRateLimit(ipHash: string): Promise<void> {
  try {
    const result = await chatRatelimit.limit(ipHash);
    if (!result.success) {
      throw new RateLimitExceededError(
        "Chat rate limit exceeded. Please try again later."
      );
    }
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      throw error;
    }
    // Fail closed: log safe operational metadata and reject with 503
    console.error("[RateLimit] Chat rate limit unavailable, failing closed");
    throw new ServiceUnavailableError(
      "Chat service is temporarily unavailable. Please try again shortly."
    );
  }
}

export async function checkCvDownloadRateLimit(ipHash: string): Promise<void> {
  try {
    const result = await cvDownloadRatelimit.limit(ipHash);
    if (!result.success) {
      throw new RateLimitExceededError(
        "Download rate limit exceeded. Please try again later."
      );
    }
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      throw error;
    }
    console.error("[RateLimit] CV download rate limit unavailable, failing open");
  }
}
