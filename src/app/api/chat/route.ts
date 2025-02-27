import { openai } from "@ai-sdk/openai";
import { type LanguageModelV1, streamText, type UIMessage } from "ai";
import { api } from "~/trpc/server";

export async function POST(req: Request) {
  const model: LanguageModelV1 = openai("gpt-3.5-turbo");

  const {
    messages,
    emotion,
    chatId,
  }: { messages: UIMessage[]; emotion: string | undefined; chatId: string } =
    (await req.json()) as {
      messages: UIMessage[];
      emotion: string | undefined;
      chatId: string;
    };

  if (messages.length > 0) {
    const lastMesage = messages[messages.length - 1];

    await api.messages.saveMessage({
      chatId,
      content: lastMesage!.content,
      messageBy: "USER",
    });
  }

  const prompt = `You are Wally and you will act as a helpful and professional relationship wellness assistant. 
  The user is currently feeling ${emotion}.`;

  const result = streamText({
    model: model,
    messages: [{ role: "system", content: prompt }, ...messages],
  });

  let aiResponseText = "";
  for await (const chunk of result.textStream) {
    aiResponseText += chunk;
  }

  await api.messages.saveMessage({
    chatId,
    content: aiResponseText,
    messageBy: "WALLY",
  });

  return result.toDataStreamResponse();
}
