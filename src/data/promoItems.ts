export type PromoItem = {
  product: string;
  sku: string;
  expiry: string;
  quantity: number;
  credit: boolean;
  urgency: "High" | "Medium" | "Low";
  strategy: string;
  promoPrice: number;
  costPrice: number;
  promoType: string;
  regularPrice: number;
};

export const promoItems: PromoItem[] = [
  {
    product: "Snickers (Almond)",
    sku: "SNK-001",
    expiry: "2025-08-30",
    quantity: 8,
    credit: true,
    urgency: "High",
    strategy: "Clear soon — selling well, profit on promo",
    promoPrice: 0.89,
    costPrice: 0.65,
    promoType: "Buy 2 Save 30%",
    regularPrice: 0.89,
  },
  {
    product: "Mountain Dew 500ml",
    sku: "MTD-002",
    expiry: "2025-09-01",
    quantity: 14,
    credit: false,
    urgency: "Medium",
    strategy: "Non-returnable — recover cost before expiry",
    promoPrice: 1.25,
    costPrice: 1.4,
    promoType: "Clear Stock @ $1.25",
    regularPrice: 1.49,
  },
];
