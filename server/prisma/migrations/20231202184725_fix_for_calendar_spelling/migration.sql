/*
  Warnings:

  - The values [calender] on the enum `StoreItemType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StoreItemType_new" AS ENUM ('link', 'digitalproduct', 'socialset', 'calendar', 'webinar', 'course');
ALTER TABLE "StoreItem" ALTER COLUMN "itemType" TYPE "StoreItemType_new" USING ("itemType"::text::"StoreItemType_new");
ALTER TYPE "StoreItemType" RENAME TO "StoreItemType_old";
ALTER TYPE "StoreItemType_new" RENAME TO "StoreItemType";
DROP TYPE "StoreItemType_old";
COMMIT;
