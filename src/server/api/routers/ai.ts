import { TRPCError } from "@trpc/server";
import { z } from "zod";
import openAi from "~/server/ai/config";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const aiRouter = createTRPCRouter({
  // incomplete sendMessage to openAI API route
  // send message to openAI and wait for response
  sendMessage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        emotion: z.string(),
        message: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db.chat.findUnique({
        where: { id: input.id },
      });

      const response = await openAi.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "developer",
            content: [
              {
                type: "text",
                text:
                  "You are a helpful, professional, personal relationship wellness assistant. The user is communicating with his/her" +
                  profile?.relationship +
                  " and his/her name is " +
                  profile?.name +
                  ". The ",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: input.message,
              },
            ],
          },
        ],
      });
    }),
});
