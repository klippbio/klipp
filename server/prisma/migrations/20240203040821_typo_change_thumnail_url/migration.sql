/*
  Warnings:

  - You are about to drop the column `thumbanilUrl` on the `Store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "thumbanilUrl",
ADD COLUMN     "thumbnailUrl" TEXT;
