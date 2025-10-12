// src/pages/api/admin/expiring.ts
import { getExpiringItems } from "@/lib/expiringUtils";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { subDays } from "date-fns";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const storeId = req.query.storeId as string | undefined;
  const filters = storeId ? { storeId } : {};

  const items = await getExpiringItems(storeId || null);

  // Fetch promos related to expiring items (7 days or less)
  const promoItems = await prisma.promoItem.findMany({
    where: {
      ...filters,
      expiry: { lte: subDays(new Date(), -7) },
    },
    select: {
      sku: true,
    },
  });

  res.status(200).json({
    items,
    promos: promoItems,
  });
}