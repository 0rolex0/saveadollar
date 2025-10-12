-- AlterTable
ALTER TABLE "LiveInventory" ADD COLUMN     "lastSoldAt" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "reorderFlag" BOOLEAN;
