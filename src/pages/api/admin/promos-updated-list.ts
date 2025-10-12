// src/pages/api/admin/promos-updated-list.ts
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const logs = await prisma.promoUpdate.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(logs);
  } catch (err) {
    console.error("❌ Failed to fetch updated promos:", err);
    res.status(500).json({ error: "Failed to fetch updated promos" });
  }
}