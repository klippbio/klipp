/*
  Warnings:

  - Changed the type of `itemType` on the `StoreItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StoreItemType" AS ENUM ('LINK', 'DIGITALPRODUCT', 'SOCIALSET', 'CALENDER', 'WEBINAR', 'COURSE');

-- AlterTable
ALTER TABLE "StoreItem" DROP COLUMN "itemType",
ADD COLUMN     "itemType" "StoreItemType" NOT NULL;
