// File: src/components/PromoSlider.tsx

import { useEffect, useState } from "react";
import Image from "next/image";

const promoImages = [
    "/promos/redbull.png",
    "/promos/monster.png",
    "/promos/gatorade.png",
    "/promos/powerade.png",
    "/promos/rockstar.png",
];

export default function PromoSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % promoImages.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, []);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? promoImages.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % promoImages.length);
    };

    return (
        <div className="relative w-screen overflow-hidden">
            <div className="w-full max-w-screen overflow-hidden rounded-xl mx-auto border-t-[1px] border-blue-400 animate-blue-glow">
                <Image
                    key={promoImages[currentIndex]} // force re-render when src changes
                    src={promoImages[currentIndex]}
                    alt="Promo"
                    width={1600}
                    height={500}
                    className="w-full h-auto rounded-xl"
                    priority
                />
            </div>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 px-2">
                <button
                    onClick={goToPrevious}
                    className="bg-white/60 text-black px-3 py-1 rounded-full shadow hover:bg-white"
                >
                    ◀
                </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-2">
                <button
                    onClick={goToNext}
                    className="bg-white/60 text-black px-3 py-1 rounded-full shadow hover:bg-white"
                >
                    ▶
                </button>
            </div>
        </div>
    );
}