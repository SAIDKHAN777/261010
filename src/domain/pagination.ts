import { BadRequestError } from "../lib/errors";

export interface KeysetCursor {
  createdAt: Date;
  id: string;
}

export function encodeCursor(createdAt: Date, id: string): string {
  const payload = `${createdAt.toISOString()}|${id}`;
  return Buffer.from(payload, "utf-8").toString("base64url");
}

export function decodeCursor(token: string): KeysetCursor {
  if (!token || typeof token !== "string") {
    throw new BadRequestError("Pagination token must be a non-empty string");
  }

  try {
    const raw = Buffer.from(token, "base64url").toString("utf-8");
    const parts = raw.split("|");
    if (parts.length !== 2) {
      throw new Error("Invalid cursor format");
    }

    const [isoDate, id] = parts;
    if (!isoDate || !id || id.trim().length === 0) {
      throw new Error("Empty cursor date or id");
    }

    const createdAt = new Date(isoDate);
    if (Number.isNaN(createdAt.getTime()) || isoDate !== createdAt.toISOString()) {
      throw new Error("Invalid cursor timestamp");
    }

    return { createdAt, id: id.trim() };
  } catch {
    throw new BadRequestError("Invalid or malformed pagination token");
  }
}
