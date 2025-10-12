// src/pages/api/admin/promos-update.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { id, updates, user } = req.body;

    if (!id || !updates) return res.status(400).json({ error: "Missing data" });

    const oldPromo = await prisma.promoItem.findUnique({ where: { id } });
    if (!oldPromo) return res.status(404).json({ error: "Promo not found" });

    // Log update snapshot
    await prisma.promoUpdate.create({
      data: {
        promoId: id,
        oldData: JSON.stringify(oldPromo),
        newData: JSON.stringify(updates),
        updatedBy: user ?? "unknown",
      },
    });

    const updatedPromo = await prisma.promoItem.update({
      where: { id },
      data: {
        product: updates.product ?? oldPromo.product,
        sku: updates.sku ?? oldPromo.sku,
        expiry: updates.expiry ? new Date(updates.expiry) : oldPromo.expiry,
        quantity: updates.quantity ?? oldPromo.quantity,
        credit:
          typeof updates.credit === "boolean" ? updates.credit : oldPromo.credit,
        urgency: updates.urgency ?? oldPromo.urgency,
        strategy: updates.strategy ?? oldPromo.strategy,
        promoType: updates.promoType ?? oldPromo.promoType,
        promoPrice: updates.promoPrice ?? oldPromo.promoPrice,
        costPrice: updates.costPrice ?? oldPromo.costPrice,
        regularPrice: updates.regularPrice ?? oldPromo.regularPrice,
      },
    });

    res.status(200).json(updatedPromo);
  } catch (err) {
    console.error("❌ Error updating promo:", err);
    res.status(500).json({ error: "Failed to update promo" });
  }
}