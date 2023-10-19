/*
  Warnings:

  - The primary key for the `DigitalProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `DigitalProduct` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `DigitalProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DigitalProduct" DROP CONSTRAINT "DigitalProduct_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "DigitalProduct_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalProduct_id_key" ON "DigitalProduct"("id");

-- CreateIndex
CREATE INDEX "DigitalProduct_storeItemId_idx" ON "DigitalProduct"("storeItemId");
