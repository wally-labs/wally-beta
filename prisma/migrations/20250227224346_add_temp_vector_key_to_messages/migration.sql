/*
  Warnings:

  - A unique constraint covering the columns `[vectorKey]` on the table `Messages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "birthDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "vectorKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Messages_vectorKey_key" ON "Messages"("vectorKey");
