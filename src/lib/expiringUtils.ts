// src/lib/expiringUtils.ts
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";

export async function getExpiringItems(storeId: string | null) {
  const sevenDaysFromNow = subDays(new Date(), -7);

  return prisma.liveInventory.findMany({
    where: {
      expiry: { lte: sevenDaysFromNow },
      ...(storeId ? { storeId } : {}), // only filter if manager
    },
    include: {
      product: true,
      store: true,
    },
  });
}