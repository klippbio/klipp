/*
  Warnings:

  - Made the column `timeZone` on table `CalendarProduct` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CalendarProduct" ALTER COLUMN "timeZone" SET NOT NULL;
