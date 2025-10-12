// src/pages/api/gas-prices.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const prices = await prisma.gasPrice.findMany({
      orderBy: { type: "asc" },
      select: {
        id: true,
        type: true,
        priceCard: true,
        priceCash: true,
        updatedAt: true, // ✅ Add this line
      },
    });

    res.status(200).json(prices);
  } catch (error) {
    console.error("❌ Failed to fetch gas prices:", error);
    res.status(500).json({ error: "Failed to fetch gas prices" });
  }
}