import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type UpdateRow = {
    id: string;
    liveItemId?: string | null;
    productId?: string | null;
    productName?: string | null;
    sku?: string | null;
    oldQuantity?: number | null;
    newQuantity?: number | null;
    oldCostPrice?: number | null;
    newCostPrice?: number | null;
    oldRetailPrice?: number | null;
    newRetailPrice?: number | null;
    oldDeliveryDate?: string | null;
    newDeliveryDate?: string | null;
    oldExpiryDate?: string | null;
    newExpiryDate?: string | null;
    creditChanged?: boolean | null;
    storeId?: string | null;
    updatedBy?: string | null;
    updatedAt: string; // ISO
};

export default function UpdatedLiveInventoryPage() {
    const [rows, setRows] = useState<UpdateRow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const r = await fetch("/api/admin/updatedinventory");
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
                <h1 className="text-2xl font-bold mb-4">Updated Live Inventory (Audit Log)</h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="border px-3 py-2">Updated At</th>
                                <th className="border px-3 py-2">Updated By</th>
                                <th className="border px-3 py-2">SKU</th>
                                <th className="border px-3 py-2">Product</th>
                                <th className="border px-3 py-2">Qty</th>
                                <th className="border px-3 py-2">Cost</th>
                                <th className="border px-3 py-2">Retail</th>
                                <th className="border px-3 py-2">Delivery</th>
                                <th className="border px-3 py-2">Expiry</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.id} className="bg-white hover:bg-gray-50 align-top">
                                    <td className="border px-3 py-2">{fmtDate(row.updatedAt)}</td>
                                    <td className="border px-3 py-2">{row.updatedBy ?? "-"}</td>
                                    <td className="border px-3 py-2">{row.sku ?? "-"}</td>
                                    <td className="border px-3 py-2">{row.productName ?? "-"}</td>

                                    <td className="border px-3 py-2">
                                        {diffCell(row.oldQuantity, row.newQuantity)}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {diffMoney(row.oldCostPrice, row.newCostPrice)}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {diffMoney(row.oldRetailPrice, row.newRetailPrice)}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {diffDate(row.oldDeliveryDate, row.newDeliveryDate)}
                                    </td>
                                    <td className="border px-3 py-2">
                                        {diffDate(row.oldExpiryDate, row.newExpiryDate)}
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
function diffCell(oldV?: number | null, newV?: number | null) {
    const o = oldV ?? "-";
    const n = newV ?? "-";
    return (
        <div>
            <div className="text-gray-500 line-through">{String(o)}</div>
            <div className="font-semibold">{String(n)}</div>
        </div>
    );
}
function diffMoney(oldV?: number | null, newV?: number | null) {
    const o = oldV == null ? "-" : `$${oldV.toFixed(2)}`;
    const n = newV == null ? "-" : `$${newV.toFixed(2)}`;
    return (
        <div>
            <div className="text-gray-500 line-through">{o}</div>
            <div className="font-semibold">{n}</div>
        </div>
    );
}
function diffDate(oldIso?: string | null, newIso?: string | null) {
    const o = fmtDate(oldIso);
    const n = fmtDate(newIso);
    return (
        <div>
            <div className="text-gray-500 line-through">{o}</div>
            <div className="font-semibold">{n}</div>
        </div>
    );
}