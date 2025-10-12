// ✅ File: src/components/Promotions.tsx
import Image from "next/image";
import { useEffect, useState } from "react";

const promoImages = [
    "/promos/redbull.png",
    "/promos/gatorade.png",
    // Add more image paths here
];

export default function Promotions() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % promoImages.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-black mt-8">
            <div className="max-w-7xl mx-auto overflow-hidden rounded-lg shadow-lg">
                <Image
                    src={promoImages[current]}
                    alt={`Promotion ${current + 1}`}
                    width={1600}
                    height={600}
                    className="w-full h-auto object-cover transition-all duration-500"
                    priority
                />
            </div>
        </div>
    );
}