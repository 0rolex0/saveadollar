// src/pages/api/admin/products/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { product, alsoLive, live } = req.body as {
      product: {
        name: string;
        sku: string;
        category: string;
        brand?: string;
        defaultCost: number;
        defaultPrice: number;
        quantityPerBox: number;
        returnable: boolean;
      };
      alsoLive?: boolean;
      live?: {
        expiry: string;
        deliveryDate: string;
        quantity: number;
        costPrice: number;
        retailPrice: number;
        credit: boolean;
      };
    };

    if (!product?.name || !product?.sku || !product?.category) {
      return res.status(400).json({ error: "Missing product fields" });
    }

    const created = await prisma.product.create({
      data: {
        name: product.name,
        sku: product.sku,
        category: product.category,
        brand: product.brand ?? "",
        defaultCost: Number(product.defaultCost ?? 0),
        defaultPrice: Number(product.defaultPrice ?? 0),
        quantityPerBox: Number(product.quantityPerBox ?? 1),
        returnable: Boolean(product.returnable),
      },
    });

    if (alsoLive && live) {
      await prisma.liveInventory.create({
        data: {
          productId: created.id,
          expiry: new Date(live.expiry),
          deliveryDate: new Date(live.deliveryDate),
          quantity: Number(live.quantity ?? 1),
          costPrice: Number(live.costPrice ?? created.defaultCost ?? 0),
          retailPrice: Number(live.retailPrice ?? created.defaultPrice ?? 0),
          credit: Boolean(live.credit),
        },
      });
    }

    res.status(200).json({ ok: true, productId: created.id });
  } catch (e: any) {
    if (e?.code === "P2002") {
      // unique constraint (e.g., SKU)
      return res.status(409).json({ error: "SKU already exists" });
    }
    console.error("create product error:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
}