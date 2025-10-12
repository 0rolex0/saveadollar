// ✅ src/lib/suggestPromo.ts
export type SuggestInput = {
  quantity: number;
  daysToExpire: number;
  costPrice: number;
  retailPrice: number;
  credit: boolean;
};

export type SuggestedPromo = {
  urgency: "High" | "Medium" | "Low";
  promoType: string;
  strategy: string;
  promoPrice: number;
};

/**
 * Auto-suggests a promotion based on expiry window,
 * quantity, and credit eligibility.
 */
export function suggestPromo(input: SuggestInput): SuggestedPromo {
  const { quantity, daysToExpire, costPrice, retailPrice, credit } = input;

  let urgency: "High" | "Medium" | "Low" = "Medium";
  let promoType = "Discount";
  let strategy = "";
  let discount = 0.1; // base 10%

  // 🔸 Expiry-based urgency
  if (daysToExpire <= 3) urgency = "High";
  else if (daysToExpire <= 7) urgency = "Medium";
  else urgency = "Low";

  // 🔹 Inventory logic
  if (quantity > 20 && daysToExpire <= 5) {
    promoType = "Clearance";
    strategy = "High stock & short expiry — push sales fast";
    discount = 0.3;
  } else if (quantity <= 5 && daysToExpire > 10) {
    promoType = "Buy 2 Get 1";
    strategy = "Low stock, long expiry — small incentive";
    discount = 0.05;
  } else if (!credit && daysToExpire <= 5) {
    promoType = "Recovery";
    strategy = "Non-creditable item expiring soon — recover cost";
    discount = 0.25;
  } else {
    strategy = "Standard discount to maintain turnover";
    discount = 0.1;
  }

  // 🔹 Promo price calculation
  const promoPrice = parseFloat(
    (retailPrice * (1 - discount)).toFixed(2)
  );

  return { urgency, promoType, strategy, promoPrice };
}