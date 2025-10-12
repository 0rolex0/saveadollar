// src/pages/admin/deletedpromos.tsx
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type DeletedPromo = {
    id: string;
    product: string;
    sku: string;
    expiry: string;
    quantity: number;
    costPrice: number;
    retailPrice: number;
    promoPrice: number;
    credit: boolean;
    reason: string;
    deletedBy: string;
    deletedAt: string;
};

export default function DeletedPromosPage() {
    const [items, setItems] = useState<DeletedPromo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDeletedPromos = async () => {
            try {
                const res = await fetch("/api/admin/promos-deleted-list");
                const data = await res.json();
                setItems(data);
            } catch (err) {
                console.error("Error loading deleted promos:", err);
            } finally {
                setLoading(false);
            }
        };
        loadDeletedPromos();
    }, []);

    if (loading)
        return (
            <AdminShell>
                <p>Loading deleted promotions...</p>
            </AdminShell>
        );

    return (
        <AdminShell>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Deleted Promotions
                </h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm text-left">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="border px-3 py-2">Product</th>
                                <th className="border px-3 py-2">SKU</th>
                                <th className="border px-3 py-2">Expiry</th>
                                <th className="border px-3 py-2">Qty</th>
                                <th className="border px-3 py-2">Cost</th>
                                <th className="border px-3 py-2">Retail</th>
                                <th className="border px-3 py-2">Promo Price</th>
                                <th className="border px-3 py-2">Credit?</th>
                                <th className="border px-3 py-2">Reason</th>
                                <th className="border px-3 py-2">Deleted By</th>
                                <th className="border px-3 py-2">Deleted At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((p) => (
                                <tr key={p.id} className="bg-white hover:bg-gray-50">
                                    <td className="border px-3 py-2">{p.product}</td>
                                    <td className="border px-3 py-2">{p.sku}</td>
                                    <td className="border px-3 py-2">
                                        {new Date(p.expiry).toLocaleDateString()}
                                    </td>
                                    <td className="border px-3 py-2">{p.quantity}</td>
                                    <td className="border px-3 py-2">${p.costPrice.toFixed(2)}</td>
                                    <td className="border px-3 py-2">${p.retailPrice.toFixed(2)}</td>
                                    <td className="border px-3 py-2">${p.promoPrice.toFixed(2)}</td>
                                    <td className="border px-3 py-2">{p.credit ? "✅" : "❌"}</td>
                                    <td className="border px-3 py-2">{p.reason}</td>
                                    <td className="border px-3 py-2">{p.deletedBy}</td>
                                    <td className="border px-3 py-2">
                                        {new Date(p.deletedAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}