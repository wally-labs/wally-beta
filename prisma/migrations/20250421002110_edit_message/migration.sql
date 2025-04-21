-- AlterTable
ALTER TABLE "Message" RENAME CONSTRAINT "Messages_pkey" TO "Message_pkey";

-- CreateIndex
CREATE INDEX "Attachment_messageId_idx" ON "Attachment"("messageId");

-- RenameForeignKey
ALTER TABLE "Message" RENAME CONSTRAINT "Messages_chatId_fkey" TO "Message_chatId_fkey";

-- RenameIndex
ALTER INDEX "Messages_chatId_idx" RENAME TO "Message_chatId_idx";

-- RenameIndex
ALTER INDEX "Messages_vectorKey_key" RENAME TO "Message_vectorKey_key";
