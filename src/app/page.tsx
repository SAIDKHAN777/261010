import { prisma } from "@/lib/prisma";
import { encodeCursor } from "@/domain/pagination";
import { PortfolioShell } from "@/components/PortfolioShell";
import type { ProjectData } from "@/components/projects/ProjectModal";
import type { ClientCompanyLogo } from "@/components/sections/ClientCompanyLogos";

export const dynamic = "force-dynamic";

export default async function Page() {
  let initialProjects: ProjectData[] = [];
  let nextPageToken: string | null = null;
  let totalDownloads = 0;
  let liveProjectsCount = 100;
  let clientCompanies: ClientCompanyLogo[] = [];

  try {
    const [rawProjects, stat, rawProjectsCount, rawCompanies] = await Promise.all([
      prisma.project.findMany({
        where: { published: true },
        orderBy: [
          { createdAt: "desc" },
          { id: "desc" },
        ],
        take: 6 + 1,
      }),
      prisma.downloadStat.findUnique({
        where: { id: "total" },
      }),
      prisma.project.count({
        where: { published: true },
      }),
      prisma.clientCompany.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    ]);

    if (stat) {
      totalDownloads = stat.total;
    }

    if (typeof rawProjectsCount === "number" && rawProjectsCount > 0) {
      liveProjectsCount = rawProjectsCount;
    }

    if (Array.isArray(rawCompanies) && rawCompanies.length > 0) {
      clientCompanies = rawCompanies.map((c) => ({
        id: c.id,
        name: c.name,
        logoUrl: c.logoUrl,
      }));
    }

    if (rawProjects.length > 6) {
      rawProjects.pop();
      const last = rawProjects[rawProjects.length - 1];
      if (last) {
        nextPageToken = encodeCursor(last.createdAt, last.id);
      }
    }

    initialProjects = rawProjects.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      description: p.description,
      techStack: p.techStack,
      coverImageUrl: p.coverImageUrl,
      repoUrl: p.repoUrl,
      liveUrl: p.liveUrl,
      featured: p.featured,
      createdAt: p.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("[SSR Page] Failed to fetch live data via Prisma:", error);
    // Graceful fallbacks: liveProjectsCount defaults to 100, clientCompanies defaults to []
  }

  return (
    <PortfolioShell
      initialProjects={initialProjects}
      initialNextPageToken={nextPageToken}
      totalDownloads={totalDownloads}
      liveProjectsCount={liveProjectsCount}
      logos={clientCompanies}
    />
  );
}
