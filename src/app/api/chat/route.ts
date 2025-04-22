import "server-only";

import type z from "zod";
import { type formSchema } from "~/app/_components/schema";
// import { smoothStream, streamText } from "ai";
import { type NextRequest } from "next/server";
import OpenAI from "openai";
import type { Message } from "~/app/_components/chat/chat-home";
import type {
  ChatCompletionAssistantMessageParam,
  ChatCompletionContentPartImage,
  ChatCompletionContentPartText,
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs";

// smooth streaming for chinese characters
// const chineseSplitter = smoothStream({
//   chunking: /[\u4E00-\u9FFF]|\S+\s+/,
// });

// wrap chineseSplitter in custom stream
// const mixedLangTransform = () => {
//   // create the smooth‐stream instance
//   const transformer = chineseSplitter({ tools: {} });
//   const { readable, writable } = transformer;

//   return new TransformStream<TextStreamPart<ToolSet>, TextStreamPart<ToolSet>>({
//     async transform(part, controller) {
//       const text = part.type ?? "";
//       if (/[\u4E00-\u9FFF]/.test(text)) {
//         // send through chinese splitter writable
//         const writer = writable.getWriter();
//         await writer.write(part);
//         writer.releaseLock();

//         // pull smoothed chunks from the readable stream
//         const reader = readable.getReader();
//         try {
//           while (true) {
//             const { value, done } = await reader.read();
//             if (done) break;
//             controller.enqueue(value);
//           }
//         } finally {
//           reader.releaseLock();
//         }
//       } else {
//         // english or non‐chinese chunks: emit immediately
//         controller.enqueue(part);
//       }
//     },
//   });
// };

const client = new OpenAI();

export async function POST(req: NextRequest) {
  const {
    messages,
    emotion,
    profileData,
  }: {
    messages: Message[];
    emotion: string;
    profileData: z.infer<typeof formSchema>;
  } = (await req.json()) as {
    messages: Message[];
    emotion: string;
    profileData: z.infer<typeof formSchema>;
  };

  const {
    name,
    gender,
    birthDate,
    relationship,
    heartLevel,
    race,
    country,
    language,
  } = profileData;

  const systemPrompt = `You are Wally, a caring and savvy relationship wellness assistant with a unique Asian flair. 
  Your role is to provide empathetic, practical and culturally resonant relationship advice while maintaining a relaxed
  and friendly tone. Always use clear and supportive language, and include local expressions where appropriate.
  If a user asks about topics outside your area of expertise, such as medical advice, legal matters, etc., politely inform them
  that you are not qualified to provide guidance on those subjects and suggest they consult with the appropriate professionals.`;

  const contextPrompt = `The user is currently trying to speak to ${name}. I want you to use the information provided to tailor 
  your responses to be more personalized and culturally resonant. This is what I know about ${name}: Gender: ${gender}, Birth Date:
  ${birthDate}, Relationship between user and ${name}: ${relationship}, Heart Level: ${heartLevel},  Race: ${race}, 
  Country: ${country}, Language: ${language}.`;

  const emotionPrompt = `The user is currently feeling ${emotion}. Tailor your responses to be more empathetic towards
  the user's current emotional state.`;

  const ccMessages: ChatCompletionMessageParam[] = messages.map((m) => {
    // no attachments, only send text
    if (!m.experimental_attachments?.length) {
      if (m.role === "user") {
        const userMsg: ChatCompletionUserMessageParam = {
          role: "user",
          content: m.content,
        };
        return userMsg;
      } else {
        // assistant message will NEVER have attachments
        const assistantMsg: ChatCompletionAssistantMessageParam = {
          role: "assistant",
          content: m.content,
        };
        return assistantMsg;
      }
    }

    const textPart: ChatCompletionContentPartText = {
      type: "text",
      text: m.content,
    };

    // if attachments we build a mixed content array
    const imageParts: ChatCompletionContentPartImage[] = [
      // then each image_url part (detail omitted → defaults to "auto")
      ...m.experimental_attachments.map((att) => ({
        type: "image_url" as const,
        image_url: { url: att.url },
      })),
    ];

    const userMsg: ChatCompletionUserMessageParam = {
      role: "user",
      content: [textPart, ...imageParts],
    };
    return userMsg;
  });

  console.log("ccMessages", ccMessages);

  // use chat completions API
  const response = await client.chat.completions.create({
    // try responses API, if more time in future (for advanced features)
    // const response = await client.responses.create({
    model: "gpt-4o-mini-2024-07-18",
    n: 3,
    messages: [
      {
        role: "system",
        content: systemPrompt + " " + contextPrompt + " " + emotionPrompt,
      },
      ...ccMessages,
    ],
    stream: true,
  });

  return new Response(response.toReadableStream(), {
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}
