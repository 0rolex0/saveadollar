// ✅ src/pages/admin/liveinventory.tsx
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type Product = {
    id: string;
    name: string;
    sku: string;
    category: string;
    brand: string;
    defaultCost: number;
    defaultPrice: number;
    quantityPerBox: number;
    returnable: boolean | null;
};

export default function LiveInventoryPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const currentUser = session?.user?.name || "unknown";

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // modals and states
    const [showSkuModal, setShowSkuModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showNotFound, setShowNotFound] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    // inputs
    const [skuInput, setSkuInput] = useState("");
    const [product, setProduct] = useState<Product | null>(null);
    const [quantityBoxes, setQuantityBoxes] = useState(1);
    const [credit, setCredit] = useState<boolean | null>(null);
    const [expiryDate, setExpiryDate] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");

    // fetch inventory
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await fetch("/api/admin/liveinventory");
                const data = await res.json();
                setItems(data);
            } catch (err) {
                console.error("Error loading inventory:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    // lookup SKU
    const handleSkuLookup = async () => {
        if (!skuInput.trim()) return;
        const normalizedSku = skuInput.trim().toUpperCase().replace(/^0+/, "");

        try {
            const res = await fetch(`/api/admin/products?sku=${normalizedSku}`);
            const data = await res.json();
            if (!data || !data.id) {
                setShowSkuModal(false);
                setShowNotFound(true);
                setSkuInput(""); // clear old SKU input
                return;
            }
            setProduct(data);
            setCredit(data.returnable);
            setShowSkuModal(false);
            setShowProductModal(true);
        } catch {
            setShowSkuModal(false);
            setShowNotFound(true);
        }
    };

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSkuLookup();
    };

    const resetInputs = () => {
        setSkuInput("");
        setProduct(null);
        setQuantityBoxes(1);
        setCredit(null);
        setExpiryDate("");
        setDeliveryDate("");
    };

    // add new inventory
    const handleSaveInventory = async () => {
        if (!product || !expiryDate || !deliveryDate) {
            alert("Please fill in expiry and delivery dates before saving.");
            return;
        }

        const expiry = new Date(`${expiryDate}T12:00:00`);
        const delivery = new Date(`${deliveryDate}T12:00:00`);
        if (expiry < new Date()) {
            alert("❌ Expiry date cannot be in the past.");
            return;
        }

        const payload = {
            productId: product.id,
            storeId: "store_001",
            expiry: expiry.toISOString(),
            quantity: quantityBoxes * (product.quantityPerBox || 1),
            costPrice: product.defaultCost,
            retailPrice: product.defaultPrice,
            credit: credit ?? false,
            deliveryDate: delivery.toISOString(),
            createdBy: currentUser,
        };

        const res = await fetch("/api/admin/liveinventory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const data = await fetch("/api/admin/liveinventory").then((r) => r.json());
            setItems(data);
            setShowProductModal(false);
            resetInputs();
            setToastMessage("✅ Inventory added successfully!");
            setTimeout(() => setToastMessage(null), 2500);
        } else alert("❌ Failed to save inventory");
    };

    // checkbox toggle
    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // delete selected
    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm("Are you sure you want to delete selected items?")) return;

        const remaining = items.filter((i) => !selectedIds.includes(i.id));
        setItems(remaining);

        await fetch("/api/admin/liveinventory-delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: selectedIds, user: currentUser }),
        });

        setSelectedIds([]);
        setToastMessage("🗑️ Items deleted (logged)");
        setTimeout(() => setToastMessage(null), 2500);
    };

    // open update modal
    const handleUpdateItem = () => {
        if (selectedIds.length !== 1) {
            alert("Select exactly one item to update.");
            return;
        }
        const item = items.find((i) => i.id === selectedIds[0]);
        if (!item) return;
        setEditingItem(item);
    };

    // safe date normalization
    const normalizeDate = (date: string | null | undefined): string | undefined => {
        if (!date) return undefined;
        if (date.includes("T")) {
            try {
                return new Date(date).toISOString();
            } catch {
                return undefined;
            }
        }
        try {
            return new Date(`${date}T12:00:00`).toISOString();
        } catch {
            return undefined;
        }
    };

    // save update
    const handleSaveUpdate = async () => {
        if (!editingItem) return;

        const updates = {
            quantity: Number(editingItem.quantity),
            costPrice: Number(editingItem.costPrice),
            retailPrice: Number(editingItem.retailPrice),
            deliveryDate: normalizeDate(editingItem.deliveryDate),
            expiry: normalizeDate(editingItem.expiry),
            credit:
                typeof editingItem.credit === "boolean" ? editingItem.credit : undefined,
        };

        const res = await fetch("/api/admin/liveinventory-update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingItem.id, updates, user: currentUser }),
        });

        if (res.ok) {
            const data = await fetch("/api/admin/liveinventory").then((r) => r.json());
            setItems(data);
            setEditingItem(null);
            setSelectedIds([]);
            setToastMessage("✅ Item updated successfully!");
            setTimeout(() => setToastMessage(null), 2500);
        } else alert("❌ Update failed");
    };

    if (loading) return <AdminShell><p>Loading inventory...</p></AdminShell>;

    const handleNotFoundEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            setShowNotFound(false);
            router.push("/admin/newproduct");
        }
    };

    return (
        <AdminShell>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Live Inventory</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setEditMode((v) => !v);
                                setSelectedIds([]); // clear selections on toggle
                            }}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md"
                        >
                            {editMode ? "Exit Edit Mode" : "✏️ Edit Mode"}
                        </button>
                        {editMode && selectedIds.length > 0 && (
                            <>
                                <button
                                    onClick={handleUpdateItem}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={handleDeleteSelected}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setShowSkuModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        >
                            + Add Inventory
                        </button>
                        <button
                            onClick={() => router.push("/admin/newproduct")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                        >
                            + Add New Item
                        </button>
                    </div>
                </div>

                {/* inventory table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                {editMode && <th className="border px-2 py-2">Select</th>}
                                <th className="border px-4 py-2">SKU</th>
                                <th className="border px-4 py-2">Product</th>
                                <th className="border px-4 py-2">Category</th>
                                <th className="border px-4 py-2">Brand</th>
                                <th className="border px-4 py-2">Expiry</th>
                                <th className="border px-4 py-2">Quantity</th>
                                <th className="border px-4 py-2">Cost</th>
                                <th className="border px-4 py-2">Retail</th>
                                <th className="border px-4 py-2">Credit?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="bg-white hover:bg-gray-50">
                                    {editMode && (
                                        <td className="border text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(item.id)}
                                                onChange={() => toggleSelect(item.id)}
                                            />
                                        </td>
                                    )}
                                    <td className="border px-4 py-2">{item.product?.sku}</td>
                                    <td className="border px-4 py-2">{item.product?.name}</td>
                                    <td className="border px-4 py-2">{item.product?.category}</td>
                                    <td className="border px-4 py-2">{item.product?.brand}</td>
                                    <td className="border px-4 py-2">
                                        {new Date(item.expiry).toLocaleDateString()}
                                    </td>
                                    <td className="border px-4 py-2">{item.quantity}</td>
                                    <td className="border px-4 py-2">${item.costPrice.toFixed(2)}</td>
                                    <td className="border px-4 py-2">${item.retailPrice.toFixed(2)}</td>
                                    <td className="border px-4 py-2">{item.credit ? "✅" : "❌"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Add Inventory – SKU Modal */}
                {showSkuModal && (
                    <Modal onClose={() => { setShowSkuModal(false); resetInputs(); }}>
                        <h2 className="text-lg font-semibold mb-3 text-center">Enter Barcode / SKU</h2>
                        <input
                            type="text"
                            value={skuInput}
                            onChange={(e) => setSkuInput(e.target.value)}
                            onKeyDown={handleEnterKey}
                            placeholder="e.g. CND-001 or 0007134134"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:ring focus:ring-blue-300 focus:outline-none"
                        />
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleSkuLookup}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                            >
                                Next →
                            </button>
                            <button
                                onClick={() => { setShowSkuModal(false); resetInputs(); }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </Modal>
                )}
                {/* ❌ Not Found Modal */}
                {showNotFound && (
                    <Modal onClose={() => setShowNotFound(false)}>
                        <div
                            tabIndex={0}
                            onKeyDown={handleNotFoundEnter}
                            className="focus:outline-none"
                        >
                            <h2 className="text-lg font-semibold text-center text-red-600 mb-4">
                                ❌ Item Not Found
                            </h2>
                            <p className="text-gray-700 text-center mb-4">
                                The entered SKU doesn’t match any existing product.<br />
                                Would you like to add this as a new item?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => {
                                        setShowNotFound(false);
                                        router.push("/admin/newproduct");
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
                                >
                                    ➕ Add New Item
                                </button>
                                <button
                                    onClick={() => {
                                        setShowNotFound(false);
                                        resetInputs();
                                    }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-3">
                                (Press <strong>Enter</strong> to add a new item)
                            </p>
                        </div>
                    </Modal>
                )}
                {/* Product Details Modal (After SKU Lookup) */}
                {showProductModal && product && (
                    <Modal onClose={() => { setShowProductModal(false); resetInputs(); }}>
                        <h2 className="text-xl font-bold text-center mb-4">Add Inventory Details</h2>

                        <div className="space-y-2 text-sm">
                            <Input label="Product Name" value={product.name} onChange={(v) => setProduct({ ...product, name: v })} />
                            <Input label="Brand" value={product.brand} onChange={(v) => setProduct({ ...product, brand: v })} />
                            <Input label="Category" value={product.category} onChange={(v) => setProduct({ ...product, category: v })} />
                            <Input label="Cost Price ($)" type="number" value={product.defaultCost} onChange={(v) => setProduct({ ...product, defaultCost: parseFloat(v) })} />
                            <Input label="Retail Price ($)" type="number" value={product.defaultPrice} onChange={(v) => setProduct({ ...product, defaultPrice: parseFloat(v) })} />
                            <p><strong>Units per Box:</strong> {product.quantityPerBox}</p>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={!!credit}
                                    onChange={(e) => setCredit((e.target as HTMLInputElement).checked)}
                                />
                                <label>Credit Eligible</label>
                            </div>

                            <Input label="Delivery Date" type="date" value={deliveryDate} onChange={setDeliveryDate} />
                            <Input label="Expiry Date" type="date" value={expiryDate} onChange={setExpiryDate} />

                            <div className="flex items-center gap-3 mt-3">
                                <Input label="Boxes Received" type="number" value={quantityBoxes} onChange={(v) => setQuantityBoxes(parseInt(v))} />
                                <p className="text-xs text-gray-500">
                                    {quantityBoxes} × {product.quantityPerBox} = {quantityBoxes * product.quantityPerBox} units
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={handleSaveInventory}
                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => { setShowProductModal(false); resetInputs(); }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </Modal>
                )}
                {/* edit modal */}
                {editingItem && (
                    <Modal onClose={() => setEditingItem(null)}>
                        <h2 className="text-xl font-bold mb-4 text-center">Edit Inventory</h2>
                        <Input label="Quantity" type="number" value={editingItem.quantity}
                            onChange={(v) => setEditingItem({ ...editingItem, quantity: parseInt(v) || 0 })} />
                        <Input label="Cost Price" type="number" value={editingItem.costPrice}
                            onChange={(v) => setEditingItem({ ...editingItem, costPrice: parseFloat(v) || 0 })} />
                        <Input label="Retail Price" type="number" value={editingItem.retailPrice}
                            onChange={(v) => setEditingItem({ ...editingItem, retailPrice: parseFloat(v) || 0 })} />
                        <Input label="Delivery Date" type="date"
                            value={editingItem.deliveryDate?.split("T")[0]}
                            onChange={(v) => setEditingItem({ ...editingItem, deliveryDate: v })} />
                        <Input label="Expiry Date" type="date"
                            value={editingItem.expiry?.split("T")[0]}
                            onChange={(v) => setEditingItem({ ...editingItem, expiry: v })} />
                        <div className="flex justify-end gap-4 mt-4">
                            <button onClick={handleSaveUpdate} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md">
                                Save
                            </button>
                            <button onClick={() => setEditingItem(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md">
                                Cancel
                            </button>
                        </div>
                    </Modal>
                )}

                {/* toast */}
                {toastMessage && (
                    <div className="fixed bottom-5 right-5 bg-green-600 text-white py-2 px-4 rounded-md shadow-lg">
                        {toastMessage}
                    </div>
                )}
            </div>
        </AdminShell>
    );
}

// modal
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[420px] relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}

// input
function Input({ label, value, onChange, type = "text" }: {
    label: string; value: any; onChange: (v: string) => void; type?: string;
}) {
    return (
        <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
            />
        </div>
    );
}