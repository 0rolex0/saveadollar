import { runPromoLogicNow } from "@/jobs/generatePromos";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await runPromoLogicNow();
    res.status(200).json({ message: "Promo generation triggered manually." });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate promos." });
  }
}