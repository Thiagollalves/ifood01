'use client';
import { useState } from 'react';
import { Category, Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES: { id: Category | 'All'; label: string }[] = [
    { id: 'All', label: 'Todos' },
    { id: 'Pizza', label: 'Pizzas' },
    { id: 'Drink', label: 'Bebidas' },
    { id: 'Dessert', label: 'Sobremesas' },
];

export default function HomePage() {
    const { products } = useStore();
    const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light" size={20} />
                <input
                    type="text"
                    placeholder="Buscar em Pizza Delivery"
                    className="h-12 w-full rounded-lg bg-secondary pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/20 placeholder:text-muted-light"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                            "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                            activeCategory === cat.id
                                ? "bg-primary text-white border-primary"
                                : "bg-white text-muted border-border hover:border-muted-light"
                        )}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div>
                <h2 className="mb-4 text-lg font-bold text-foreground">
                    {activeCategory === 'All' ? 'Destaques' : CATEGORIES.find(c => c.id === activeCategory)?.label}
                </h2>
                {filteredProducts.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => setSelectedProduct(product)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex h-32 items-center justify-center text-muted">
                        Nenhum produto encontrado.
                    </div>
                )}
            </div>

            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}
