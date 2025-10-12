// src/pages/admin/newproduct.tsx
import React, { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";

export default function NewProductPage() {
    const [form, setForm] = useState({
        name: "",
        sku: "",
        brand: "",
        category: "",
        defaultCost: "",
        defaultPrice: "",
        quantityPerBox: "",
        returnable: false,
    });

    // 🛠 Fixed handleChange function
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;

        const { name, value } = target;

        // If it's a checkbox, we handle it separately
        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            setForm((prev) => ({ ...prev, [name]: target.checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/admin/newproduct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                defaultCost: parseFloat(form.defaultCost),
                defaultPrice: parseFloat(form.defaultPrice),
                quantityPerBox: parseInt(form.quantityPerBox),
            }),
        });

        if (res.ok) {
            alert("✅ Product added successfully!");
            setForm({
                name: "",
                sku: "",
                brand: "",
                category: "",
                defaultCost: "",
                defaultPrice: "",
                quantityPerBox: "",
                returnable: false,
            });
        } else {
            alert("❌ Failed to add product");
        }
    };

    return (
        <AdminShell>
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8 mt-6">
                <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
                    <input name="sku" placeholder="SKU (e.g., CND-101)" value={form.sku} onChange={handleChange} className="w-full border p-2 rounded" required />
                    <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} className="w-full border p-2 rounded" required />

                    <select name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" required>
                        <option value="">Select Category</option>
                        {["Auto", "Beer", "Candy", "Cigarette", "Deli", "Ecig", "Grocery", "HBA", "Liquor", "Tobacco", "Vapes"].map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <input name="defaultCost" type="number" placeholder="Default Cost" value={form.defaultCost} onChange={handleChange} className="w-full border p-2 rounded" required />
                    <input name="defaultPrice" type="number" placeholder="Default Price" value={form.defaultPrice} onChange={handleChange} className="w-full border p-2 rounded" required />
                    <input name="quantityPerBox" type="number" placeholder="Units per Box" value={form.quantityPerBox} onChange={handleChange} className="w-full border p-2 rounded" required />

                    <label className="flex items-center space-x-2">
                        <input type="checkbox" name="returnable" checked={form.returnable} onChange={handleChange} />
                        <span>Credit Eligible (Returnable)</span>
                    </label>

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold">
                        Save Product
                    </button>
                </form>
            </div>
        </AdminShell>
    );
}