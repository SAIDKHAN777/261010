import { GoogleGenAI } from "@google/genai";
import { env } from "../lib/env";
import type { ChatMessage } from "../domain/chat";

export const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
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

  return await ai.models.generateContentStream({
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
