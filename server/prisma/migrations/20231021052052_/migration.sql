/*
  Warnings:

  - You are about to drop the column `timeZone` on the `Attendee` table. All the data in the column will be lost.
  - You are about to drop the column `timeZone` on the `CalendarProduct` table. All the data in the column will be lost.
  - You are about to drop the column `timeZone` on the `CalendarSetting` table. All the data in the column will be lost.
  - You are about to drop the column `timeZone` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `timezone` to the `Attendee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendee" DROP COLUMN "timeZone",
ADD COLUMN     "timezone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CalendarProduct" DROP COLUMN "timeZone",
ADD COLUMN     "timezone" TEXT;

-- AlterTable
ALTER TABLE "CalendarSetting" DROP COLUMN "timeZone",
ADD COLUMN     "timezone" TEXT;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "timeZone",
ADD COLUMN     "timezone" TEXT;
