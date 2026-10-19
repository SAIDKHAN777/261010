import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface VerifiedProjectPayload {
  title: string;
  slug: string;
  summary: string;
  description: string;
  techStack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  coverImageUrl: string | null;
  featured: boolean;
  published: boolean;
}

/**
 * ABSOLUTE ZERO-DRIFT & SEED DATA TRUTH POLICY (Section 20 & 21):
 *
 * The AI MUST NOT fabricate Said Khan's project facts (summaries, descriptions, metrics, URLs).
 * Required database fields (`summary`, `description`) must NEVER be populated with fake placeholders ("TBD", "Lorem ipsum", "").
 *
 * Only records with complete, verified payloads from Said Khan are seeded here.
 */
const VERIFIED_PROJECTS: VerifiedProjectPayload[] = [];

const KNOWN_PROJECT_SLUGS = [
  "autonomous-ai-agent-framework",
  "ecommerce-concurrency-backend",
  "madrasa-management-erp",
  "personal-portfolio-aip-backend",
] as const;

async function main(): Promise<void> {
  console.log("[Seed] Starting idempotent database seeding...");

  // 1. Seed canonical DownloadStat (Section 8 & 23)
  const downloadStat = await prisma.downloadStat.upsert({
    where: { id: "total" },
    update: {},
    create: {
      id: "total",
      total: 0,
    },
  });
  console.log(`[Seed] Canonical DownloadStat ready (id: "${downloadStat.id}", total: ${downloadStat.total})`);

  // 2. Seed verified projects idempotently (Section 22 & 23)
  if (VERIFIED_PROJECTS.length > 0) {
    for (const project of VERIFIED_PROJECTS) {
      await prisma.project.upsert({
        where: { slug: project.slug },
        update: {
          title: project.title,
          summary: project.summary,
          description: project.description,
          techStack: project.techStack,
          repoUrl: project.repoUrl,
          liveUrl: project.liveUrl,
          coverImageUrl: project.coverImageUrl,
          featured: project.featured,
          published: project.published,
        },
        create: {
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          description: project.description,
          techStack: project.techStack,
          repoUrl: project.repoUrl,
          liveUrl: project.liveUrl,
          coverImageUrl: project.coverImageUrl,
          featured: project.featured,
          published: project.published,
        },
      });
      console.log(`[Seed] Project seeded: "${project.slug}"`);
    }
  } else {
    console.log(
      `[Seed Notice] Seed Data Truth Policy active: No unverified project records were fabricated. ` +
      `Pending verified summaries/descriptions for: ${KNOWN_PROJECT_SLUGS.join(", ")}.`
    );
  }

  console.log("[Seed] Database seeding completed successfully.");
}

main()
  .catch((error) => {
    // Safe error reporting - never expose credentials or connection strings
    const safeMessage =
      error instanceof Error ? error.message : "An unexpected error occurred during database seeding";
    console.error("[Seed Error]", safeMessage);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
