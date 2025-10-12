import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { ids, user } = req.body as { ids: string[]; user?: string };
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No IDs provided" });
    }

    const items = await prisma.liveInventory.findMany({
      where: { id: { in: ids } },
      include: { product: true },
    });

    // Log each item to DeletedInventory
    await prisma.$transaction(
      items.map((item) =>
        prisma.deletedInventory.create({
          data: {
            liveItemId: item.id,
            productId: item.productId,
            productName: item.product?.name,
            sku: item.product?.sku,
            quantity: item.quantity,
            costPrice: item.costPrice,
            retailPrice: item.retailPrice,
            credit: item.credit,
            storeId: item.storeId ?? null,
            deliveryDate: item.deliveryDate,
            expiryDate: item.expiry,
            reason: "manual delete",
            deletedBy: user ?? "unknown",
          },
        })
      )
    );

    // Remove live records
    await prisma.liveInventory.deleteMany({ where: { id: { in: ids } } });

    return res.status(200).json({ success: true, count: ids.length });
  } catch (e) {
    console.error("❌ delete error", e);
    return res.status(500).json({ error: "Failed to delete" });
  }
}