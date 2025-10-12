import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { FaCarSide } from "react-icons/fa";
import { HiCalendar } from "react-icons/hi";
import Promotions from "./Promotions";
import PromoSlider from "./PromoSlider";

interface GasPrice {
    id: string;
    type: string;
    priceCard: number;
    priceCash: number;
}

export default function GasPrices() {
    const [prices, setPrices] = useState<GasPrice[]>([]);
    const [isCard, setIsCard] = useState(true);
    const [displayTime, setDisplayTime] = useState("");

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await axios.get<GasPrice[]>("/api/gas-prices");

                const priorityOrder = ["regular", "plus", "premium", "diesel"];
                const sorted = res.data.sort(
                    (a, b) =>
                        priorityOrder.indexOf(a.type.toLowerCase()) -
                        priorityOrder.indexOf(b.type.toLowerCase())
                );

                setPrices(sorted);
                setDisplayTime(simulateRealisticTime());
            } catch (err) {
                console.error("❌ Error fetching gas prices:", err);
            }
        };

        fetchPrices();
    }, []);
    return (
        <div className="w-full px-4 py-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FaCarSide className="text-yellow-500" />
                        Today's Gas Prices
                    </h2>

                    {/* Card/Cash Toggle */}
                    <div className="flex justify-end sm:justify-center items-center gap-2 w-full sm:w-auto">
                        <span className="text-2xl font-bold text-white-500">Payment:</span>
                        <div className="flex bg-gray-200 rounded-full p-1">
                            <button
                                onClick={() => setIsCard(true)}
                                className={`px-4 py-1 rounded-full text-sm font-semibold transition ${isCard ? "bg-green-500 text-white" : "text-gray-700"
                                    }`}
                            >
                                Card
                            </button>
                            <button
                                onClick={() => setIsCard(false)}
                                className={`px-4 py-1 rounded-full text-sm font-semibold transition ${!isCard ? "bg-green-500 text-white" : "text-gray-700"
                                    }`}
                            >
                                Cash
                            </button>
                        </div>
                    </div>
                </div>

                {/* Gas Price Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {prices.map((gas) => {
                        const displayPrice = isCard ? gas.priceCard : gas.priceCash;

                        return (
                            <div
                                key={gas.id}
                                className="flex items-center bg-gradient-to-br from-gray-100 to-white shadow-md rounded-lg px-3 py-3 space-x-2 border hover:shadow-xl hover:ring-1 hover:ring-yellow-300 transition sm:px-4 sm:py-4"
                            >
                                <Image
                                    src={getPumpImage(gas.type)}
                                    alt={`${gas.type} pump`}
                                    width={40}
                                    height={40}
                                    className="rounded"
                                />
                                <div className="flex flex-col text-right ml-2 justify-center flex-1">
                                    <p
                                        className="text-base sm:text-2xl font-semibold tracking-widest uppercase leading-tight mb-1"
                                        style={{
                                            color: getFuelColor(gas.type),
                                            fontFamily: "'Orbitron', sans-serif",
                                        }}
                                    >
                                        {gas.type}
                                    </p>
                                    <p
                                        className="text-lg sm:text-2xl font-bold text-black mt-0 justify-end flex items-start"
                                        style={{
                                            fontFamily: "'Major Mono Display', monospace",
                                        }}
                                    >
                                        ${displayPrice.toFixed(2)}
                                        <span className="ml-1 flex flex-col items-center text-[9px] leading-tight mt-0.5">
                                            <span>9</span>
                                            <span className="border-t border-black w-full text-[8px] pt-[1px]">
                                                10
                                            </span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                </div>

                {/* Last updated */}
                <div className="mt-3 mb-1 flex justify-end text-xl text-gray-300 items-center gap-1">
                    <HiCalendar className="text-gray-300" />
                    Last updated: Today at {displayTime}
                </div>

                {/* ⬇️ Promotions Section */}
                {/* ⬇️ Promotions Section */}
                <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                    <PromoSlider />
                </div>
            </div>
        </div>
    );
}

// 🔁 Simulated realistic gas update time (5–8 AM or 2–5 PM), clamped if in future
function simulateRealisticTime(): string {
    const now = new Date();
    const dateKey = now.toDateString();
    const isMorning = now.getHours() < 12;
    const windowKey = isMorning ? "AM" : "PM";
    const storageKey = `simulatedGasTime_${dateKey}_${windowKey}`;

    if (typeof window !== "undefined") {
        const cached = localStorage.getItem(storageKey);
        if (cached) return cached;
    }

    // Define minute ranges
    const startMin = isMorning ? 5 * 60 : 14 * 60; // 5 AM or 2 PM
    const endMin = isMorning ? 8 * 60 : 17 * 60; // 8 AM or 5 PM
    const totalRange = endMin - startMin;

    // Create deterministic hash
    const baseString = `${dateKey}-${windowKey}`;
    const hash = Array.from(baseString).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const minutes = startMin + (hash % totalRange);

    const simulated = new Date();
    simulated.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);

    // Clamp to now if it accidentally goes in the future
    if (simulated > now) {
        simulated.setTime(now.getTime());
    }

    const formatted = simulated.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, formatted);
    }

    return formatted;
}

// 🔁 No changes below
function getPumpImage(type: string): string {
    switch (type.toLowerCase()) {
        case "regular":
            return "/gastrip-regular.png";
        case "plus":
            return "/gastrip-plus.png";
        case "premium":
            return "/gastrip-premium.png";
        case "diesel":
            return "/gastrip-diesel.png";
        default:
            return "/gastrip-regular.png";
    }
}

function getFuelColor(type: string): string {
    switch (type.toLowerCase()) {
        case "regular":
            return "#46b146ff";
        case "plus":
            return "#1976D2";
        case "premium":
            return "#C62828";
        case "diesel":
            return "#2E7D32";
        default:
            return "#555";
    }
}