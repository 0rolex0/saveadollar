// prisma/seed-expiring.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("🌱 Starting seed...");

    // 1️⃣ Create or find store
    const store = await prisma.store.upsert({
      where: { name: "Test Store" },
      update: {},
      create: {
        name: "Test Store",
        location: "123 Main Street",
      },
    });

    // 2️⃣ Create or find product
    const product = await prisma.product.upsert({
      where: { sku: "TEST-001" },
      update: {},
      create: {
        name: "Test Candy",
        sku: "TEST-001",
        category: "Snacks",
        brand: "Generic",
        defaultCost: 1.0,
        defaultPrice: 1.5,
        returnable: true,
        quantityPerBox: 12, // ✅ required field
      },
    });

    // 3️⃣ Seed expiring inventory
    const today = new Date();
    const expirySoon = new Date(today);
    expirySoon.setDate(today.getDate() + 5);

    await prisma.liveInventory.createMany({
      data: [
        {
          productId: product.id,
          expiry: expirySoon,
          quantity: 10,
          costPrice: 1.0,
          retailPrice: 1.5, // ✅ added
          credit: true,
          deliveryDate: today,
          storeId: store.id,
        },
        {
          productId: product.id,
          expiry: expirySoon,
          quantity: 5,
          costPrice: 1.0,
          retailPrice: 1.5, // ✅ added
          credit: false,
          deliveryDate: today,
          storeId: store.id,
        },
      ],
      skipDuplicates: true,
    });

    console.log("✅ Store, Product, and Expiring Inventory seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run only if called directly (not during build)
if (require.main === module) {
  seed();
}