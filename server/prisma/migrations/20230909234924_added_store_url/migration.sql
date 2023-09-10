/*
  Warnings:

  - You are about to drop the column `storeName` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storeUrl]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `storeUrl` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Store_storeName_key";

-- DropIndex
DROP INDEX "storeName";

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "storeName",
ADD COLUMN     "storeTitle" TEXT,
ADD COLUMN     "storeUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- CreateIndex
CREATE UNIQUE INDEX "Store_storeUrl_key" ON "Store"("storeUrl");

-- CreateIndex
CREATE INDEX "storeUrl" ON "Store"("storeUrl");
