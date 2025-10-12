// ✅ src/pages/api/admin/products.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 🔹 SKU Lookup (used by promos.tsx)
    if (req.method === "GET" && req.query.sku) {
      const sku = String(req.query.sku).trim().toUpperCase().replace(/^0+/, "");

      const product = await prisma.product.findFirst({
        where: { sku: { equals: sku, mode: "insensitive" } },
      });

      if (!product) return res.status(404).json({ error: "Product not found" });

      return res.status(200).json(product);
    }

    // 🔹 Get all products (master list)
    if (req.method === "GET") {
      const products = await prisma.product.findMany();
      return res.status(200).json(products);
    }

    // 🔹 Add new product
    if (req.method === "POST") {
      const {
        name,
        sku,
        category,
        brand,
        defaultCost,
        defaultPrice,
        quantityPerBox,
        returnable,
      } = req.body;

      if (!name || !sku)
        return res.status(400).json({ error: "Missing required fields" });

      const newProduct = await prisma.product.create({
        data: {
          name,
          sku,
          category,
          brand,
          defaultCost,
          defaultPrice,
          quantityPerBox,
          returnable,
        },
      });

      return res.status(201).json(newProduct);
    }

    res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
}