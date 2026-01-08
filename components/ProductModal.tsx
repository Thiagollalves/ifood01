'use client';
import { useState, useEffect } from 'react';
import { Product, PizzaSize, CartItem } from '@/lib/types';
import { useStore } from '@/lib/store';
import { X, Minus, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

const SIZES: { id: PizzaSize; label: string; priceMod: number }[] = [
    { id: 'M', label: 'Média (6 fatias)', priceMod: -10 },
    { id: 'L', label: 'Grande (8 fatias)', priceMod: 0 },
    { id: 'XL', label: 'Gigante (12 fatias)', priceMod: 15 },
];

const EXTRAS = [
    { id: 'borda-catupiry', label: 'Borda de Catupiry', price: 12 },
    { id: 'borda-cheddar', label: 'Borda de Cheddar', price: 12 },
    { id: 'extra-bacon', label: 'Extra de Bacon', price: 8 },
];

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const { addToCart, products } = useStore();

    const [size, setSize] = useState<PizzaSize>('L');
    const [quantity, setQuantity] = useState(1);
    const [observation, setObservation] = useState('');
    const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
    const [secondFlavorId, setSecondFlavorId] = useState<string | null>(null);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setSize('L');
            setQuantity(1);
            setObservation('');
            setSelectedExtras([]);
            setSecondFlavorId(null);
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const isPizza = product.category === 'Pizza';
    const availablePizzas = products.filter(p => p.category === 'Pizza' && p.id !== product.id);

    // Price Calculation
    const getBasePrice = () => {
        if (!isPizza) return product.price;

        let price1 = product.price;
        let price2 = secondFlavorId ? (products.find(p => p.id === secondFlavorId)?.price || 0) : 0;

        // Logic: Max price of the two flavors
        let maxBase = Math.max(price1, price2);

        // Add size modifier
        const sizeMod = SIZES.find(s => s.id === size)?.priceMod || 0;

        return maxBase + sizeMod;
    };

    const getExtrasPrice = () => {
        return selectedExtras.reduce((acc, extraId) => {
            const extra = EXTRAS.find(e => e.id === extraId);
            return acc + (extra?.price || 0);
        }, 0);
    };

    const unitPrice = getBasePrice() + getExtrasPrice();
    const totalPrice = unitPrice * quantity;

    const handleAddToCart = () => {
        const additionalFlavors = secondFlavorId
            ? [products.find(p => p.id === secondFlavorId)!]
            : [];

        const cartItem: CartItem = {
            id: crypto.randomUUID(),
            product,
            quantity,
            size: isPizza ? size : undefined,
            extras: selectedExtras,
            additionalFlavors,
            observation,
            calculatedPrice: unitPrice
        };

        addToCart(cartItem);
        onClose();
    };

    const toggleExtra = (id: string) => {
        setSelectedExtras(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-background rounded-t-xl sm:rounded-xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-10 fade-in">

                {/* Header Image */}
                <div className="relative h-48 w-full shrink-0">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
                        <p className="text-muted mt-1">{product.description}</p>
                        <p className="mt-2 font-semibold text-lg text-primary">
                            A partir de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </p>
                    </div>

                    {isPizza && (
                        <>
                            {/* Size Selection */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground">Tamanho</h3>
                                <div className="space-y-2">
                                    {SIZES.map((s) => (
                                        <label key={s.id} className="flex items-center justification-between p-3 border rounded-lg cursor-pointer hover:bg-secondary transition-colors has-[:checked]:border-primary has-[:checked]:bg-red-50">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="size"
                                                    value={s.id}
                                                    checked={size === s.id}
                                                    onChange={() => setSize(s.id)}
                                                    className="w-4 h-4 text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm font-medium">{s.label}</span>
                                            </div>
                                            <span className="text-sm text-muted">
                                                {s.priceMod > 0 ? `+ R$ ${s.priceMod},00` : s.priceMod < 0 ? `- R$ ${Math.abs(s.priceMod)},00` : ''}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Second Flavor */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground">Escolher 2º sabor? (Opcional)</h3>
                                <select
                                    className="w-full p-3 border rounded-lg bg-background text-sm outline-none focus:ring-2 focus:ring-primary/20"
                                    value={secondFlavorId || ''}
                                    onChange={(e) => setSecondFlavorId(e.target.value || null)}
                                >
                                    <option value="">Não, quero inteira</option>
                                    {availablePizzas.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (+ {p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})</option>
                                    ))}
                                </select>
                                <p className="text-xs text-muted">Cobramos o valor da pizza mais cara.</p>
                            </div>

                            {/* Extras */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground">Adicionais</h3>
                                <div className="space-y-2">
                                    {EXTRAS.map((extra) => (
                                        <label key={extra.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-secondary transition-colors has-[:checked]:border-primary">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                                                    selectedExtras.includes(extra.id) ? "bg-primary border-primary text-white" : "border-muted-light bg-transparent"
                                                )}>
                                                    {selectedExtras.includes(extra.id) && <Check size={14} />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={selectedExtras.includes(extra.id)}
                                                    onChange={() => toggleExtra(extra.id)}
                                                />
                                                <span className="text-sm font-medium">{extra.label}</span>
                                            </div>
                                            <span className="text-sm text-muted">+ R$ {extra.price},00</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Observation */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Observações</h3>
                        <textarea
                            className="w-full p-3 border rounded-lg bg-secondary/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 h-24 resize-none"
                            placeholder="Ex: Tirar a cebola, caprichar no orégano..."
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-background shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 border rounded-lg p-1">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="p-2 hover:bg-secondary rounded-md text-primary disabled:opacity-50"
                                disabled={quantity <= 1}
                            >
                                <Minus size={18} />
                            </button>
                            <span className="w-8 text-center font-semibold">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="p-2 hover:bg-secondary rounded-md text-primary"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted">Total</p>
                            <p className="text-lg font-bold text-foreground">
                                {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="w-full btn btn-primary flex justify-between items-center"
                    >
                        <span>Adicionar ao pedido</span>
                        <span>{totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
