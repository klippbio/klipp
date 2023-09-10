/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userDescription" DROP NOT NULL;
