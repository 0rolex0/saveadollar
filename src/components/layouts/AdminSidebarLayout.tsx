// src/components/layouts/AdminSidebarLayout.tsx
import { ReactNode } from "react";
import Link from "next/link";

const AdminSidebarLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-900 shadow-lg">
                <div className="p-6 text-xl font-bold border-b dark:text-white">Save A Dollar</div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">Dashboard</Link>
                    <Link href="/admin/promos" className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">Promos</Link>
                    <Link href="/admin/expired" className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">Expiring Items</Link>
                    <Link href="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100">Users</Link>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 bg-gray-50 dark:bg-black p-6">{children}</main>
        </div>
    );
};

export default AdminSidebarLayout;