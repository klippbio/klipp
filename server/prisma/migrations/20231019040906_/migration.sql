/*
  Warnings:

  - The primary key for the `StoreItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `StoreItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `StoreItem` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `storeItemId` on the `CalendarProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `storeItemId` on the `DigitalProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `storeItemId` on the `Link` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CalendarProduct" DROP CONSTRAINT "CalendarProduct_storeItemId_fkey";

-- DropForeignKey
ALTER TABLE "DigitalProduct" DROP CONSTRAINT "DigitalProduct_storeItemId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_storeItemId_fkey";

-- AlterTable
ALTER TABLE "CalendarProduct" DROP COLUMN "storeItemId",
ADD COLUMN     "storeItemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DigitalProduct" DROP COLUMN "storeItemId",
ADD COLUMN     "storeItemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "storeItemId",
ADD COLUMN     "storeItemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StoreItem" DROP CONSTRAINT "StoreItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "StoreItem_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarProduct_storeItemId_key" ON "CalendarProduct"("storeItemId");

-- CreateIndex
CREATE INDEX "CalendarProduct_storeItemId_idx" ON "CalendarProduct"("storeItemId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarProduct_storeItemId_slug_key" ON "CalendarProduct"("storeItemId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalProduct_storeItemId_key" ON "DigitalProduct"("storeItemId");

-- CreateIndex
CREATE INDEX "DigitalProduct_storeItemId_idx" ON "DigitalProduct"("storeItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Link_storeItemId_key" ON "Link"("storeItemId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreItem_id_key" ON "StoreItem"("id");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalProduct" ADD CONSTRAINT "DigitalProduct_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarProduct" ADD CONSTRAINT "CalendarProduct_storeItemId_fkey" FOREIGN KEY ("storeItemId") REFERENCES "StoreItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
