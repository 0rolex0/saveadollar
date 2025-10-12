// src/components/admin/ExpiringTable.tsx
import React from "react";

interface Product {
    name: string;
    sku: string;
}

interface ExpiringItem {
    product: Product;
    expiry: string;
    quantity: number;
    credit: boolean;
    storeName?: string;
    hasPromo?: boolean;
}

export default function ExpiringTable({ items }: { items: ExpiringItem[] }) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-8 text-sm">
                🚫 No expiring items found.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow-sm">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                        <th className="py-2 px-4">Product</th>
                        <th className="py-2 px-4">SKU</th>
                        <th className="py-2 px-4">Expiry</th>
                        <th className="py-2 px-4">Qty</th>
                        <th className="py-2 px-4">Credit</th>
                        <th className="py-2 px-4">Store</th>
                        <th className="py-2 px-4">Promo?</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, idx) => (
                        <tr key={idx} className="text-sm border-t">
                            <td className="py-2 px-4">{item.product?.name || "—"}</td>
                            <td className="py-2 px-4">{item.product?.sku || "—"}</td>
                            <td className="py-2 px-4">{item.expiry}</td>
                            <td className="py-2 px-4">{item.quantity}</td>
                            <td className="py-2 px-4">{item.credit ? "Yes" : "No"}</td>
                            <td className="py-2 px-4">{item.storeName || "-"}</td>
                            <td className="py-2 px-4">
                                {item.hasPromo ? (
                                    <span className="text-green-600 font-semibold">✔</span>
                                ) : (
                                    <span className="text-gray-400">—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}