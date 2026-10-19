import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCorsHeaders } from "@/lib/http";
import path from "node:path";
import fs from "node:fs/promises";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MiB
const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
]);

const EXTENSION_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  const cors = getCorsHeaders(request);

  try {
    await requireAdmin(request);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized: Admin session required." },
      { status: 401, headers: cors }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to parse form-data payload." },
      { status: 400, headers: cors }
    );
  }

  const file = formData.get("file") as File | null;
  const projectSlug = formData.get("projectSlug") as string | null;

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: "No image file provided in form-data ('file')." },
      { status: 400, headers: cors }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File size exceeds maximum permitted limit of 10 MiB (Received ${(file.size / (1024 * 1024)).toFixed(2)} MiB).` },
      { status: 400, headers: cors }
    );
  }

  const mimeType = file.type.toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return NextResponse.json(
      { error: `Unsupported image MIME type: ${mimeType}. Permitted: PNG, JPG, JPEG, WEBP, SVG, GIF.` },
      { status: 400, headers: cors }
    );
  }

  const extension = EXTENSION_MAP[mimeType] || "png";
  const sanitizedOriginal = file.name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 30);

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const basePrefix = projectSlug
    ? projectSlug.replace(/[^a-z0-9-]/g, "")
    : sanitizedOriginal || "upload";

  const fileName = `${basePrefix}-${timestamp}-${randomSuffix}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, Buffer.from(bytes));
  } catch (err: any) {
    return NextResponse.json(
      { error: `Failed to write file to storage: ${err.message}` },
      { status: 500, headers: cors }
    );
  }

  const relativeUrl = `/uploads/${fileName}`;
  let projectUpdated = false;

  if (projectSlug && projectSlug.trim().length > 0) {
    try {
      const existing = await prisma.project.findUnique({
        where: { slug: projectSlug.trim() },
      });

      if (existing) {
        await prisma.project.update({
          where: { slug: projectSlug.trim() },
          data: { coverImageUrl: relativeUrl },
        });
        projectUpdated = true;
      }
    } catch (dbErr: any) {
      console.error("[Upload API] Failed to update project in database:", dbErr);
    }
  }

  return NextResponse.json(
    {
      success: true,
      url: relativeUrl,
      fileName,
      size: file.size,
      mimeType,
      projectSlug: projectSlug || null,
      projectUpdated,
      message: projectUpdated
        ? `Image uploaded and set as cover for project '${projectSlug}'.`
        : "Image uploaded successfully to portfolio assets.",
    },
    { status: 201, headers: cors }
  );
}

export async function GET(request: Request) {
  const cors = getCorsHeaders(request);

  try {
    await requireAdmin(request);
  } catch {
    return NextResponse.json(
      { error: "Unauthorized: Admin session required." },
      { status: 401, headers: cors }
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");

  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const files = await fs.readdir(uploadDir);

    const fileDetails = await Promise.all(
      files
        .filter((name) => name !== ".gitkeep")
        .map(async (name) => {
          const stats = await fs.stat(path.join(uploadDir, name));
          return {
            name,
            url: `/uploads/${name}`,
            size: stats.size,
            createdAt: stats.birthtime.toISOString(),
          };
        })
    );

    // Sort newest first
    fileDetails.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(
      {
        files: fileDetails,
        total: fileDetails.length,
      },
      { status: 200, headers: cors }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Failed to list files: ${err.message}` },
      { status: 500, headers: cors }
    );
  }
}
