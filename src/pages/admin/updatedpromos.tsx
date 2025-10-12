// src/pages/admin/updatedpromos.tsx
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

type PromoUpdate = {
    id: string;
    promoId: string;
    oldData: string;
    newData: string;
    updatedBy: string;
    createdAt: string;
};

export default function UpdatedPromosPage() {
    const [logs, setLogs] = useState<PromoUpdate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const res = await fetch("/api/admin/promos-updated-list");
                const data = await res.json();
                setLogs(data);
            } catch (err) {
                console.error("Error loading updated promos:", err);
            } finally {
                setLoading(false);
            }
        };
        loadLogs();
    }, []);

    if (loading)
        return (
            <AdminShell>
                <p>Loading updated promotions...</p>
            </AdminShell>
        );

    return (
        <AdminShell>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Updated Promotions</h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm text-left">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="border px-3 py-2">Promo ID</th>
                                <th className="border px-3 py-2">Changes</th>
                                <th className="border px-3 py-2">Updated By</th>
                                <th className="border px-3 py-2">Updated At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => {
                                const oldData = JSON.parse(log.oldData);
                                const newData = JSON.parse(log.newData);
                                return (
                                    <tr key={log.id} className="bg-white hover:bg-gray-50 align-top">
                                        <td className="border px-3 py-2">{log.promoId}</td>
                                        <td className="border px-3 py-2">
                                            <ul className="list-disc ml-4">
                                                {Object.keys(newData).map((k) => {
                                                    const oldVal = oldData[k];
                                                    const newVal = newData[k];
                                                    if (oldVal !== newVal)
                                                        return (
                                                            <li key={k}>
                                                                <b>{k}</b>: {String(oldVal)} →{" "}
                                                                <span className="text-blue-600">{String(newVal)}</span>
                                                            </li>
                                                        );
                                                })}
                                            </ul>
                                        </td>
                                        <td className="border px-3 py-2">{log.updatedBy}</td>
                                        <td className="border px-3 py-2">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminShell>
    );
}