import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sku } = req.query;

  if (!sku || typeof sku !== "string") {
    return res.status(400).json({ error: "SKU is required" });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { sku },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Error fetching product by SKU:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}