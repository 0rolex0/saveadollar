export {}; // ← Ensures it's treated as a module
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();
async function main() {
  await prisma.promoItem.createMany({
    data: [
      {
        product: "Snickers (Almond)",
        sku: "SNK-001",
        expiry: new Date("2025-08-29"),
        quantity: 8,
        credit: true,
        urgency: "High",
        strategy: "Clear soon — selling well, profit on promo",
        promoType: "Clear Stock @ $0.89",
        promoPrice: 0.89,
        costPrice: 0.65,
        regularPrice: 1.25,
      },
      {
        product: "Mountain Dew 500ml",
        sku: "MTD-002",
        expiry: new Date("2025-08-31"),
        quantity: 14,
        credit: false,
        urgency: "Medium",
        strategy: "Non-returnable — recover cost before expiry",
        promoType: "Buy 2 Save 10%",
        promoPrice: 1.25,
        costPrice: 1.40,
        regularPrice: 1.25,
      },
    ],
  });

  console.log("✅ Seeded promo items to database.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());