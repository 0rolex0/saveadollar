import { promoItems, PromoItem } from "@/data/promoItems";
import React from "react";

export default function PromosPage() {

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Promo Deals</h1>

            <table className="w-full border text-sm text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-3">Product</th>
                        <th className="py-2 px-3">SKU</th>
                        <th className="py-2 px-3">Expiry</th>
                        <th className="py-2 px-3">Qty</th>
                        <th className="py-2 px-3">Credit?</th>
                        <th className="py-2 px-3">Urgency</th>
                        <th className="py-2 px-3">Strategy</th>
                        <th className="py-2 px-3">Profit/Loss</th>
                        <th className="py-2 px-3">Promo Price</th>
                        <th className="py-2 px-3">Selling Price</th>
                    </tr>
                </thead>
                <tbody>
                    {promoItems.map((item, index) => (
                        <tr key={index} className="border-t">
                            <td className="py-2 px-3">{item.product}</td>
                            <td className="py-2 px-3">{item.sku}</td>
                            <td className="py-2 px-3">
                                {new Date(item.expiry).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </td>
                            <td className="py-2 px-3">{item.quantity}</td>
                            <td className="py-2 px-3">{item.credit ? "✅ Yes" : "❌ No"}</td>
                            <td
                                className={`py-2 px-3 font-semibold ${item.urgency === "High"
                                    ? "text-red-600"
                                    : item.urgency === "Medium"
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                    }`}
                            >
                                {item.urgency}
                            </td>
                            <td className="py-2 px-3">{item.strategy}</td>
                            <td
                                className={`py-2 px-3 font-semibold ${item.promoPrice - item.costPrice >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                ${(item.promoPrice - item.costPrice).toFixed(2)}
                            </td>
                            <td className="py-2 px-3">${item.promoPrice.toFixed(2)}</td>
                            <td className="py-2 px-3">{calculateSellingPrice(item)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
function calculateSellingPrice(item: PromoItem): string {
    if (item.promoType.includes("Buy 2 Save")) {
        const match = item.promoType.match(/Save (\d+)%/);
        const percent = match ? parseInt(match[1]) : 0;
        const total = item.regularPrice * 2;
        const discount = (percent / 100) * total;
        const final = total - discount;
        return `$${final.toFixed(2)} for 2`;
    } else if (item.promoType.startsWith("Clear Stock")) {
        const parts = item.promoType.split("@ $");
        if (parts.length === 2) {
            return `$${parseFloat(parts[1]).toFixed(2)} each`;
        }
    }
    return `$${item.regularPrice.toFixed(2)} each`;
}