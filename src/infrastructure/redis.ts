import { Redis } from "@upstash/redis";
import { env } from "../lib/env";

let redisInstance: Redis | null = null;

export function getRedis(): Redis {
  if (!redisInstance) {
    redisInstance = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redisInstance;
}

export const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    const client = getRedis();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
