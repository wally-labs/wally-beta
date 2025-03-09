import { openai } from "@ai-sdk/openai";
import { type LanguageModelV1, streamText, type UIMessage } from "ai";
// import { api } from "~/trpc/server";

export async function POST(req: Request) {
  const model: LanguageModelV1 = openai("gpt-3.5-turbo");

  const {
    messages,
    emotion,
  }: { messages: UIMessage[]; emotion: string | undefined } =
    (await req.json()) as {
      messages: UIMessage[];
      emotion: string | undefined;
    };

  // if (messages.length > 0) {
  //   const lastMesage = messages[messages.length - 1];

  //   await api.messages.saveMessage({
  //     chatId,
  //     content: lastMesage!.content,
  //     messageBy: "USER",
  //   });
  // }

  const prompt = `You are Wally and you will act as a helpful and professional relationship wellness assistant. 
  The user is currently feeling ${emotion}.`;

  const result = streamText({
    model: model,
    messages: [{ role: "system", content: prompt }, ...messages],
  });

  // (async () => {
  //   let aiResponseText = "";
  //   for await (const chunk of result.textStream) {
  //     aiResponseText += chunk;
  //   }
  //   try {
  //     await api.messages.saveMessage({
  //       chatId,
  //       content: aiResponseText,
  //       messageBy: "WALLY",
  //     });
  //   } catch (err) {
  //     console.error("Failed to save message from Wally", err);
  //   }
  // })().catch((err) => {
  //   console.error("Error in async IIFE", err);
  // });

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      if (error == null) {
        return "unknown error";
      }

      if (typeof error === "string") {
        return error;
      }

      if (error instanceof Error) {
        return error.message;
      }

      return JSON.stringify(error);
    },
    sendUsage: false,
  });
}
