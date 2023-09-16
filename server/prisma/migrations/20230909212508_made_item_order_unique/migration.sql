/*
  Warnings:

  - A unique constraint covering the columns `[itemOrder]` on the table `StoreItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE storeitem_itemorder_seq;
ALTER TABLE "StoreItem" ALTER COLUMN "itemOrder" SET DEFAULT nextval('storeitem_itemorder_seq');
ALTER SEQUENCE storeitem_itemorder_seq OWNED BY "StoreItem"."itemOrder";

-- CreateIndex
CREATE UNIQUE INDEX "StoreItem_itemOrder_key" ON "StoreItem"("itemOrder");
