// src/jobs/generatePromos.ts
import cron from "node-cron";
import { PrismaClient, LiveInventory, Product } from "@prisma/client";
import { generatePromoItem } from "@/lib/promoUtils";

const prisma = new PrismaClient();

// Run every day at 2 AM
export function startPromoCronJob() {
  cron.schedule("0 2 * * *", async () => {
    console.log("⏰ Promo cron job running...");

    // Step 1: Find expiring products (within 14 days)
    const expiringItems = await prisma.liveInventory.findMany({
      where: {
        expiry: {
          lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      },
      include: {
        product: true,
      },
    });

    console.log(`Found ${expiringItems.length} expiring items.`);

    // Step 2: Filter ones that don't already have promos
    const existingPromos = await prisma.promoItem.findMany({
      select: { id: true },
    });

    const promoIds = new Set(existingPromos.map((p) => p.id));

    const newPromos = expiringItems
      .filter((item: LiveInventory & { product: Product }) => !promoIds.has(item.id))
      .map((item: LiveInventory & { product: Product }) =>
        generatePromoItem({
          id: item.id,
          product: item.product,
          costPrice: item.costPrice,
          quantity: item.quantity,
          credit: item.credit,
          expiry: item.expiry,
          storeId: item.storeId,
        })
      );

    // Step 3: Insert new promos
    await prisma.promoItem.createMany({
      data: newPromos,
      skipDuplicates: true,
    });

    console.log(`✅ Inserted ${newPromos.length} new promos.`);
  });
}
export async function runPromoLogicNow() {
  console.log("🚀 Running promo logic manually (via button)");

  // Step 1: Find expiring products (within 14 days)
  const expiringItems = await prisma.liveInventory.findMany({
    where: {
      expiry: {
        lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Next 14 days
      },
    },
    include: {
      product: true,
    },
  });

  // Step 2: Filter ones that don't already have promos
  const existingPromos = await prisma.promoItem.findMany({
    select: { id: true },
  });

  const promoIds = new Set(existingPromos.map((p) => p.id));

  const newPromos = expiringItems
    .filter((item) => !promoIds.has(item.id))
    .map((item) =>
      generatePromoItem({
        id: item.id,
        product: item.product,
        costPrice: item.costPrice,
        quantity: item.quantity,
        credit: item.credit,
        expiry: item.expiry,
        storeId: item.storeId,
      })
    );

  // Step 3: Insert new promos
  await prisma.promoItem.createMany({
    data: newPromos,
    skipDuplicates: true,
  });

  console.log(`✅ Inserted ${newPromos.length} promos manually.`);
}