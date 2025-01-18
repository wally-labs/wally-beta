// import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAllChatHeaders: protectedProcedure.query(async ({ ctx }) => {
    const headers = await ctx.db.chat.findMany({
      where: {
        userId: ctx.session.user.id,
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

    return headers ?? [];
  }),
});
