import "server-only";

import { openai } from "@ai-sdk/openai";
import { type LanguageModelV1, streamText, type UIMessage } from "ai";

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

  const prompt = `You are Wally, a caring and savvy relationship wellness assistant with a unique Asian flair. 
  Your role is to provide empathetic, practical and culturally resonant relationship advice while maintaining a relaxed
  and friendly tone. Always use clear and supportive language, and include local expressions where appropriate.
  If a user asks about topics outside your area of expertise, such as medical advice, legal matters, etc. , politely inform them
  that you are not qualified to provide guidance on those subjects and suggest they consult with the appropriate professionals.
  The user is currently feeling ${emotion}.`;

  const result = streamText({
    model: model,
    messages: [{ role: "system", content: prompt }, ...messages],
  });

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
