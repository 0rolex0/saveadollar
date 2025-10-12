/*
  Warnings:

  - Made the column `category` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `brand` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `defaultCost` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `defaultPrice` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "brand" SET NOT NULL,
ALTER COLUMN "defaultCost" SET NOT NULL,
ALTER COLUMN "defaultPrice" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."GasPrice" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cardPrice" DOUBLE PRECISION NOT NULL,
    "cashPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GasPrice_pkey" PRIMARY KEY ("id")
);
