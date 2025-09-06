import { promoItems, PromoItem } from "@/data/promoItems";
import React from "react";

export default function PromosPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Promo Deals</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Product</th>
                            <th className="border border-gray-300 px-4 py-2">SKU</th>
                            <th className="border border-gray-300 px-4 py-2">Expiry</th>
                            <th className="border border-gray-300 px-4 py-2">Qty</th>
                            <th className="border border-gray-300 px-4 py-2">Credit?</th>
                            <th className="border border-gray-300 px-4 py-2">Urgency</th>
                            <th className="border border-gray-300 px-4 py-2">Strategy</th>
                            <th className="border border-gray-300 px-4 py-2">Profit/Loss</th>
                            <th className="border border-gray-300 px-4 py-2">Promo Price</th>
                            <th className="border border-gray-300 px-4 py-2">Selling Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promoItems.map((item: PromoItem, index: number) => {
                            const profit = item.promoPrice - item.costPrice;
                            const isProfit = profit >= 0;

                            return (
                                <tr key={index} className="bg-white hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">{item.product}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.sku}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(item.expiry).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {item.credit ? "✅ Yes" : "❌ No"}
                                    </td>
                                    <td className={`border border-gray-300 px-4 py-2 font-semibold ${item.urgency === "High"
                                        ? "text-red-600"
                                        : item.urgency === "Medium"
                                            ? "text-yellow-600"
                                            : "text-green-600"
                                        }`}>
                                        {item.urgency}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{item.strategy}</td>
                                    <td className={`border border-gray-300 px-4 py-2 font-semibold flex items-center gap-1 ${isProfit ? "text-green-600" : "text-red-600"
                                        }`}>
                                        {isProfit ? "✅" : "❌"} ${profit.toFixed(2)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">${item.promoPrice.toFixed(2)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{calculateSellingPrice(item)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
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