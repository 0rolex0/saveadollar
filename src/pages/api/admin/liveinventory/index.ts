import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

// 🧠 Helper to normalize scanned/manual SKU
function normalizeSku(sku: string): string {
  return sku
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "") // remove dashes, spaces, special chars
    .replace(/^0+/, ""); // remove leading zeros
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 🔹 GET — fetch all inventory OR lookup by SKU
  if (req.method === "GET") {
    try {
      const { sku } = req.query;

      // ✅ SKU Lookup (for Add Promo and Add Inventory)
      if (sku && typeof sku === "string") {
        const normalizedSku = normalizeSku(sku);

        // Try to match SKU either with or without dashes/spaces
        const record = await prisma.liveInventory.findFirst({
          where: {
            product: {
              OR: [
                { sku: { equals: normalizedSku, mode: "insensitive" } },
                {
                  sku: {
                    equals: normalizedSku.replace(/-/g, ""),
                    mode: "insensitive",
                  },
                },
                {
                  sku: {
                    equals: normalizedSku.replace(/(\w{3})(\w{3})/, "$1-$2"),
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
          include: { product: true },
          orderBy: { updatedAt: "desc" },
        });

        if (!record) {
          return res.status(404).json({ error: "❌ Item not found" });
        }

        return res.status(200).json({
          product: record.product,
          expiry: record.expiry,
          quantity: record.quantity,
          credit: record.credit,
          costPrice: record.costPrice,
          retailPrice: record.retailPrice,
          deliveryDate: record.deliveryDate,
        });
      }

      // ✅ Default: fetch all inventory
      const inventory = await prisma.liveInventory.findMany({
        include: { product: true, store: true },
        orderBy: { expiry: "asc" },
      });

      res.status(200).json(inventory);
    } catch (err) {
      console.error("❌ Error fetching inventory:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // 🔹 POST — Add new inventory
  else if (req.method === "POST") {
    try {
      const {
        productId,
        storeId,
        expiry,
        quantity,
        costPrice,
        retailPrice,
        credit,
        deliveryDate,
      } = req.body;

      if (!productId || !storeId || !expiry || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const expiryDate = new Date(expiry);
      const delivery = deliveryDate ? new Date(deliveryDate) : new Date();

      // Always create a new record — no merging
      await prisma.liveInventory.create({
        data: {
          productId,
          storeId,
          expiry: expiryDate,
          quantity,
          costPrice,
          retailPrice,
          credit,
          deliveryDate: delivery,
        },
      });

      res.status(200).json({ message: "✅ Inventory record added successfully" });
    } catch (err) {
      console.error("❌ Error saving inventory:", err);
      res.status(500).json({ error: "Failed to save inventory" });
    }
  }

  // 🔹 Unsupported method
  else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}