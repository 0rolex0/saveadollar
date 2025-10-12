/*
  Warnings:

  - You are about to drop the column `cardPrice` on the `GasPrice` table. All the data in the column will be lost.
  - You are about to drop the column `cashPrice` on the `GasPrice` table. All the data in the column will be lost.
  - Added the required column `name` to the `GasPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceCard` to the `GasPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceCash` to the `GasPrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `GasPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."GasPrice" DROP COLUMN "cardPrice",
DROP COLUMN "cashPrice",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "priceCard" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "priceCash" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "storeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."GasPrice" ADD CONSTRAINT "GasPrice_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
