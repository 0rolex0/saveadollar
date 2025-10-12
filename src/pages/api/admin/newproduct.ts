import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error adding new product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
}