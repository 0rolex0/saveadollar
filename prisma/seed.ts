export {}; // Ensures it's treated as a module
import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Hash function for seeding passwords
  const hashPassword = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  // 1. Seed Stores
  await prisma.store.createMany({
    data: [
      { id: "store_001", name: "Save A Dollar" },
      { id: "store_002", name: "Snak Atak" },
    ],
    skipDuplicates: true,
  });

  // 2. Seed Users (Owner + Managers)
  await prisma.user.createMany({
    data: [
      {
        id: "user_owner",
        name: "abc x",
        email: "owner@saveadollar.com",
        role: "OWNER",
        storeId: null,
        password: await hashPassword("test123"), // ✅ hashed
      },
      {
        id: "user_mgr1",
        name: "def y",
        email: "manager1@saveadollar.com",
        role: "MANAGER",
        storeId: "store_001",
        password: await hashPassword("test123"), // ✅ hashed
      },
      {
        id: "user_mgr2",
        name: "ghi z",
        email: "manager2@saveadollar.com",
        role: "MANAGER",
        storeId: "store_002",
        password: await hashPassword("test123"), // ✅ hashed
      },
    ],
    skipDuplicates: true,
  });

  // 3. Seed Products (Inventory Master List)
  await prisma.product.createMany({
    data: [
      {
        id: "prod_snickers",
        name: "Snickers Bar 1.86oz",
        sku: "CND-001",
        category: "Candy",
        brand: "Mars",
        defaultCost: 0.65,
        defaultPrice: 1.25,
        quantityPerBox: 24,
        returnable: true,
      },
      {
        id: "prod_kitkat",
        name: "KitKat 1.5oz",
        sku: "CND-002",
        category: "Candy",
        brand: "Nestle",
        defaultCost: 0.70,
        defaultPrice: 1.29,
        quantityPerBox: 24,
        returnable: true,
      },
      {
        id: "prod_oreo",
        name: "Oreo Cookies 6-Pack",
        sku: "CKE-003",
        category: "Cookies",
        brand: "Nabisco",
        defaultCost: 1.00,
        defaultPrice: 1.79,
        quantityPerBox: 12,
        returnable: true,
      },
      {
        id: "prod_redbull",
        name: "Red Bull 8.4oz",
        sku: "ENG-004",
        category: "Energy Drinks",
        brand: "Red Bull",
        defaultCost: 1.80,
        defaultPrice: 2.99,
        quantityPerBox: 24,
        returnable: false,
      },
      {
        id: "prod_monster",
        name: "Monster Energy 16oz",
        sku: "ENG-005",
        category: "Energy Drinks",
        brand: "Monster",
        defaultCost: 1.70,
        defaultPrice: 2.79,
        quantityPerBox: 24,
        returnable: false,
      },
      {
        id: "prod_powerade",
        name: "Powerade 20oz",
        sku: "DRK-006",
        category: "Drinks",
        brand: "Coca-Cola",
        defaultCost: 1.00,
        defaultPrice: 1.89,
        quantityPerBox: 24,
        returnable: true,
      },
      {
        id: "prod_marlboro",
        name: "Marlboro Gold Pack",
        sku: "TOB-007",
        category: "Cigarettes",
        brand: "Marlboro",
        defaultCost: 6.00,
        defaultPrice: 8.99,
        quantityPerBox: 10,
        returnable: false,
      },
      {
        id: "prod_grizzly",
        name: "Grizzly Wintergreen Long Cut",
        sku: "CHW-008",
        category: "Chews",
        brand: "Grizzly",
        defaultCost: 3.50,
        defaultPrice: 5.49,
        quantityPerBox: 10,
        returnable: false,
      },
      {
        id: "prod_fogger",
        name: "Fogger 6000 Vape",
        sku: "VAP-009",
        category: "Vapes",
        brand: "Fogger",
        defaultCost: 10.0,
        defaultPrice: 16.99,
        quantityPerBox: 10,
        returnable: false,
      },
      {
        id: "prod_windex",
        name: "Windex Glass Cleaner 23oz",
        sku: "AUT-010",
        category: "Auto",
        brand: "Windex",
        defaultCost: 2.50,
        defaultPrice: 4.99,
        quantityPerBox: 6,
        returnable: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded 10 products successfully!");

  // 5. Seed LiveInventory
await prisma.liveInventory.createMany({
  data: [
    {
      productId: (await prisma.product.findUnique({ where: { sku: "CND-001" } }))!.id,
      storeId: "store_001",
      expiry: new Date("2025-11-15"),
      quantity: 15,
      costPrice: 0.65,
      retailPrice: 1.25,
      credit: true,
      deliveryDate: new Date("2025-09-20"),
      lastSoldAt: new Date("2025-09-30"),
      reorderFlag: false,
      notes: "Steady sales rate",
    },
    {
      productId: (await prisma.product.findUnique({ where: { sku: "ENG-004" } }))!.id,
      storeId: "store_001",
      expiry: new Date("2025-11-25"),
      quantity: 25,
      costPrice: 1.80,
      retailPrice: 2.99,
      credit: false,
      deliveryDate: new Date("2025-09-22"),
      lastSoldAt: new Date("2025-09-29"),
      reorderFlag: true,
      notes: "Fast moving item",
    },
    {
      productId: (await prisma.product.findUnique({ where: { sku: "TOB-007" } }))!.id,
      storeId: "store_002",
      expiry: new Date("2026-01-10"),
      quantity: 50,
      costPrice: 6.0,
      retailPrice: 8.99,
      credit: false,
      deliveryDate: new Date("2025-09-18"),
      reorderFlag: false,
      notes: "Slow but stable sales",
    },
  ],
});

  console.log("✅ Seeded LiveInventory successfully!");

  // 5. Seed Gas Prices
  await prisma.gasPrice.deleteMany();
  await prisma.gasPrice.createMany({
    data: [
      {
        name: "Regular Fuel",
        type: "Regular",
        priceCard: 3.49,
        priceCash: 3.45,
        storeId: "store_001",
      },
      {
        name: "Plus Fuel",
        type: "Plus",
        priceCard: 3.79,
        priceCash: 3.75,
        storeId: "store_001",
      },
      {
        name: "Premium Fuel",
        type: "Premium",
        priceCard: 4.09,
        priceCash: 4.05,
        storeId: "store_001",
      },
      {
        name: "Diesel Fuel",
        type: "Diesel",
        priceCard: 3.99,
        priceCash: 3.95,
        storeId: "store_001",
      },
    ],
  });

  console.log("✅ All seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());