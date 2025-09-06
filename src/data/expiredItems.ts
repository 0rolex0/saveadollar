export type ExpiredItem = {
  product: string;
  sku: string;
  expiry: string;
  quantity: number;
  credit: boolean;
  urgency: "High" | "Medium" | "Low";
  strategy: string;
  promoType: string;
  regularPrice: number;
};

export const expiredItems: ExpiredItem[] = [
  {
    product: "Snickers (Almond)",
    sku: "SNK-001",
    expiry: "2025-08-30",
    quantity: 8,
    credit: true,
    urgency: "High",
    strategy: "Clear soon — selling well, promo works",
    promoType: "Buy 2 Save 30%",
    regularPrice: 1.49,
  },
  {
    product: "Mountain Dew 500ml",
    sku: "MTD-002",
    expiry: "2025-09-01",
    quantity: 14,
    credit: false,
    urgency: "Medium",
    strategy: "Non-returnable — recover cost before expiry",
    promoType: "Clear Stock @ $1.25",
    regularPrice: 1.49,
  },
  {
    product: "Beef Jerky Teriyaki",
    sku: "BJT-009",
    expiry: "2025-09-10",
    quantity: 6,
    credit: true,
    urgency: "Low",
    strategy: "Monitor weekly — low risk, may sell out",
    promoType: "Watchlist",
    regularPrice: 2.99,
  },
];