'use client';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const { cart, removeFromCart, cartTotal, placeOrder } = useStore();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        paymentMethod: 'credit_card'
    });

    const [loading, setLoading] = useState(false);

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newOrder = {
            id: crypto.randomUUID(),
            customerName: formData.name,
            customerPhone: formData.phone,
            address: formData.address,
            items: [...cart], // clone
            total: cartTotal,
            status: 'Received' as const,
            createdAt: Date.now()
        };

        setTimeout(() => {
            placeOrder(newOrder);
            setLoading(false);
            router.push('/orders');
        }, 1000); // Create a small delay to simulate processing
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <Image src="https://illustrations.popsy.co/gray/shopping-bag.svg" width={200} height={200} alt="Empty Cart" />
                <h2 className="text-xl font-bold text-foreground">Sua sacola está vazia</h2>
                <p className="text-muted">Adicione itens para fazer seu pedido.</p>
                <Link href="/" className="btn btn-primary mt-4">
                    Ver Cardápio
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/" className="p-2 -ml-2 hover:bg-secondary rounded-full">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-foreground">Finalizar Pedido</h1>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Order Summary */}
                <div className="space-y-6">
                    <h2 className="font-semibold text-lg">Itens do Pedido</h2>
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 bg-card rounded-lg shadow-sm border border-border">
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-medium text-foreground truncate">
                                            {item.quantity}x {item.product.name}
                                            {item.additionalFlavors?.map(f => ` / ${f.name}`).join('')}
                                        </h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-muted-light hover:text-red-500 transition-colors p-1"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="text-sm text-muted mt-1 space-y-0.5">
                                        {item.size && <p>Tamanho: {item.size}</p>}
                                        {item.extras && item.extras.length > 0 && <p>Adicionais: {item.extras.join(', ')}</p>}
                                        {item.observation && <p className="text-xs italic">Obs: {item.observation}</p>}
                                    </div>

                                    <p className="mt-2 font-medium text-foreground">
                                        {item.calculatedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-xl text-primary">
                            {cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleCheckout} className="space-y-6 bg-card p-6 rounded-xl shadow-sm border border-border h-fit">
                    <h2 className="font-semibold text-lg">Entrega e Pagamento</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Seu Nome</label>
                            <input
                                required
                                type="text"
                                className="w-full p-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary/20"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Telefone (WhatsApp)</label>
                            <input
                                required
                                type="tel"
                                className="w-full p-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary/20"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Endereço Completo</label>
                            <textarea
                                required
                                className="w-full p-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary/20 resize-none h-24"
                                placeholder="Rua, Número, Bairro, Complemento"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
                            <select
                                className="w-full p-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary/20"
                                value={formData.paymentMethod}
                                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                            >
                                <option value="credit_card">Cartão de Crédito (Na entrega)</option>
                                <option value="debit_card">Cartão de Débito (Na entrega)</option>
                                <option value="pix">Pix (Na entrega)</option>
                                <option value="cash">Dinheiro</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn btn-primary mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enviando...' : 'Confirmar Pedido'}
                    </button>
                </form>
            </div>
        </div>
    );
}
