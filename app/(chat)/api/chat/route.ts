import { systemPrompt } from "@/lib/ai/prompts";
import { ChatSDKError } from "@/lib/errors";
import { openai } from "@ai-sdk/openai";
import {
  streamText,
  convertToModelMessages,
  smoothStream,
  stepCountIs,
  createUIMessageStream,
  createUIMessageStreamResponse,
  UIMessage,
} from "ai";
import { entitlementsByUserType } from "@/lib/ai/entitlements";

import { NextResponse } from "next/server";
import { PostRequestBody, postRequestBodySchema } from "./schema";
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import { auth, UserType } from "@/app/(auth)/auth";
import { generateTitleFromUserMessage } from "../../actions";
import { generateUUID } from "@/lib/utils";

export const maxDuration = 60;

// let globalStreamContext: ResumableStreamContext | null = null;

// function getStreamContext() {
//   if (!globalStreamContext) {
//     try {
//       globalStreamContext = createResumableStreamContext({
//         waitUntil: after,
//       });
//     } catch (error: any) {
//       if (error.message.includes("REDIS_URL")) {
//         console.log(
//           " > Resumable streams are disabled due to missing REDIS_URL"
//         );
//       } else {
//         console.error(error);
//       }
//     }
//   }

//   return globalStreamContext;
// }

export async function POST(req: Request) {
  let requestBody: PostRequestBody;
  console.log("API HIT");

  try {
    const json = await req.json();
    console.log(json);

    requestBody = postRequestBodySchema.parse(json);
    console.log("Request body", requestBody);
  } catch (err) {
    console.error(err);
    return new ChatSDKError("bad_request:api").toResponse();
  }

  try {
    const { id, message } = requestBody;
    const session = await auth();
    console.log(id, message);
    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const userType: UserType = session.user.type;

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
      return new ChatSDKError("rate_limit:chat").toResponse();
    }

    const chat = await getChatById({ id });
    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message,
      });
      await saveChat({
        id,
        userId: session.user.id,
        title,
        visibility: "public",
      });
    } else {
      if (chat.userId !== session.user.id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }
    }

    const previousMessages = (await getMessagesByChatId({ id })) as UIMessage[];

    const messages = [...previousMessages, message];
    await saveMessages({
      messages: [
        {
          chatId: id,
          id: generateUUID(),
          role: "user",
          parts: message.parts,
          attachments: message.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        const result = streamText({
          model: openai("gpt-4o"),
          system: systemPrompt,
          messages: convertToModelMessages(messages),
          experimental_transform: smoothStream({
            delayInMs: 20,
            chunking: "word",
          }),
          stopWhen: [stepCountIs(5)],
          // tools: {
          //   getInformation: getInformationTool,
          // },
          onError(error) {
            console.error("❌ streamText error:", error);
          },
        });
        writer.merge(
          result.toUIMessageStream({
            onFinish: async ({ messages, responseMessage }) => {
              if (session.user?.id) {
                console.log(
                  "Finding assistant message",
                  messages,
                  responseMessage
                );
                try {
                  await saveMessages({
                    messages: [
                      {
                        id: responseMessage.id || generateUUID(),
                        chatId: id,
                        role: responseMessage.role,
                        parts: responseMessage.parts,
                        attachments: responseMessage.parts.filter(
                          (p) => p.type === "file"
                        ),
                        createdAt: new Date(),
                      },
                    ],
                  });
                } catch (err) {
                  console.error(err);
                  console.error("Failed to save chat");
                }
              }
            },
          })
        );
      },
    });
    return createUIMessageStreamResponse({ stream });
  } catch (err: unknown) {
    if (err instanceof ChatSDKError) {
      return err.toResponse();
    }

    console.error("💥 API Error:", err);
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  const chat = await getChatById({ id });

  if (chat.userId !== session.user.id) {
    return new ChatSDKError("forbidden:chat").toResponse();
  }

  const deletedChat = await deleteChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}
