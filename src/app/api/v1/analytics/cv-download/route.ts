import { defineHandler } from "@/lib/http";
import { getClientIpIdentity, extractCountryCode } from "@/lib/ip";
import { checkCvDownloadRateLimit } from "@/infrastructure/ratelimit";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export const POST = defineHandler(async (request) => {
  const ipHash = getClientIpIdentity(request);
  await checkCvDownloadRateLimit(ipHash);

  const countryCode = extractCountryCode(request);

  await prisma.$transaction([
    prisma.downloadStat.upsert({
      where: { id: "total" },
      update: { total: { increment: 1 } },
      create: { id: "total", total: 1 },
    }),
    prisma.countryStat.upsert({
      where: { countryCode },
      update: { downloads: { increment: 1 } },
      create: { countryCode, downloads: 1 },
    }),
  ]);

  return new Response(null, { status: 204 });
});
