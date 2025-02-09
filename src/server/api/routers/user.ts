import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        emailVerified: z.string().datetime().optional(),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.create({
        data: {
          id: input.id,
          email: input.email,
          emailVerified: input.emailVerified,
          name: input.name,
          image: input.image,
        },
      });

      return user;
    }),

  // updateUser: publicProcedure.input(z.object({}))

  deleteUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.account.deleteMany({ where: { userId: input.id } });
        await ctx.db.session.deleteMany({ where: { userId: input.id } });
        await ctx.db.chat.deleteMany({ where: { userId: input.id } });

        const user = await ctx.db.user.delete({
          where: {
            id: input.id,
          },
        });

        return user;
      } catch (error) {
        console.error("User not found, Error deleting: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found, Failed to delete",
        });
      }
    }),

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
