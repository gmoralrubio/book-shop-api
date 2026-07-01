/*
  Warnings:

  - The `status` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PUBLISHED', 'SOLD');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "soldAt" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PUBLISHED';
