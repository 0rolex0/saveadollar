// ✅ src/pages/api/admin/liveinventory.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 🔹 SKU Lookup (for promos.tsx)
    if (req.method === "GET" && req.query.sku) {
      const sku = String(req.query.sku).trim().toUpperCase().replace(/^0+/, "");

      const item = await prisma.liveInventory.findFirst({
        where: {
          product: { sku: { equals: sku, mode: "insensitive" } },
        },
        include: { product: true, store: true },
        orderBy: { expiry: "asc" },
      });

      if (!item) return res.status(404).json({ error: "Not found" });

      return res.status(200).json({
        product: item.product,
        store: item.store,
        quantity: item.quantity,
        expiry: item.expiry,
        credit: item.credit,
        costPrice: item.costPrice,
        retailPrice: item.retailPrice,
      });
    }

    // 🔹 Regular GET — Group by all relevant fields
    if (req.method === "GET") {
      const inventory = await prisma.liveInventory.findMany({
        include: { product: true, store: true },
        orderBy: { expiry: "asc" },
      });

      const grouped = Object.values(
        inventory.reduce((acc: any, item) => {
          const key = `${item.productId}_${item.expiry.toISOString().split("T")[0]}_${item.deliveryDate
            .toISOString()
            .split("T")[0]}_${item.credit}_${item.costPrice}_${item.retailPrice}`;
          if (!acc[key]) {
            acc[key] = { ...item, quantity: 0, deliveriesCount: 0 };
          }
          acc[key].quantity += item.quantity;
          acc[key].deliveriesCount += 1;
          return acc;
        }, {})
      );

      return res.status(200).json(grouped);
    }

    // 🔹 Add inventory
    if (req.method === "POST") {
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

      if (!productId || !storeId || !expiry || !quantity)
        return res.status(400).json({ error: "Missing required fields" });

      const expiryDate = new Date(expiry);
      const delivery = new Date(deliveryDate);

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

      return res.status(200).json({ message: "New record added" });
    }

    res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    console.error("❌ Error in LiveInventory:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}