import { GoogleGenAI } from "@google/genai";
import { env } from "../lib/env";
import type { ChatMessage } from "../domain/chat";

let aiInstance: GoogleGenAI | null = null;

export function getAi(): GoogleGenAI {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }
  return aiInstance;
}

export const ai = new Proxy({} as GoogleGenAI, {
  get(_target, prop) {
    const client = getAi();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export async function streamGeminiChat(
  messages: ChatMessage[],
  systemInstruction: string,
  signal: AbortSignal
) {
  const contents = messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));

  const client = getAi();
  return await client.models.generateContentStream({
    model: env.GEMINI_MODEL,
    contents,
    config: {
      systemInstruction,
      maxOutputTokens: env.GEMINI_MAX_OUTPUT_TOKENS,
      temperature: env.GEMINI_TEMPERATURE,
      abortSignal: signal,
    },
  });
}
