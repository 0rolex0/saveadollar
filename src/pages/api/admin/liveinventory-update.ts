import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { id, updates, user } = req.body as {
      id: string;
      updates: {
        quantity?: number;
        costPrice?: number;
        retailPrice?: number;
        deliveryDate?: string | Date;
        expiry?: string | Date;
        credit?: boolean;
      };
      user?: string;
    };

    if (!id || !updates) return res.status(400).json({ error: "Missing data" });

    // Fetch old (with product once)
    const old = await prisma.liveInventory.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!old) return res.status(404).json({ error: "Item not found" });

    // Normalize dates
    const newDeliveryDate =
      updates.deliveryDate ? new Date(updates.deliveryDate) : old.deliveryDate;
    const newExpiry = updates.expiry ? new Date(updates.expiry) : old.expiry;

    // Log change snapshot
    await prisma.inventoryUpdate.create({
      data: {
        liveItemId: id,
        productId: old.productId,
        productName: old.product?.name,
        sku: old.product?.sku,
        oldQuantity: old.quantity,
        newQuantity: updates.quantity ?? old.quantity,
        oldCostPrice: old.costPrice,
        newCostPrice: updates.costPrice ?? old.costPrice,
        oldRetailPrice: old.retailPrice,
        newRetailPrice: updates.retailPrice ?? old.retailPrice,
        oldDeliveryDate: old.deliveryDate,
        newDeliveryDate,
        oldExpiryDate: old.expiry,
        newExpiryDate: newExpiry,
        creditChanged:
          typeof updates.credit === "boolean" ? updates.credit !== old.credit : false,
        storeId: old.storeId ?? null,
        updatedBy: user ?? "unknown",
      },
    });

    // Whitelist fields for update (avoid sending nested product, etc.)
    const safeData: any = {};
    if (typeof updates.quantity === "number") safeData.quantity = updates.quantity;
    if (typeof updates.costPrice === "number") safeData.costPrice = updates.costPrice;
    if (typeof updates.retailPrice === "number") safeData.retailPrice = updates.retailPrice;
    if (typeof updates.credit === "boolean") safeData.credit = updates.credit;
    if (updates.deliveryDate) safeData.deliveryDate = newDeliveryDate;
    if (updates.expiry) safeData.expiry = newExpiry;

    const updated = await prisma.liveInventory.update({
      where: { id },
      data: safeData,
    });

    return res.status(200).json(updated);
  } catch (e) {
    console.error("❌ update error", e);
    return res.status(500).json({ error: "Failed to update" });
  }
}