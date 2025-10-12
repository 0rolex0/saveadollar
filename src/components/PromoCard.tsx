// File: src/components/PromoCard.tsx

import { useState, useEffect } from "react";
import Image from "next/image";

const promoImages = [
    "/promos/Foger.png",
    "/promos/kitkat.png",
    "/promos/oreo.png",
];

export default function PromoCard() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % promoImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mx-auto w-[45%] min-w-[280px] h-[8cm] rounded-xl overflow-hidden shadow-lg bg-zinc-800 relative">
            {/* Promo Image */}
            <Image
                src={promoImages[currentIndex]}
                alt={`Promo ${currentIndex + 1}`}
                fill
                className="object-cover transition-opacity duration-500"
                priority
            />

            {/* Dot Indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {promoImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? "bg-white" : "bg-gray-400 opacity-70"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}