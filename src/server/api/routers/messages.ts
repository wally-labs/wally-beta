import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const messagesRouter = createTRPCRouter({
  // get messages from db ONCE when chat page opens up, get according to time and fill later
  // not very sure how to do this tho...
  getChatMessages: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        before: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { chatId, before } = input;
        const messages = await ctx.db.messages.findMany({
          where: {
            chatId,
            createdAt: before ? { lt: new Date(before) } : undefined,
          },
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            content: true,
            messageBy: true,
            createdAt: true,
          },
        });

        return messages;
      } catch (error) {
        console.error("Error fetching messages: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch messages",
        });
      }
    }),

  // search for a message in all chats
  searchKeyWord: protectedProcedure
    .input(z.object({ keyword: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { keyword } = input;

      try {
        const chatIds = await ctx.db.chat.findMany({
          where: {
            userId: ctx.session.userId,
          },
        });

        const messages = await ctx.db.messages.findMany({
          where: {
            chatId: {
              in: chatIds.map((chat) => chat.id),
            },
            content: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return messages;
      } catch (error) {
        console.error("Error searching messages: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to search messages",
        });
      }
    }),
});
