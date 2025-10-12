// src/pages/api/admin/promos-deleted-list.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const deletedPromos = await prisma.deletedPromo.findMany({
      orderBy: { deletedAt: "desc" },
    });
    res.status(200).json(deletedPromos);
  } catch (err) {
    console.error("❌ Failed to load deleted promos:", err);
    res.status(500).json({ error: "Failed to fetch deleted promos" });
  }
}