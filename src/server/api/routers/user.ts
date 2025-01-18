// import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAllChatHeaders: publicProcedure.query(async ({ ctx }) => {
    const isLoggedIn = !!ctx.session?.user.id;

    if (!isLoggedIn) {
      return [];
    }

    const headers = await ctx.db.chat.findMany({
      where: {
        userId: ctx.session?.user.id,
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
