// src/pages/api/admin/promos-delete.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { ids, user } = req.body as { ids: string[]; user?: string };

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No promo IDs provided" });
    }

    const promos = await prisma.promoItem.findMany({ where: { id: { in: ids } } });

    // Log deleted promos
    await prisma.$transaction(
      promos.map((p) =>
        prisma.deletedPromo.create({
          data: {
            promoId: p.id,
            product: p.product,
            sku: p.sku,
            expiry: p.expiry,
            quantity: p.quantity,
            costPrice: p.costPrice,
            retailPrice: p.regularPrice,
            promoPrice: p.promoPrice,
            credit: p.credit,
            storeId: p.storeId ?? null,
            reason: "manual delete",
            deletedBy: user ?? "unknown",
          },
        })
      )
    );

    // Delete from main table
    await prisma.promoItem.deleteMany({ where: { id: { in: ids } } });

    res.status(200).json({ success: true, count: ids.length });
  } catch (err) {
    console.error("❌ Error deleting promos:", err);
    res.status(500).json({ error: "Failed to delete promos" });
  }
}