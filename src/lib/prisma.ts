import { PrismaClient } from "@prisma/client";
import { validateDatabaseEnv } from "./env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  validateDatabaseEnv();
  return (
    globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["warn", "error"]
          : ["error"],
    })
  );
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = createPrismaClient();
    if (!globalForPrisma.prisma && process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
