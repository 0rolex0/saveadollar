import { PromoItem, Product } from "@prisma/client"

export function generatePromoItem(item: {
  id: string
  product: Product
  costPrice: number
  quantity: number
  credit: boolean
  expiry: Date
  storeId?: string | null  // optional field
}): PromoItem {
  const promoPrice = item.credit
    ? item.costPrice + 1.0
    : item.costPrice

  return {
    id: crypto.randomUUID(),
    product: item.product.id,
    sku: item.product.sku,
    costPrice: item.costPrice,
    regularPrice: item.product.defaultPrice,
    promoPrice,
    credit: item.credit,
    expiry: item.expiry,
    quantity: item.quantity,
    urgency: "Medium",
    strategy: item.credit ? "Small Profit" : "Recover Cost",
    promoType: "Buy 2 Get 1",
    storeId: item.storeId ?? null, // ✅ fixes the error
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}