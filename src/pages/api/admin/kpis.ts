import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import type { Session } from "next-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions) as Session;

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const role = session.user.role;
    const storeIdFromSession = session.user.storeId;

    // Ensure query param is always a string
    const rawStoreId = req.query.storeId;
    const storeIdFromQuery = Array.isArray(rawStoreId) ? rawStoreId[0] : rawStoreId;

    const storeId = role === "MANAGER"
      ? storeIdFromQuery || storeIdFromSession || null
      : null;

    const sevenDaysFromNow = subDays(new Date(), -7);
    const filters = storeId ? { storeId } : {};

    // Get expiring items
    const expiringItems = await prisma.liveInventory.findMany({
      where: {
        ...filters,
        expiry: { lte: sevenDaysFromNow },
      },
    });

    // Unique expiring products
    const uniqueProductIds = await prisma.liveInventory.findMany({
      where: {
        ...filters,
        expiry: { lte: sevenDaysFromNow },
      },
      select: { productId: true },
      distinct: ["productId"],
    });

    // Total quantity expiring
    const totalExpiringQty = await prisma.liveInventory.aggregate({
      _sum: { quantity: true },
      where: {
        ...filters,
        expiry: { lte: sevenDaysFromNow },
      },
    });

    // Other counts
    const [returnableCount, nonReturnableCount, promoCount, expiringWithPromo] = await Promise.all([
      prisma.liveInventory.count({
        where: { ...filters, credit: true },
      }),
      prisma.liveInventory.count({
        where: { ...filters, credit: false },
      }),
      prisma.promoItem.count({
        where: filters,
      }),
      prisma.promoItem.count({
        where: {
          ...filters,
          expiry: { lte: sevenDaysFromNow },
        },
      }),
    ]);

    return res.status(200).json({
      expiringCount: expiringItems.length,
      returnableCount,
      nonReturnableCount,
      promoCount,
      uniqueProductsCount: uniqueProductIds.length,
      totalQty: totalExpiringQty._sum.quantity || 0,
      expiringWithPromo,
    });
  } catch (err) {
    console.error("KPI API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}