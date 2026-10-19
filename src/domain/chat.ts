import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "model"], {
    errorMap: () => ({ message: "Role must be either 'user' or 'model'" }),
  }),
  content: z
    .string()
    .trim()
    .min(1, "Message content cannot be empty")
    .max(2000, "Individual message cannot exceed 2000 characters"),
});

export const chatRequestSchema = z
  .object({
    messages: z
      .array(chatMessageSchema)
      .min(1, "At least one message is required")
      .max(20, "Cannot submit more than 20 messages in conversation history"),
  })
  .refine(
    (data) => {
      const totalChars = data.messages.reduce(
        (acc, msg) => acc + msg.content.length,
        0
      );
      return totalChars <= 12000;
    },
    {
      message: "Total message conversation content cannot exceed 12,000 characters",
      path: ["messages"],
    }
  )
  .refine(
    (data) => {
      const last = data.messages[data.messages.length - 1];
      return last !== undefined && last.role === "user";
    },
    {
      message: "The final message in the conversation must be from the user",
      path: ["messages"],
    }
  );

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
