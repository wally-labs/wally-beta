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

const NUM_STREAMS = 3;
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
      // then each image_url part (detail omitted - defaults to "auto")
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

  // use chat completions API
  // const stream = await client.chat.completions.create({
  //   // try responses API, if more time in future (for advanced features)
  //   // const response = await client.responses.create({
  //   model: "gpt-4o-mini-2024-07-18",
  //   n: 3,
  //   messages: [
  //     {
  //       role: "system",
  //       content: systemPrompt + " " + contextPrompt + " " + emotionPrompt,
  //     },
  //     ...ccMessages,
  //   ],
  //   stream: true,
  // });

  // n:3 results in multi-modal streaming error, when using images
  // instead of one n:3 request, create 3 n:1 parallel streams
  const streamsWithIndex = await Promise.all(
    Array.from({ length: NUM_STREAMS }, (_, idx) =>
      client.chat.completions
        .create({
          model: "gpt-4o-mini-2024-07-18",
          n: 1,
          stream: true,
          messages: [
            {
              role: "system",
              content: systemPrompt + " " + contextPrompt + " " + emotionPrompt,
            },
            ...ccMessages,
          ],
        })
        .then((stream) => ({ stream, idx })),
    ),
  );

  // wrap all in one ReadableStream with interleaved streams, similar to 1 n:3 request response
  const body = new ReadableStream({
    async start(controller) {
      try {
        // turn each stream into async iterators, keep its index
        let activeStreams = streamsWithIndex.map(({ stream, idx }) => {
          const iter = stream[Symbol.asyncIterator]();
          const next = iter.next().then((result) => ({ result, idx, iter }));
          return { iter, idx, next };
        });

        // as long as we have active iterators
        while (activeStreams.length > 0) {
          // await whichever stream's next resolves first
          const { result, idx, iter } = await Promise.race(
            activeStreams.map((s) => s.next),
          );

          if (result.done) {
            // remove finished stream from active streams
            activeStreams = activeStreams.filter((s) => s.iter !== iter);
          } else {
            // repackage single-delta into multi-choice format
            const delta = result.value.choices[0]?.delta;
            const fauxPayload = {
              choices: [{ delta, index: idx }],
            };

            controller.enqueue(`data: ${JSON.stringify(fauxPayload)}\n\n`);

            // re-queue the next stream's next promise
            activeStreams = activeStreams.map((s) => {
              if (s.iter === iter) {
                return {
                  iter,
                  idx,
                  next: iter.next().then((r) => ({ result: r, idx, iter })),
                };
              }

              return s;
            });
          }
        }

        // signal end-of-stream, once all 3 streams are done
        controller.enqueue(`data: [DONE]\n\n`);
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  // return response with headers
  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
