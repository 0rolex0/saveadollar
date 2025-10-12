// ✅ src/pages/admin/promos.tsx
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { useRouter } from "next/router";

type PromoItem = {
    id?: string;
    product: string;
    sku: string;
    expiry: string;
    quantity: number;
    credit: boolean;
    urgency: string;
    strategy: string;
    promoType: string;
    promoPrice: number;
    costPrice: number;
    regularPrice: number;
    storeId?: string;
};

type LiveInventoryHit = {
    id: string;
    product: { id: string; name: string; sku: string };
    expiry: string;
    quantity: number;
    credit: boolean;
    costPrice: number;
    retailPrice: number;
};

export default function PromosPage() {
    const router = useRouter();
    const [promos, setPromos] = useState<PromoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);

    // Modal states
    const [showSkuModal, setShowSkuModal] = useState(false);
    const [skuInput, setSkuInput] = useState("");
    const [selectedInv, setSelectedInv] = useState<LiveInventoryHit | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAlreadyPromo, setShowAlreadyPromo] = useState(false);
    const [showOutOfStock, setShowOutOfStock] = useState(false);
    const [showAddNew, setShowAddNew] = useState(false);

    // Edit mode
    const [editMode, setEditMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState<PromoItem | null>(null);

    // ✅ dynamically detect user role
    const [userRole, setUserRole] = useState<string>("manager");
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole) setUserRole(storedRole);
    }, []);

    const fetchPromos = async () => {
        const res = await fetch("/api/admin/promos");
        const data: PromoItem[] = await res.json();
        setPromos(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    const normalizeSku = (raw: string) => raw.trim().toUpperCase().replace(/^0+/, "");
    const normalizeDateToISO = (d: string) => {
        if (!d) return d;
        if (d.includes("T")) return new Date(d).toISOString();
        return new Date(`${d}T12:00:00`).toISOString();
    };

    // 🔍 SKU Lookup
    const handleSkuLookup = async () => {
        if (!skuInput.trim()) return;
        const normalizedSku = normalizeSku(skuInput);

        try {
            // 1️⃣ check promo already
            const exists = promos.some((p) => normalizeSku(p.sku) === normalizedSku);
            if (exists) {
                setShowSkuModal(false);
                setShowAlreadyPromo(true);
                return;
            }

            // 2️⃣ live inventory
            const invRes = await fetch(`/api/admin/liveinventory?sku=${normalizedSku}`);
            if (invRes.ok) {
                const invData = await invRes.json();
                const hit: LiveInventoryHit | null =
                    Array.isArray(invData) ? invData[0] : invData?.product ? invData : null;

                if (hit && hit.product) {
                    setSelectedInv({ ...hit, expiry: hit.expiry ?? "" });
                    setShowSkuModal(false);
                    setShowAddModal(true);
                    return;
                }
            }

            // 3️⃣ master product
            const prodRes = await fetch(`/api/admin/products?sku=${normalizedSku}`);
            if (prodRes.ok) {
                const prodData = await prodRes.json();
                if (prodData && prodData.id) {
                    setShowSkuModal(false);
                    setShowOutOfStock(true);
                    return;
                }
            }

            // 4️⃣ not found
            setShowSkuModal(false);
            setShowAddNew(true);
        } catch (err) {
            console.error("SKU lookup failed:", err);
            setShowSkuModal(false);
            setShowAddNew(true);
        }
    };

    // ✅ Add Promo
    const handleAddPromo = async (promo: PromoItem) => {
        const payload = {
            ...promo,
            expiry: normalizeDateToISO(promo.expiry),
            user: userRole,
        };
        const res = await fetch("/api/admin/promos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            await fetchPromos();
            setShowAddModal(false);
            setSelectedInv(null);
            showToast(`✅ Promo added successfully by ${userRole}!`);
        } else showToast("❌ Failed to add promo");
    };

    // ✅ Update Promo
    const handleEditSave = async (updated: PromoItem) => {
        if (!updated.id) return;
        const payload = { ...updated, expiry: normalizeDateToISO(updated.expiry) };
        const res = await fetch("/api/admin/promos-update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: updated.id, updates: payload, user: userRole }),
        });

        if (res.ok) {
            await fetchPromos();
            setShowEditModal(false);
            setSelectedPromo(null);
            showToast(`✅ Promo updated successfully by ${userRole}!`);
        } else showToast("❌ Failed to update promo");
    };

    // ✅ Delete
    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm("Delete selected promos?")) return;

        const remaining = promos.filter((p) => !selectedIds.includes(p.id!));
        setPromos(remaining);
        setSelectedIds([]);

        await fetch("/api/admin/promos-delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: selectedIds, user: userRole }),
        });

        showToast(`🗑️ Promos deleted by ${userRole} (logged)`);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    if (loading) return <AdminShell><p>Loading promos...</p></AdminShell>;

    return (
        <AdminShell>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Promotions</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setShowSkuModal(true);
                                setSkuInput("");
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                        >
                            + Add Promo
                        </button>

                        <button
                            onClick={() => {
                                setEditMode((v) => !v);
                                setSelectedIds([]);
                            }}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md"
                        >
                            {editMode ? "Exit Edit Mode" : "✏️ Edit Mode"}
                        </button>

                        {editMode && selectedIds.length > 0 && (
                            <>
                                <button
                                    onClick={() => {
                                        if (selectedIds.length !== 1) {
                                            alert("Select one promo to edit");
                                            return;
                                        }
                                        const promo = promos.find((p) => p.id === selectedIds[0]);
                                        if (promo) {
                                            setSelectedPromo(promo);
                                            setShowEditModal(true);
                                        }
                                    }}
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
                    </div>
                </div>

                {/* Promo Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-300 text-sm text-left">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                {editMode && <th className="border px-2 py-2">Select</th>}
                                <th className="border px-4 py-2">Product</th>
                                <th className="border px-4 py-2">SKU</th>
                                <th className="border px-4 py-2">Expiry</th>
                                <th className="border px-4 py-2">Qty</th>
                                <th className="border px-4 py-2">Credit?</th>
                                <th className="border px-4 py-2">Strategy</th>
                                <th className="border px-4 py-2">Promo Type</th>
                                <th className="border px-4 py-2">Promo Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promos.map((p) => (
                                <tr key={p.id} className="bg-white hover:bg-gray-50">
                                    {editMode && (
                                        <td className="border text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(p.id!)}
                                                onChange={() => toggleSelect(p.id!)}
                                            />
                                        </td>
                                    )}
                                    <td className="border px-4 py-2">{p.product}</td>
                                    <td className="border px-4 py-2">{p.sku}</td>
                                    <td className="border px-4 py-2">
                                        {new Date(p.expiry).toLocaleDateString()}
                                    </td>
                                    <td className="border px-4 py-2">{p.quantity}</td>
                                    <td className="border px-4 py-2">{p.credit ? "✅" : "❌"}</td>
                                    <td className="border px-4 py-2">{p.strategy}</td>
                                    <td className="border px-4 py-2">{p.promoType}</td>
                                    <td className="border px-4 py-2">${p.promoPrice.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* SKU Modal */}
                {showSkuModal && (
                    <SkuModal
                        onClose={() => {
                            setShowSkuModal(false);
                            setSkuInput("");
                        }}
                        skuInput={skuInput}
                        setSkuInput={setSkuInput}
                        handleSkuLookup={handleSkuLookup}
                    />
                )}

                {/* Alerts */}
                {showAlreadyPromo && (
                    <AlertModal
                        title="Promo Already Exists"
                        message="This product already has a running promo."
                        onClose={() => setShowAlreadyPromo(false)}
                    />
                )}
                {showOutOfStock && (
                    <AlertModal
                        title="Item found but out of stock"
                        message="Please add inventory before creating a promo."
                        onClose={() => setShowOutOfStock(false)}
                        action={() => router.push("/admin/liveinventory")}
                        actionText="Go to Live Inventory"
                    />
                )}
                {showAddNew && (
                    <AlertModal
                        title="Item not found"
                        message="Please add this product first."
                        onClose={() => setShowAddNew(false)}
                        action={() => router.push("/admin/newproduct")}
                        actionText="Add New Item"
                    />
                )}

                {/* Add / Edit Modals */}
                {showAddModal && selectedInv && (
                    <Modal onClose={() => setShowAddModal(false)}>
                        <PromoForm
                            title={`Create Promo for ${selectedInv.product.name}`}
                            initial={{
                                product: selectedInv.product.name,
                                sku: selectedInv.product.sku,
                                expiry: selectedInv.expiry?.split("T")[0] ?? "",
                                quantity: selectedInv.quantity,
                                credit: selectedInv.credit,
                                urgency: "Medium",
                                strategy: "",
                                promoType: "",
                                promoPrice: 0,
                                costPrice: selectedInv.costPrice,
                                regularPrice: selectedInv.retailPrice,
                            }}
                            onSave={handleAddPromo}
                            onCancel={() => setShowAddModal(false)}
                        />
                    </Modal>
                )}

                {showEditModal && selectedPromo && (
                    <Modal onClose={() => setShowEditModal(false)}>
                        <PromoForm
                            title="Edit Promo"
                            initial={selectedPromo}
                            onSave={handleEditSave}
                            onCancel={() => setShowEditModal(false)}
                        />
                    </Modal>
                )}

                {toast && (
                    <div className="fixed bottom-5 right-5 bg-green-600 text-white py-2 px-4 rounded-md shadow-lg">
                        {toast}
                    </div>
                )}
            </div>
        </AdminShell>
    );
}

/* ---------- COMPONENTS ---------- */

function PromoForm({
    title,
    initial,
    onSave,
    onCancel,
}: {
    title: string;
    initial: Partial<PromoItem>;
    onSave: (form: PromoItem) => void;
    onCancel: () => void;
}) {
    const formatDateForInput = (dateStr?: string) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "";
        // convert to YYYY-MM-DD
        return d.toISOString().split("T")[0];
    };

    const [form, setForm] = useState<PromoItem>({
        id: initial.id,
        product: initial.product || "",
        sku: initial.sku || "",
        expiry: formatDateForInput(initial.expiry),
        quantity: initial.quantity ?? 1,
        credit: initial.credit ?? false,
        urgency: initial.urgency || "Medium",
        strategy: initial.strategy || "",
        promoType: initial.promoType || "",
        promoPrice: initial.promoPrice ?? 0,
        costPrice: initial.costPrice ?? 0,
        regularPrice: initial.regularPrice ?? 0,
        storeId: initial.storeId,
    });
    const handleChange = <K extends keyof PromoItem>(field: K, value: PromoItem[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = (): string | null => {
        if (!form.sku) return "SKU is required";
        if (!form.product) return "Product is missing";
        if (!form.promoType.trim()) return "Promo Type is required";
        if (!form.expiry) return "Expiry date is required";
        if (!form.quantity || form.quantity <= 0) return "Quantity must be > 0";
        if (!form.promoPrice || form.promoPrice <= 0) return "Promo Price must be > 0";
        return null;
    };

    const handleSave = () => {
        const error = validateForm();
        if (error) {
            alert(error);
            return;
        }
        onSave(form);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
            <div className="bg-gray-50 border rounded p-3 mb-4 text-sm">
                <p><strong>Product:</strong> {form.product}</p>
                <p><strong>SKU:</strong> {form.sku}</p>
                <p>
                    <strong>Regular Price:</strong> ${form.regularPrice.toFixed(2)} |{" "}
                    <strong>Cost:</strong> ${form.costPrice.toFixed(2)}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <Input label="Expiry" type="date" value={form.expiry}
                    onChange={(v) => handleChange("expiry", v)} />
                <Input label="Quantity" type="number" value={form.quantity}
                    onChange={(v) => handleChange("quantity", parseInt(v || "0"))} />
                <Input label="Strategy" value={form.strategy}
                    onChange={(v) => handleChange("strategy", v)} />
                <Input label="Promo Type" value={form.promoType}
                    onChange={(v) => handleChange("promoType", v)} />
                <Input label="Promo Price ($)" type="number" value={form.promoPrice}
                    onChange={(v) => handleChange("promoPrice", parseFloat(v || "0"))} />
                <Input label="Urgency" value={form.urgency}
                    onChange={(v) => handleChange("urgency", v)} />
            </div>

            <div className="flex items-center gap-2 mt-3">
                <input
                    type="checkbox"
                    checked={form.credit}
                    onChange={(e) => handleChange("credit", e.target.checked)}
                />
                <label>Credit Eligible</label>
            </div>

            <div className="flex justify-end gap-4 mt-5">
                <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
                >
                    Save
                </button>
                <button
                    onClick={onCancel}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[460px] relative">
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

function Input({
    label,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
    type?: "text" | "number" | "date";
}) {
    return (
        <div>
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

/* ---------- SKU + ALERT MODALS ---------- */

function SkuModal(props: {
    onClose: () => void;
    skuInput: string;
    setSkuInput: (v: string) => void;
    handleSkuLookup: () => void;
}) {
    const { onClose, skuInput, setSkuInput, handleSkuLookup } = props;
    return (
        <Modal onClose={onClose}>
            <h2 className="text-xl font-bold mb-4 text-center">Enter SKU</h2>
            <input
                type="text"
                value={skuInput}
                onChange={(e) => setSkuInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSkuLookup()}
                placeholder="Scan or type SKU"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:ring focus:ring-blue-300 focus:outline-none"
            />
            <div className="flex justify-end gap-4">
                <button
                    onClick={handleSkuLookup}
                    disabled={!skuInput.trim()}
                    className={`px-5 py-2 rounded-md text-white ${skuInput.trim()
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    Next
                </button>
                <button
                    onClick={() => {
                        setSkuInput("");
                        onClose();
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
}

function AlertModal(props: {
    title: string;
    message: string;
    onClose: () => void;
    action?: () => void;
    actionText?: string;
}) {
    const { title, message, onClose, action, actionText } = props;
    return (
        <Modal onClose={onClose}>
            <h2 className="text-lg font-semibold mb-3 text-center text-red-600">
                {title}
            </h2>
            <p className="text-center text-gray-700 mb-5">{message}</p>
            <div className="flex justify-center gap-4">
                {action && actionText && (
                    <button
                        onClick={action}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
                    >
                        {actionText}
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}