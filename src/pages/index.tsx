// File: src/pages/index.tsx
import GasPrices from "@/components/GasPrices";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[url('/images/wood-pg.png')] bg-cover bg-center text-white">
      <main className="max-w-7xl mx-auto px-4 py-8 text-center">
        {/* Your main homepage content here */}
      </main>

      {/* Admin Login Button */}
      <div className="w-full flex justify-center mt-6 mb-6">
        <Link href="/login">
          <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition">
            Admin Login
          </button>
        </Link>
      </div>

      {/* Gas Prices Section */}
      <GasPrices />
    </div>
  );
}