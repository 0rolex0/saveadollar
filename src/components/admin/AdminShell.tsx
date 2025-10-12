// src/components/admin/AdminShell.tsx
import { ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";

type AdminShellProps = {
    children: ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") return <div className="text-center p-6">Loading...</div>;
    if (!session) {
        if (typeof window !== "undefined") router.push("/login");
        return null;
    }

    const user = session.user;
    const onDashboard = router.pathname === "/admin";

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Sidebar />

            <main className="flex-1 px-12 py-10">
                {/* Page Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-700 mb-1">
                            Welcome, {user.name}!
                        </h1>
                        <p className="text-sm text-gray-600">
                            Role: <span className="font-medium text-gray-800">{user.role}</span> | Store:{" "}
                            <span className="font-medium text-gray-800">
                                {user.storeId || "All Stores"}
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Back to Dashboard if not on main admin */}
                        {!onDashboard && (
                            <button
                                onClick={() => router.push("/admin")}
                                className="px-3 py-2 bg-gray-200 rounded-md shadow hover:bg-gray-300 transition"
                            >
                                ← Back to Dashboard
                            </button>
                        )}

                        {/* Logout Button */}
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Page Content */}
                {children}
            </main>
        </div>
    );
}