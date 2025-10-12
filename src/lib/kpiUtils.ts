// src/lib/kpiUtils.ts
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";

export async function getKpisForOwner() {
  const sevenDaysFromNow = subDays(new Date(), -7);

  const expiringItems = await prisma.liveInventory.findMany({
    where: { expiry: { lte: sevenDaysFromNow } },
    select: {
      productId: true,
      quantity: true,
    },
  });

  const uniqueProducts = new Set(expiringItems.map(i => i.productId)).size;
  const totalExpiringQty = expiringItems.reduce((sum, item) => sum + item.quantity, 0);

  const [returnableCount, nonReturnableCount, promoCount] = await Promise.all([
    prisma.liveInventory.count({ where: { credit: true } }),
    prisma.liveInventory.count({ where: { credit: false } }),
    prisma.promoItem.count(),
  ]);

  return {
    expiringProducts: uniqueProducts,
    expiringItems: totalExpiringQty,
    returnableCount,
    nonReturnableCount,
    promoCount,
  };
}

export async function getKpisForManager(storeId: string) {
  const sevenDaysFromNow = subDays(new Date(), -7);

  const expiringItems = await prisma.liveInventory.findMany({
    where: {
      storeId,
      expiry: { lte: sevenDaysFromNow },
    },
    select: {
      productId: true,
      quantity: true,
    },
  });

  const uniqueProducts = new Set(expiringItems.map(i => i.productId)).size;
  const totalExpiringQty = expiringItems.reduce((sum, item) => sum + item.quantity, 0);

  const [returnableCount, nonReturnableCount, promoCount] = await Promise.all([
    prisma.liveInventory.count({ where: { storeId, credit: true } }),
    prisma.liveInventory.count({ where: { storeId, credit: false } }),
    prisma.promoItem.count({ where: { storeId } }),
  ]);

  return {
    expiringProducts: uniqueProducts,
    expiringItems: totalExpiringQty,
    returnableCount,
    nonReturnableCount,
    promoCount,
  };
}