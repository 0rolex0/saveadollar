-- CreateTable
CREATE TABLE "DeletedInventory" (
    "id" TEXT NOT NULL,
    "liveItemId" TEXT,
    "productId" TEXT,
    "productName" TEXT,
    "sku" TEXT,
    "quantity" INTEGER,
    "costPrice" DOUBLE PRECISION,
    "retailPrice" DOUBLE PRECISION,
    "credit" BOOLEAN,
    "storeId" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "reason" TEXT,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletedInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryUpdate" (
    "id" TEXT NOT NULL,
    "liveItemId" TEXT,
    "productId" TEXT,
    "productName" TEXT,
    "sku" TEXT,
    "oldQuantity" INTEGER,
    "newQuantity" INTEGER,
    "oldCostPrice" DOUBLE PRECISION,
    "newCostPrice" DOUBLE PRECISION,
    "oldRetailPrice" DOUBLE PRECISION,
    "newRetailPrice" DOUBLE PRECISION,
    "oldDeliveryDate" TIMESTAMP(3),
    "newDeliveryDate" TIMESTAMP(3),
    "oldExpiryDate" TIMESTAMP(3),
    "newExpiryDate" TIMESTAMP(3),
    "creditChanged" BOOLEAN,
    "storeId" TEXT,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryUpdate_pkey" PRIMARY KEY ("id")
);
