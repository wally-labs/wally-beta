import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const messagesRouter = createTRPCRouter({
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
        const messages = await ctx.db.message.findMany({
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
            files: {
              select: {
                name: true,
                contentType: true,
                url: true,
              },
            },
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

        const messages = await ctx.db.message.findMany({
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

  // save a message to db
  saveMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        content: z.string(),
        messageBy: z.enum(["USER", "WALLY"]),
        files: z
          .array(
            z.object({
              url: z.string(),
              name: z.string().optional(),
              contentType: z.string().optional(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { chatId, content, messageBy, files } = input;

      try {
        // update chat's updatedAt with the chatId
        await ctx.db.chat.update({
          where: { id: chatId },
          data: {
            updatedAt: new Date(),
          },
        });

        const message = await ctx.db.message.create({
          data: {
            chatId,
            content,
            messageBy,
            allMessages: [content],
            files: {
              create:
                files?.map((file) => ({
                  url: file.url,
                  name: file.name,
                  contentType: file.contentType,
                })) ?? [],
            },
          },
        });

        return message;
      } catch (error) {
        console.error("Error saving message: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save message",
        });
      }
    }),
});
