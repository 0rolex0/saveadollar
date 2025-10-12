/*
  Warnings:

  - Added the required column `retailPrice` to the `LiveInventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityPerBox` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LiveInventory" ADD COLUMN     "retailPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "quantityPerBox" INTEGER NOT NULL;
