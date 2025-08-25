import { z } from "zod";

const textPartSchema = z.object({
  text: z.string().min(1).max(2000),
  type: z.enum(["text"]),
});

export const postRequestBodySchema = z.object({
  id: z.uuid(),
  message: z.object({
    id: z.string(),
    createdAt: z.coerce.date().optional().default(new Date()),
    role: z.enum(["user"]),
    parts: z.array(textPartSchema),
    experimental_attachments: z
      .array(
        z.object({
          url: z.string().url(),
          name: z.string().min(1).max(2000),
          contentType: z.enum([
            "image/png",
            "image/jpg",
            "image/jpeg",
            "application/pdf",
          ]),
        })
      )
      .optional(),
  }),
  selectedChatModel: z
    .enum(["chat-model", "chat-model-reasoning"])
    .optional()
    .default("chat-model"),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
