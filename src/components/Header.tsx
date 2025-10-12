import { useState, useEffect } from "react";
import Image from "next/image";
import { oswald } from "@/styles/fonts";
import Link from "next/link";

export default function Header() {
    const [visible, setVisible] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const promos = [
        "🚀 10% Off Your Next Fill-Up!",
        "🎉 Buy 2 Snacks, Get 1 Free!",
        "🧼 Free Car Wash With Full Tank!",
    ];
    const [currentPromo, setCurrentPromo] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromo((prev) => (prev + 1) % promos.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Promo Bar */}
            {visible && (
                <div className="bg-orange-400 text-black py-1 px-4 relative w-full overflow-hidden">
                    <div className="relative h-6">
                        <div
                            key={currentPromo}
                            className="animate-center-float absolute left-1/2 transform -translate-x-1/2 text-sm font-medium whitespace-nowrap"
                        >
                            {promos[currentPromo]}
                        </div>
                    </div>
                    <button
                        onClick={() => setVisible(false)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black text-lg font-bold hover:text-white"
                        aria-label="Close Promo"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Main Header */}
            <header className="bg-gradient-to-r from-zinc-900 via-neutral-800 to-zinc-900 text-white sticky top-0 z-50 shadow-lg w-full">
                <div className="w-full px-4 md:px-12 py-4">
                    <div className="flex items-center justify-between w-full">
                        {/* Logo & Brand (clickable link) */}
                        <Link href="/" className="flex items-center space-x-3 ml-0 md:ml-[12rem]">
                            <Image
                                src="/gastrip-logo-4.png"
                                alt="GasTrip Logo"
                                width={48}
                                height={56}
                                className="rounded-md animate-pulse animate-logo-glow transition-transform duration-700 hover:rotate-12"
                            />
                            <span
                                className={`${oswald.className} text-3xl md:text-4xl tracking-wider`}
                            >
                                <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 bg-clip-text text-transparent font-extrabold drop-shadow-md">
                                    GasTrip
                                </span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex space-x-6 font-medium text-sm md:text-base">
                            <Link href="/products" className="hover:text-orange-600">
                                Products
                            </Link>
                            <Link href="/deals" className="hover:text-orange-600">
                                Deals
                            </Link>
                            <Link href="/find-store" className="hover:text-orange-600">
                                Find a Store
                            </Link>
                        </nav>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden focus:outline-none text-white text-xl"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? "✖" : "☰"}
                        </button>
                    </div>

                    {/* Mobile Dropdown Menu */}
                    {menuOpen && (
                        <div className="flex flex-col mt-4 space-y-2 md:hidden text-center">
                            <a href="#products" className="hover:underline">Products</a>
                            <a href="#deals" className="hover:underline">Deals</a>
                            <a href="#stores" className="hover:underline">Find a Store</a>
                        </div>
                    )}
                </div>

                <div className="h-1 bg-red-600 w-full" />
            </header>
        </>
    );
}