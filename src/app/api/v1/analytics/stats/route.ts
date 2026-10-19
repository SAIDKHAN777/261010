import { defineHandler } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export const GET = defineHandler(
  async (request) => {
    await requireAdmin(request);

    const [totalStat, countryStats] = await Promise.all([
      prisma.downloadStat.findUnique({
        where: { id: "total" },
      }),
      prisma.countryStat.findMany({
        orderBy: { downloads: "desc" },
      }),
    ]);

    return new Response(
      JSON.stringify({
        totalDownloads: totalStat?.total ?? 0,
        countries: countryStats.map((c) => ({
          country_code: c.countryCode,
          downloads: c.downloads,
        })),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  },
  { noStore: true }
);
