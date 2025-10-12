import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const rows = await prisma.deletedInventory.findMany({
      orderBy: { deletedAt: "desc" },
    });

    // serialize Date → string
    const safe = rows.map(r => ({
      ...r,
      deletedAt: r.deletedAt.toISOString(),
      deliveryDate: r.deliveryDate ? r.deliveryDate.toISOString() : null,
      expiryDate: r.expiryDate ? r.expiryDate.toISOString() : null,
    }));

    res.status(200).json(safe);
  } catch (e) {
    console.error("❌ Error loading deleted inventory log:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}