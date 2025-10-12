// prisma/seed-expiring.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  // 1. Create a test store
  const store = await prisma.store.create({
    data: {
      name: "Test Store",
      location: "123 Main Street",
    },
  });

  // 2. Create a test product
  const product = await prisma.product.create({
    data: {
      name: "Test Candy",
      sku: "TEST-001",
      category: "Snacks",
      brand: "Generic",
      defaultCost: 1.0,
      defaultPrice: 1.5,
      returnable: true,
    },
  });

  // 3. Insert expiring inventory linked to the store and product
  const today = new Date();
  const expirySoon = new Date(today);
  expirySoon.setDate(today.getDate() + 5); // expires in 5 days

  await prisma.liveInventory.createMany({
    data: [
      {
        productId: product.id,
        expiry: expirySoon,
        quantity: 10,
        costPrice: 1.0,
        credit: true,
        deliveryDate: today,
        storeId: store.id,
      },
      {
        productId: product.id,
        expiry: expirySoon,
        quantity: 5,
        costPrice: 1.0,
        credit: false,
        deliveryDate: today,
        storeId: store.id,
      },
    ],
  });

  console.log("✅ Store, Product, and Expiring Inventory seeded.");
}

seed().finally(() => prisma.$disconnect());