/*
  Warnings:

  - Added the required column `bookingStatus` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('SCHEDULED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "bookingStatus" "BookingStatus" NOT NULL;
