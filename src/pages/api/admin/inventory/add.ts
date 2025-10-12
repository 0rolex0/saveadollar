// src/pages/api/admin/inventory/add.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { productId, expiry, quantity, costPrice, retailPrice, credit, deliveryDate } = req.body;

    if (!productId || !expiry || !deliveryDate || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const item = await prisma.liveInventory.create({
      data: {
        productId,
        expiry: new Date(expiry),
        quantity: Number(quantity),
        costPrice: Number(costPrice ?? 0),
        retailPrice: Number(retailPrice ?? 0),
        credit: Boolean(credit),
        deliveryDate: new Date(deliveryDate),
        // storeId: you can attach from session later if needed
      },
      include: { product: true },
    });

    res.status(200).json(item);
  } catch (e) {
    console.error("add inventory error:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}