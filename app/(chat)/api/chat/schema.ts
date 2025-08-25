import { z } from "zod";

const textPartSchema = z.object({
  type: z.literal("text"),
  text: z.string().min(1).max(2000),
});

const filePartSchema = z.object({
  type: z.literal("file"),
  fileName: z.string(),
  mediaType: z.string(),
  data: z.string(), // base64 encoded data
});

const messagePartSchema = z.union([textPartSchema, filePartSchema]);

export const postRequestBodySchema = z.object({
  id: z.uuid(),
  message: z.object({
    id: z.string(),
    createdAt: z.coerce.date().optional().default(new Date()),
    role: z.enum(["user"]),
    parts: z.array(messagePartSchema).min(1), // At least one part required
  }),
  selectedChatModel: z
    .enum(["chat-model", "chat-model-reasoning"])
    .optional()
    .default("chat-model"),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
