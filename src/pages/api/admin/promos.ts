// src/pages/api/admin/promos.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ✅ GET — Fetch all promo items
  if (req.method === "GET") {
    try {
      const promos = await prisma.promoItem.findMany({
        orderBy: { expiry: "asc" },
      });
      res.status(200).json(promos);
    } catch (err) {
      console.error("❌ Error fetching promos:", err);
      res.status(500).json({ error: "Failed to fetch promos" });
    }
  }

  // ✅ POST — Add new promo
  else if (req.method === "POST") {
    try {
      const {
        product,
        sku,
        expiry,
        quantity,
        credit,
        urgency,
        strategy,
        promoType,
        promoPrice,
        costPrice,
        regularPrice,
        storeId,
      } = req.body;

      if (!product || !sku || !expiry) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newPromo = await prisma.promoItem.create({
        data: {
          product,
          sku,
          expiry: new Date(expiry),
          quantity: Number(quantity),
          credit: Boolean(credit),
          urgency: urgency || "Medium",
          strategy: strategy || "Auto",
          promoType: promoType || "Standard",
          promoPrice: Number(promoPrice),
          costPrice: Number(costPrice),
          regularPrice: Number(regularPrice),
          storeId: storeId || null,
        },
      });

      res.status(200).json(newPromo);
    } catch (err) {
      console.error("❌ Error adding promo:", err);
      res.status(500).json({ error: "Failed to add promo" });
    }
  }

  // ❌ Method not allowed
  else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}