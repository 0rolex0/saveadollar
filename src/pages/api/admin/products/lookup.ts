// src/pages/api/admin/products/lookup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sku = (req.query.sku as string)?.trim();
    if (!sku) return res.status(400).json({ error: "SKU is required" });

    const product = await prisma.product.findUnique({ where: { sku } });
    if (!product) return res.status(404).json({ error: "Not found" });

    res.status(200).json(product);
  } catch (e) {
    console.error("lookup error:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}