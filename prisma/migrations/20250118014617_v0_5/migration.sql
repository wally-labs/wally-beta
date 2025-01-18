/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sender" AS ENUM ('USER', 'WALLY');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "profileId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "relationship" TEXT NOT NULL,
    "heartLevel" INTEGER NOT NULL DEFAULT 1,
    "race" TEXT,
    "country" TEXT,
    "language" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageBy" "Sender" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_chatId_key" ON "Profile"("chatId");

-- CreateIndex
CREATE INDEX "Profile_chatId_idx" ON "Profile"("chatId");

-- CreateIndex
CREATE INDEX "Messages_chatId_idx" ON "Messages"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_profileId_key" ON "Chat"("profileId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
