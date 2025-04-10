import "server-only";

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import z from "zod";
import { type formSchema } from "~/app/_components/schema";
import { openai } from "@ai-sdk/openai";
import {
  type LanguageModelV1,
  // streamObject,
  streamText,
  type UIMessage,
} from "ai";
import { type NextRequest } from "next/server";
// import { type IncomingMessage, type ServerResponse } from "http";

// FOR STREAM OBJECT
// const openAiElement = z.object({
//   type: z.string().describe("the html tag of the message"),
//   text: z.string().describe("the text content of the message"),
// });

// const openAiSchema = z.object({
//   elements: openAiElement.array(),
// });

export async function POST(req: NextRequest) {
  const model: LanguageModelV1 = openai(
    // "ft:gpt-4o-mini-2024-07-18:personal:wally:BAqpHxk2", // training dataset #1 - 75 convos
    // "ft:gpt-4o-mini-2024-07-18:personal:wally:BArfmkN1", // training dataset #1 - 25 convos
    "gpt-4o-mini-2024-07-18",
  );

  const {
    messages,
    emotion,
    profileData,
  }: {
    messages: UIMessage[];
    emotion: string;
    profileData: z.infer<typeof formSchema>;
  } = (await req.json()) as {
    messages: UIMessage[];
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

  // TRY STREAM OBJECT!!!
  // const result = streamObject({
  //   model: model,
  //   output: "array",
  //   schema: openAiSchema,
  //   schemaName: "Wally Relationship Assistant Response",
  //   schemaDescription:
  //     "A message object with type (h1, h2, h3, p, etc.) and text.",
  //   messages: [
  //     {
  //       role: "system",
  //       content: systemPrompt + " " + contextPrompt + " " + emotionPrompt,
  //     },
  //     ...messages,
  //   ],
  // });

  // return result.toTextStreamResponse({
  //   status: 200
  // });


  // TRY STREAM TEXT
  const result = streamText({
    model: model,
    messages: [
      {
        role: "system",
        content: systemPrompt + " " + contextPrompt + " " + emotionPrompt,
      },
      ...messages
    ]

  })

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      if (error == null) {
        return "Unknown error occurred.";
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
