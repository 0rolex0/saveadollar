// File: src/pages/products.tsx
import PromoCard from "@/components/PromoCard";
import Image from "next/image";
import Link from "next/link";

const categories = [
    { name: "Candy", img: "/categories/candy.png", link: "/products/candy" },
    { name: "Cookies", img: "/categories/cookies.png", link: "/products/cookies" },
    { name: "Kids", img: "/categories/kids.png", link: "/products/kids" },
    { name: "Drinks", img: "/categories/drinks.png", link: "/products/drinks" },
    { name: "Energy Drinks", img: "/categories/energy.png", link: "/products/energy" },
    { name: "Auto", img: "/categories/auto.png", link: "/products/auto" },
    { name: "Tobacco", img: "/categories/tobacco.png", link: "/products/tobacco" },
    { name: "Chews", img: "/categories/chews.png", link: "/products/chews" },
    { name: "Cigarettes", img: "/categories/cigarettes.png", link: "/products/cigarettes" },
    { name: "E-Cigs", img: "/categories/ecigs.png", link: "/products/ecigs" },
    { name: "Liquor", img: "/categories/liquor.png", link: "/products/liquor" },
    { name: "Beer", img: "/categories/beer.png", link: "/products/beer" },
    { name: "Vapes", img: "/categories/vapes.png", link: "/products/vapes" },
];

export default function ProductsPage() {
    return (
        <div className="w-full min-h-screen bg-[url('/images/bricks1.png')] bg-cover bg-center bg-no-repeat text-white">
            {/* Promo section */}
            <div className="flex justify-center items-start pt-8">
                <PromoCard />
            </div>

            {/* Categories grid */}
            <div className="max-w-7xl mx-auto mt-12 space-y-12 px-6">
                {/* Row 1 - 3 items */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.slice(0, 3).map((cat) => (
                        <CategoryCard key={cat.name} {...cat} />
                    ))}
                </div>

                {/* Row 2 - 2 items */}
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
                    {categories.slice(3, 5).map((cat) => (
                        <CategoryCard key={cat.name} {...cat} />
                    ))}
                </div>

                {/* Row 3 - 3 items */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.slice(5, 8).map((cat) => (
                        <CategoryCard key={cat.name} {...cat} />
                    ))}
                </div>

                {/* Row 4 - 2 items */}
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
                    {categories.slice(8, 10).map((cat) => (
                        <CategoryCard key={cat.name} {...cat} />
                    ))}
                </div>

                {/* Row 5 - 3 items */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.slice(10, 13).map((cat) => (
                        <CategoryCard key={cat.name} {...cat} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function CategoryCard({ name, img, link }: { name: string; img: string; link: string }) {
    return (
        <Link href={link}>
            <div className="relative bg-white/10 rounded-xl shadow-md overflow-hidden hover:scale-105 transition transform cursor-pointer">
                <Image
                    src={img}
                    alt={name}
                    width={400}
                    height={300}
                    className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover"
                />
                <div className="absolute bottom-0 w-full bg-black/60 text-center py-2">
                    <span className="text-lg font-semibold">{name}</span>
                </div>
            </div>
        </Link>
    );
}