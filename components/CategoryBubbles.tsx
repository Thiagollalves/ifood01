'use client';

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Category } from "@/lib/types";

interface CategoryBubblesProps {
    categories: { id: Category | 'All', label: string, image?: string }[];
    activeCategory: string;
    onSelect: (id: Category | 'All') => void;
}

export function CategoryBubbles({ categories, activeCategory, onSelect }: CategoryBubblesProps) {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className="flex flex-col items-center gap-2 min-w-[80px] group"
                >
                    <div className={cn(
                        "w-20 h-20 rounded-full relative overflow-hidden transition-all border-2",
                        activeCategory === cat.id
                            ? "border-primary ring-2 ring-primary/20 scale-105"
                            : "border-transparent bg-secondary group-hover:bg-secondary/80"
                    )}>
                        {/* Note: In a real app these would be real images. Using colors/icons for MVP if no image provided */}
                        {cat.image ? (
                            <Image src={cat.image} alt={cat.label} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xs text-muted">
                                No Img
                            </div>
                        )}
                    </div>
                    <span className={cn(
                        "text-sm font-medium transition-colors",
                        activeCategory === cat.id ? "text-primary" : "text-muted-foreground"
                    )}>
                        {cat.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
