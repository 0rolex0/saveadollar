import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const rows = await prisma.inventoryUpdate.findMany({
      orderBy: { updatedAt: "desc" },
    });

    const safe = rows.map(r => ({
      ...r,
      updatedAt: r.updatedAt.toISOString(),
      oldDeliveryDate: r.oldDeliveryDate ? r.oldDeliveryDate.toISOString() : null,
      newDeliveryDate: r.newDeliveryDate ? r.newDeliveryDate.toISOString() : null,
      oldExpiryDate: r.oldExpiryDate ? r.oldExpiryDate.toISOString() : null,
      newExpiryDate: r.newExpiryDate ? r.newExpiryDate.toISOString() : null,
    }));

    res.status(200).json(safe);
  } catch (e) {
    console.error("❌ Error loading updated inventory log:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}