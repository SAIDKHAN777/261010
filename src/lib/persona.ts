import { env } from "./env";

export interface PersonaProjectGrounding {
  id?: string;
  title: string;
  slug?: string;
  summary: string;
  description: string;
  techStack: string[];
  repoUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
}

export const PERSONA_TEMPLATE = `You are the AI assistant representing Said Khan, an AI Solutions Architect and Full-Stack Systems Engineer.
Your goal is to answer questions from visitors, recruiters, and clients about Said's background, technical architecture philosophies, and published projects.

ABOUT SAID KHAN:
{{BIO}}

PORTFOLIO & ARCHITECTURE PROJECTS:
{{PROJECTS_FALLBACK}}

MEETING & CONSULTATION BOOKING:
Direct visitors seeking consultations, advisory sessions, or collaborations to: {{BOOKING_URL}}

COMMUNICATION STYLE & GUIDELINES:
{{TONE}}

CRITICAL INSTRUCTIONS:
- You are strictly grounded in the projects and bio listed above.
- Never invent projects, credentials, or architectural achievements not described in the context.
- Keep responses articulate, concise, and helpful.`;

export const PERMITTED_PERSONA_TOKENS = [
  "{{BIO}}",
  "{{PROJECTS_FALLBACK}}",
  "{{BOOKING_URL}}",
  "{{TONE}}",
] as const;

export function buildSystemInstruction(
  projects: PersonaProjectGrounding[] = [],
  envOverride?: {
    PERSONA_BIO?: string;
    PERSONA_PROJECTS_FALLBACK?: string;
    PERSONA_BOOKING_URL?: string;
    PERSONA_TONE?: string;
  }
): string {
  const bio = envOverride?.PERSONA_BIO ?? env.PERSONA_BIO;
  const fallback =
    envOverride?.PERSONA_PROJECTS_FALLBACK ?? env.PERSONA_PROJECTS_FALLBACK;
  const bookingUrl =
    envOverride?.PERSONA_BOOKING_URL ?? env.PERSONA_BOOKING_URL;
  const tone = envOverride?.PERSONA_TONE ?? env.PERSONA_TONE;

  let projectsContent = "";
  if (projects.length > 0) {
    projectsContent = projects
      .map((p, idx) => {
        const lines: string[] = [
          `Project ${idx + 1}: ${p.title}`,
          `Summary: ${p.summary}`,
          `Description: ${p.description}`,
          `Tech Stack: ${p.techStack.join(", ")}`,
        ];
        if (p.liveUrl) {
          lines.push(`Live URL: ${p.liveUrl}`);
        }
        if (p.repoUrl) {
          lines.push(`Repository: ${p.repoUrl}`);
        }
        return lines.join("\n");
      })
      .join("\n\n");
  } else {
    projectsContent = fallback;
  }

  let resolved = PERSONA_TEMPLATE;
  resolved = resolved.replaceAll("{{BIO}}", bio);
  resolved = resolved.replaceAll("{{PROJECTS_FALLBACK}}", projectsContent);
  resolved = resolved.replaceAll("{{BOOKING_URL}}", bookingUrl);
  resolved = resolved.replaceAll("{{TONE}}", tone);

  for (const token of PERMITTED_PERSONA_TOKENS) {
    if (resolved.includes(token)) {
      throw new Error(
        `Persona configuration error: token ${token} remains unresolved in system instruction`
      );
    }
  }

  const placeholderRegex = /\{\{[A-Z0-9_]+\}\}/g;
  const remaining = resolved.match(placeholderRegex);
  if (remaining && remaining.length > 0) {
    throw new Error(
      `Persona configuration error: unresolved placeholder ${remaining[0]} in system instruction`
    );
  }

  return resolved;
}
