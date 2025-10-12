import Link from "next/link";

export default function Sidebar() {
    return (
        <div className="w-64 h-screen bg-white border-r shadow-sm p-6">
            {/* Logo / Title */}
            <h2 className="text-xl font-bold text-blue-600 mb-8">Save A Dollar</h2>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-4 text-gray-700 text-sm">
                <Link href="/admin" className="hover:text-blue-600">
                    Dashboard
                </Link>
                <Link href="/admin/expired" className="hover:text-blue-600">
                    Expiring Items
                </Link>
                <Link href="/admin/promos" className="hover:text-blue-600">
                    Promotions
                </Link>
                <Link href="/admin/liveinventory" className="hover:text-blue-600">
                    Live Inventory
                </Link>

                {/* Divider */}
                <hr className="my-4 border-gray-300" />

                {/* New Log Sections */}
                <p className="text-xs uppercase tracking-wide text-gray-500">
                    Inventory Logs
                </p>
                <Link href="/admin/deletedliveinventory" className="hover:text-blue-600">
                    Deleted Inventory
                </Link>
                <Link href="/admin/updatedliveinventory" className="hover:text-blue-600">
                    Updated Inventory
                </Link>

                <Link href="/admin/deletedpromos" className="hover:text-blue-600">
                    Deleted Promos
                </Link>
                <Link href="/admin/updatedpromos" className="hover:text-blue-600">
                    Updated Promos
                </Link>
            </nav>
        </div>
    );
}