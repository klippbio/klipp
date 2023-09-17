/*
  Warnings:

  - Made the column `storeTitle` on table `Store` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "storeTitle" SET NOT NULL;
