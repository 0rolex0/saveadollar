// src/pages/api/hello.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { startPromoCronJob } from "@/jobs/generatePromos"; // ✅ Make sure this file exports the function

// ⏰ Start the cron when server boots
startPromoCronJob();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ message: "Hello from promo cron!" });
}