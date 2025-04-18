-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "allMessages" TEXT[] DEFAULT ARRAY[]::TEXT[];
