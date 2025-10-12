import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type DeletedRow = {
    id: string;
    liveItemId?: string | null;
    productId?: string | null;
    productName?: string | null;
    sku?: string | null;
    quantity?: number | null;
    costPrice?: number | null;
    retailPrice?: number | null;
    credit?: boolean | null;
    storeId?: string | null;
    deliveryDate?: string | null; // ISO from API
    expiryDate?: string | null;   // ISO from API
    reason?: string | null;
    deletedBy?: string | null;
    deletedAt: string;            // ISO from API
};

export default function DeletedLiveInventoryPage() {
    const [rows, setRows] = useState<DeletedRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const r = await fetch("/api/admin/deletedinventory");
                const data = await r.json();
                setRows(data);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <AdminShell><p className="p-6">Loading…</p></AdminShell>;

    return (
        <AdminShell>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Deleted Live Inventory (Audit Log)</h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="border px-3 py-2">Deleted At</th>
                                <th className="border px-3 py-2">Deleted By</th>
                                <th className="border px-3 py-2">SKU</th>
                                <th className="border px-3 py-2">Product</th>
                                <th className="border px-3 py-2">Qty</th>
                                <th className="border px-3 py-2">Cost</th>
                                <th className="border px-3 py-2">Retail</th>
                                <th className="border px-3 py-2">Credit</th>
                                <th className="border px-3 py-2">Delivery</th>
                                <th className="border px-3 py-2">Expiry</th>
                                <th className="border px-3 py-2">Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.id} className="bg-white hover:bg-gray-50">
                                    <td className="border px-3 py-2">{fmtDate(row.deletedAt)}</td>
                                    <td className="border px-3 py-2">{row.deletedBy ?? "-"}</td>
                                    <td className="border px-3 py-2">{row.sku ?? "-"}</td>
                                    <td className="border px-3 py-2">{row.productName ?? "-"}</td>
                                    <td className="border px-3 py-2">{row.quantity ?? "-"}</td>
                                    <td className="border px-3 py-2">{fmtMoney(row.costPrice)}</td>
                                    <td className="border px-3 py-2">{fmtMoney(row.retailPrice)}</td>
                                    <td className="border px-3 py-2">{boolIcon(row.credit)}</td>
                                    <td className="border px-3 py-2">{fmtDate(row.deliveryDate)}</td>
                                    <td className="border px-3 py-2">{fmtDate(row.expiryDate)}</td>
                                    <td className="border px-3 py-2">{row.reason ?? "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}

function fmtDate(iso?: string | null) {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString();
}
function fmtMoney(n?: number | null) {
    if (n == null) return "-";
    return `$${n.toFixed(2)}`;
}
function boolIcon(b?: boolean | null) {
    if (b == null) return "-";
    return b ? "✅" : "❌";
}