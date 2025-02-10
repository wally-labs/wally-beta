import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
    .query(async ({ ctx, input }) => {}),
});
