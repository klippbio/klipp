/*
  Warnings:

  - You are about to drop the column `userDescription` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "storeDescription" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userDescription";
