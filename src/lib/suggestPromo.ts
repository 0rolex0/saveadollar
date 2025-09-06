import { ExpiredItem } from "@/data/expiredItems";

export type PromoSuggestion = {
  promoType: string;
  strategy: string;
};

export function suggestPromo(item: ExpiredItem): PromoSuggestion {
  if (item.credit && item.urgency === "High") {
    return {
      promoType: "Buy 2 Save 30%",
      strategy: "Clear soon — selling well, profit on promo",
    };
  }

  if (!item.credit && item.urgency === "Medium") {
    return {
      promoType: "Clear Stock @ $1.25",
      strategy: "Non-returnable — recover cost before expiry",
    };
  }

  return {
    promoType: "Watchlist",
    strategy: "Monitor weekly — low risk, may sell out",
  };
}