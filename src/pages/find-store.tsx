import { useState, useEffect } from "react";

type Store = {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
};

// Example store data
const stores: Store[] = [
    {
        name: "GasTrip Main Branch",
        address: "1902 E 32nd st",
        city: "Joplin",
        state: "MO",
        zip: "64804",
        lat: 37.05444,
        lng: 94.49478,
    },
    {
        name: "GasTrip North",
        address: "325 W Sixth st",
        city: "Cherryvale",
        state: "KS",
        zip: "67335",
        lat: 37.26550,
        lng: 95.55527,
    },
];

export default function FindStorePage() {
    const [nearestStore, setNearestStore] = useState<Store | null>(null);
    const [zipInput, setZipInput] = useState("");

    // Try to get location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    };
                    const nearest = findNearestStore(coords.lat, coords.lng);
                    setNearestStore(nearest);
                },
                () => {
                    console.log("User denied location. Waiting for manual ZIP.");
                }
            );
        }
    }, []);

    // Find nearest store
    const findNearestStore = (lat: number, lng: number): Store | null => {
        let nearest = null;
        let minDistance = Number.MAX_VALUE;

        stores.forEach((store) => {
            const dist = getDistance(lat, lng, store.lat, store.lng);
            if (dist < minDistance) {
                minDistance = dist;
                nearest = store;
            }
        });

        return nearest;
    };

    // Haversine distance
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Manual ZIP search
    const handleZipSearch = () => {
        const found = stores.find((s) => s.zip === zipInput);
        if (found) {
            setNearestStore(found);
        } else {
            alert("No store found for that ZIP.");
            setNearestStore(null);
        }
    };

    return (
        <div className="w-full min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-start pt-20 px-6">
            <h1 className="text-3xl font-bold mb-6">Find a Store</h1>

            {/* Show nothing until location or ZIP search */}
            {!nearestStore && (
                <p className="mb-4 text-gray-400">
                    Allow location or enter ZIP code to find the nearest GasTrip store.
                </p>
            )}

            {/* Store result */}
            {nearestStore && (
                <div className="bg-white/10 rounded-lg p-6 shadow-md text-center w-full max-w-md">
                    <h2 className="text-2xl font-semibold mb-2">{nearestStore.name}</h2>
                    <p>{nearestStore.address}</p>
                    <p>
                        {nearestStore.city}, {nearestStore.state} {nearestStore.zip}
                    </p>
                </div>
            )}

            {/* ZIP input */}
            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Enter ZIP code"
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value)}
                    className="px-4 py-2 rounded-md text-black"
                />
                <button
                    onClick={handleZipSearch}
                    className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md font-semibold"
                >
                    Search
                </button>
            </div>
        </div>
    );
}