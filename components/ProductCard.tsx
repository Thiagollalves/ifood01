import { Product } from '@/lib/types';
import { Plus } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    return (
        <div
            onClick={onClick}
            className="flex cursor-pointer gap-4 rounded-lg bg-card p-4 shadow-sm transition-all hover:shadow-md border border-transparent hover:border-border"
        >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                    <span className="text-[10px] font-bold">4.8</span>
                    <span className="text-amber-400 text-[10px]">★</span>
                </div>
            </div>
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <h3 className="font-semibold text-foreground text-sm md:text-base">{product.name}</h3>
                    <p className="line-clamp-2 text-xs md:text-sm text-muted mt-1">{product.description}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <span className="font-medium text-foreground text-sm md:text-base">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </span>
                    <button className="rounded-full bg-secondary p-1.5 text-primary transition-colors hover:bg-primary hover:text-white">
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
