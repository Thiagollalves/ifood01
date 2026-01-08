'use client';
import { useState } from 'react';
import { Category, Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Banners } from '@/components/Banners';
import { CategoryBubbles } from '@/components/CategoryBubbles';
import { CATEGORIES_DATA } from '@/lib/data';

export default function HomePage() {
    const { products, settings } = useStore();
    // Ensure we sort by popularity so "Destaques" looks good
    const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {!settings.isOpen && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 font-medium text-center">
                    🕒 A loja está fechada. Você pode visualizar o cardápio, mas não aceitamos pedidos no momento.
                </div>
            )}

            {/* Banners Carousel */}
            <Banners />

            {/* Search */}
            <div className="relative sticky top-0 z-40 bg-secondary pb-2 pt-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-light" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar em Pizza Delivery"
                        className="h-12 w-full rounded-lg bg-white pl-10 pr-4 text-sm text-foreground outline-none transition-all shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-muted-light"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Bubbles */}
            <CategoryBubbles
                categories={CATEGORIES_DATA}
                activeCategory={activeCategory}
                onSelect={(id) => setActiveCategory(id as Category | 'All')}
            />

            {/* Product Grid */}
            <div>
                <h2 className="mb-4 text-xl font-bold text-foreground">
                    {activeCategory === 'All' ? 'Destaques' : CATEGORIES_DATA.find(c => c.id === activeCategory)?.label}
                </h2>
                {filteredProducts.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Show popular first if 'All' */}
                        {filteredProducts
                            .sort((a, b) => (a.popular === b.popular) ? 0 : a.popular ? -1 : 1)
                            .map((product) => (
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
