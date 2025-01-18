// import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
  getAllChatHeaders: protectedProcedure.query(async ({ ctx }) => {
    const headers = await ctx.db.chat.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        chatHeader: true,
      },
    });

    return headers ?? null;
  }),

  // getChatMessages: protectedProcedure.query(async ({ ctx }) => {
  //   const messages = await ctx.db.chat.
  // }),
});
