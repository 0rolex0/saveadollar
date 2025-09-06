import { ExpiredItem } from "@/data/expiredItems";
import { PromoItem } from "@/data/promoItems";
import { suggestPromo, PromoSuggestion } from "@/lib/suggestPromo";

export function generatePromoItem(item: ExpiredItem): PromoItem {
  const promoSuggestion: PromoSuggestion = suggestPromo(item);  // ✅ Now typed correctly

  let promoPrice = item.regularPrice;

  if (promoSuggestion.promoType.includes("Buy 2 Save")) {
    const percentMatch = promoSuggestion.promoType.match(/Save (\d+)%/);
    const percent = percentMatch ? parseInt(percentMatch[1]) : 0;
    const total = item.regularPrice * 2;
    const discount = (percent / 100) * total;
    promoPrice = (total - discount) / 2; // price per unit
  } else if (promoSuggestion.promoType.startsWith("Clear Stock")) {
    const match = promoSuggestion.promoType.match(/@ \$(\d+(\.\d+)?)/);
    promoPrice = match ? parseFloat(match[1]) : item.regularPrice;
  }

  return {
    product: item.product,
    sku: item.sku,
    expiry: item.expiry,
    quantity: item.quantity,
    credit: item.credit,
    urgency: item.urgency,
    strategy: promoSuggestion.strategy,
    promoPrice,
    costPrice: item.credit ? 0.65 : 1.0, // fallback, replace with actual later
    promoType: promoSuggestion.promoType,
    regularPrice: item.regularPrice,
  };
}