/*
  Warnings:

  - You are about to drop the column `avatarLink` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `personName` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `releaseNumber` on the `notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notification" DROP COLUMN "avatarLink",
DROP COLUMN "createdAt",
DROP COLUMN "personName",
DROP COLUMN "releaseNumber",
ADD COLUMN     "avatar_link" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "person_name" TEXT,
ADD COLUMN     "release_number" INTEGER;
