// import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAllChatHeaders: publicProcedure.query(async ({ ctx }) => {
    const isLoggedIn = !!ctx.session.userId;

    if (!isLoggedIn) {
      return [];
    }

    const headers = await ctx.db.chat.findMany({
      where: {
        userId: ctx.session.userId!,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        chatHeader: true,
        updatedAt: true,
      },
    });

    return headers;
  }),
});
