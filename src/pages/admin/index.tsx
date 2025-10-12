import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import KpiCard from "@/components/admin/KpiCard";
import ExpiringTable from "@/components/admin/ExpiringTable";

export default function AdminDashboard() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p className="text-center">Loading...</p>;
    if (!session?.user) return <p className="text-center text-red-500">Not signed in</p>;

    const role = session.user.role;
    const storeId = session.user.storeId;

    return (
        <AdminShell>
            <h1 className="text-2xl font-bold mb-4">
                Welcome, {session.user.name} ({role})
            </h1>
            {role === "OWNER" ? <OwnerDashboard /> : <ManagerDashboard storeId={storeId} />}
        </AdminShell>
    );
}

function OwnerDashboard() {
    const [items, setItems] = useState<any[]>([]);
    const [kpis, setKpis] = useState<any>({});
    const [filter, setFilter] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const [itemsRes, kpiRes] = await Promise.all([
                fetch("/api/admin/expiring"),
                fetch("/api/admin/kpis"),
            ]);
            const itemData = await itemsRes.json();
            const kpiData = await kpiRes.json();

            const promoSkus = new Set(itemData.promos?.map((p: any) => p.sku));
            const enriched = itemData.items.map((item: any) => ({
                ...item,
                hasPromo: promoSkus.has(item.sku),
            }));

            setItems(enriched);
            setKpis(kpiData);
        };
        load();
    }, []);

    const filteredItems = filter
        ? items.filter(item => {
            if (filter === "PRODUCTS") return true;
            if (filter === "UNITS") return true;
            if (filter === "EXPIRING") return true;
            if (filter === "RETURNABLE") return item.credit;
            if (filter === "NON_RETURNABLE") return !item.credit;
            if (filter === "PROMO") return item.hasPromo;
            return true;
        })
        : items;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <KpiCard
                    title="Total Products Expiring"
                    value={kpis.uniqueProductsCount}
                    color="bg-blue-100"
                    onClick={() => setFilter("PRODUCTS")}
                    active={filter === "PRODUCTS"}
                />
                <KpiCard
                    title="Total Units Expiring"
                    value={kpis.totalQty}
                    color="bg-blue-200"
                    onClick={() => setFilter("UNITS")}
                    active={filter === "UNITS"}
                />
                <KpiCard
                    title="Expiring ≤ 7 days"
                    value={kpis.expiringCount}
                    color="bg-yellow-100"
                    onClick={() => setFilter("EXPIRING")}
                    active={filter === "EXPIRING"}
                />
                <KpiCard
                    title="Returnable"
                    value={kpis.returnableCount}
                    color="bg-green-100"
                    onClick={() => setFilter("RETURNABLE")}
                    active={filter === "RETURNABLE"}
                />
                <KpiCard
                    title="Non-returnable"
                    value={kpis.nonReturnableCount}
                    color="bg-red-100"
                    onClick={() => setFilter("NON_RETURNABLE")}
                    active={filter === "NON_RETURNABLE"}
                />
                <KpiCard
                    title="Promos running"
                    value={kpis.promoCount}
                    color="bg-purple-100"
                    onClick={() => setFilter("PROMO")}
                    active={filter === "PROMO"}
                />
            </div>

            {filter && (
                <button
                    onClick={() => setFilter(null)}
                    className="text-sm text-blue-600 underline mb-4"
                >
                    Clear Filter
                </button>
            )}

            <ExpiringTable items={filteredItems} />
        </>
    );
}

function ManagerDashboard({ storeId }: { storeId: string | null }) {
    const [items, setItems] = useState<any[]>([]);
    const [kpis, setKpis] = useState<any>({});
    const [filter, setFilter] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const [itemsRes, kpiRes] = await Promise.all([
                fetch(`/api/admin/expiring?storeId=${storeId}`),
                fetch(`/api/admin/kpis?storeId=${storeId}`), // ✅ FIXED: pass storeId
            ]);
            const itemData = await itemsRes.json();
            const kpiData = await kpiRes.json();

            const promoSkus = new Set(itemData.promos?.map((p: any) => p.sku));
            const enriched = itemData.items.map((item: any) => ({
                ...item,
                hasPromo: promoSkus.has(item.sku),
            }));

            setItems(enriched);
            setKpis(kpiData);
        };
        if (storeId) load();
    }, [storeId]);

    const filteredItems = filter
        ? items.filter(item => {
            if (filter === "PRODUCTS") return true;
            if (filter === "UNITS") return true;
            if (filter === "EXPIRING") return true;
            if (filter === "RETURNABLE") return item.credit;
            if (filter === "NON_RETURNABLE") return !item.credit;
            if (filter === "PROMO") return item.hasPromo;
            return true;
        })
        : items;

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">Store Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <KpiCard
                    title="Total Products Expiring"
                    value={kpis.uniqueProductsCount}
                    color="bg-blue-100"
                    onClick={() => setFilter("PRODUCTS")}
                    active={filter === "PRODUCTS"}
                />
                <KpiCard
                    title="Total Units Expiring"
                    value={kpis.totalQty}
                    color="bg-blue-200"
                    onClick={() => setFilter("UNITS")}
                    active={filter === "UNITS"}
                />
                <KpiCard
                    title="Expiring ≤ 7 days"
                    value={kpis.expiringCount}
                    color="bg-yellow-100"
                    onClick={() => setFilter("EXPIRING")}
                    active={filter === "EXPIRING"}
                />
                <KpiCard
                    title="Returnable"
                    value={kpis.returnableCount}
                    color="bg-green-100"
                    onClick={() => setFilter("RETURNABLE")}
                    active={filter === "RETURNABLE"}
                />
                <KpiCard
                    title="Non-returnable"
                    value={kpis.nonReturnableCount}
                    color="bg-red-100"
                    onClick={() => setFilter("NON_RETURNABLE")}
                    active={filter === "NON_RETURNABLE"}
                />
                <KpiCard
                    title="Promos running"
                    value={kpis.promoCount}
                    color="bg-purple-100"
                    onClick={() => setFilter("PROMO")}
                    active={filter === "PROMO"}
                />
            </div>

            {filter && (
                <button
                    onClick={() => setFilter(null)}
                    className="text-sm text-blue-600 underline mb-4"
                >
                    Clear Filter
                </button>
            )}

            <ExpiringTable items={filteredItems} />
        </>
    );
}