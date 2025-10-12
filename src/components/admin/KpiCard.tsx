// src/components/admin/KpiCard.tsx
import React from "react";

interface KpiCardProps {
    title: string;
    value: number;
    color: string;
    onClick?: () => void;
    active?: boolean;
}

export default function KpiCard({ title, value, color, onClick, active = false }: KpiCardProps) {
    return (
        <div
            className={`rounded-xl p-4 shadow-md transition cursor-pointer border-2 ${active ? "border-blue-600 ring-2 ring-blue-300" : "border-transparent"
                } ${color}`}
            onClick={onClick}
        >
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    );
}