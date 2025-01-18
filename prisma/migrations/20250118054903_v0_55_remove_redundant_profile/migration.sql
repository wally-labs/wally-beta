/*
  Warnings:

  - You are about to drop the column `profileId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `language` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationship` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_profileId_fkey";

-- DropIndex
DROP INDEX "Chat_profileId_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "profileId",
ADD COLUMN     "birthDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "heartLevel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "race" TEXT,
ADD COLUMN     "relationship" TEXT NOT NULL;

-- DropTable
DROP TABLE "Profile";
