/*
  Warnings:

  - You are about to drop the column `acountId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "acountId",
ADD COLUMN     "accountId" TEXT NOT NULL;
