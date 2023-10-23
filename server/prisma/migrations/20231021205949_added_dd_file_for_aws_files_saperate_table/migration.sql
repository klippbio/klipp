/*
  Warnings:

  - You are about to drop the column `file` on the `DigitalProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DigitalProduct" DROP COLUMN "file";

-- CreateTable
CREATE TABLE "DDFile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "digitalProductId" INTEGER NOT NULL,

    CONSTRAINT "DDFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DDFile_digitalProductId_idx" ON "DDFile"("digitalProductId");

-- AddForeignKey
ALTER TABLE "DDFile" ADD CONSTRAINT "DDFile_digitalProductId_fkey" FOREIGN KEY ("digitalProductId") REFERENCES "DigitalProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
