-- AlterTable
ALTER TABLE "public"."PromoItem" ADD COLUMN     "storeId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."PromoItem" ADD CONSTRAINT "PromoItem_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
