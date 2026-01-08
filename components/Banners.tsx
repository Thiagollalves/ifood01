'use client';

import Image from "next/image";
import { useState, useEffect } from "react";

const BANNERS = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
        alt: "Promo Pizza"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop",
        alt: "Promo Burgers" // Just illustrative
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop",
        alt: "Promo Frete Gratis"
    }
];

export function Banners() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % BANNERS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full aspect-[2.5/1] md:aspect-[4/1] rounded-xl overflow-hidden shadow-sm">
            {BANNERS.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Image
                        src={banner.image}
                        alt={banner.alt}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                    {/* Gradient Overlay for text readability (optional) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
            ))}

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {BANNERS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
}
