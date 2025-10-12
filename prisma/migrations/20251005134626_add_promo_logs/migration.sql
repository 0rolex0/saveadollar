-- CreateTable
CREATE TABLE "PromoUpdate" (
    "id" TEXT NOT NULL,
    "promoId" TEXT NOT NULL,
    "oldData" TEXT NOT NULL,
    "newData" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeletedPromo" (
    "id" TEXT NOT NULL,
    "promoId" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "costPrice" DOUBLE PRECISION NOT NULL,
    "retailPrice" DOUBLE PRECISION NOT NULL,
    "promoPrice" DOUBLE PRECISION NOT NULL,
    "credit" BOOLEAN NOT NULL,
    "storeId" TEXT,
    "reason" TEXT NOT NULL,
    "deletedBy" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletedPromo_pkey" PRIMARY KEY ("id")
);
