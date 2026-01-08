'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Order } from '@/lib/types';

export default function CartPage() {
    const { cart, removeFromCart, cartTotal, placeOrder, settings, user } = useStore();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: (user?.addresses && user.addresses.length > 0)
            ? `${user.addresses[0].street}, ${user.addresses[0].number} - ${user.addresses[0].neighborhood}`
            : '',
        paymentMethod: 'credit_card'
    });

    const [loading, setLoading] = useState(false);

    // Auto-fill if user logs in mid-session or has data
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                phone: user.phone,
                // Simple logic: pick first address if available and field is empty
                address: !prev.address && user.addresses.length > 0
                    ? `${user.addresses[0].street}, ${user.addresses[0].number} - ${user.addresses[0].neighborhood}`
                    : prev.address
            }));
        }
    }, [user]);

    // Calculate final total
    const [coupon, setCoupon] = useState('');
    const [discount, setDiscount] = useState(0);

    const handleApplyCoupon = () => {
        if (coupon.toUpperCase() === 'PIZZA10') {
            setDiscount(cartTotal * 0.1);
            alert('Cupom aplicado com sucesso! (10% OFF)');
        } else if (coupon.toUpperCase() === 'ENTREGA') {
            setDiscount(settings.deliveryFee); // Free delivery essentially
            alert('Cupom de Frete Grátis aplicado!');
        } else {
            alert('Cupom inválido');
            setDiscount(0);
        }
    };

    const finalTotal = cartTotal + settings.deliveryFee - discount;

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings.isOpen) {
            alert('A loja está fechada no momento.');
            return;
        }

        // If user is not logged in, we could force login, but for MVP let's allow "Guest" orders
        // storing them in local storage history?
        // Better: Just proceed as guest, but if they are logged in, save to their history.

        setLoading(true);

        const newOrder: Order = {
            id: crypto.randomUUID(),
            customerName: formData.name,
            customerPhone: formData.phone,
            address: formData.address,
            items: [...cart], // clone
            total: finalTotal,
            status: 'Received',
            createdAt: Date.now()
        };

        // Construct WhatsApp Message
        const itemsList = cart.map(item => {
            const extras = item.extras?.length ? `\n   + ${item.extras.join(', ')}` : '';
            const obs = item.observation ? `\n   Obs: ${item.observation}` : '';
            const flavors = item.additionalFlavors?.map(f => ` / ${f.name}`).join('') || '';
            return `• ${item.quantity}x ${item.product.name}${flavors}${extras}${obs}`;
        }).join('\n');

        const message = `*NOVO PEDIDO #${newOrder.id.slice(0, 4)}* 🍕
    
*Cliente:* ${formData.name}
*Telefone:* ${formData.phone}
*Endereço:* ${formData.address}
*Pagamento:* ${formData.paymentMethod === 'credit_card' ? 'Cartão de Crédito' :
                formData.paymentMethod === 'debit_card' ? 'Cartão de Débito' :
                    formData.paymentMethod === 'pix' ? 'Pix' : 'Dinheiro'
            }

*ITENS:*
${itemsList}

*Taxa de Entrega:* ${settings.deliveryFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
*TOTAL:* ${finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}

Link do Pedido: ${window.location.origin}/orders`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/55${settings.phone.replace(/\D/g, '')}?text=${encodedMessage}`;

        // Helper to open link
        const openWhatsApp = () => {
            window.open(whatsappUrl, '_blank');
        };

        setTimeout(() => {
            placeOrder(newOrder);
            setLoading(false);
            openWhatsApp(); // Open WhatsApp
            router.push('/orders');
        }, 1000);
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 px-4">
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

            {!settings.isOpen && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 font-medium text-center">
                    🔴 A loja está fechada no momento. Você não poderá concluir o pedido.
                </div>
            )}

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

                    <div className="border-t pt-4 space-y-2">
                        {/* Coupon Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Cupom de desconto"
                                className="flex-1 p-2 border rounded-lg text-sm uppercase"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleApplyCoupon}
                                className="text-primary font-bold text-sm px-3 hover:bg-red-50 rounded-lg"
                            >
                                Aplicar
                            </button>
                        </div>

                        <div className="flex justify-between text-muted">
                            <span>Subtotal</span>
                            <span>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        <div className="flex justify-between text-muted">
                            <span>Taxa de entrega</span>
                            <span>{settings.deliveryFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-green-600 font-medium">
                                <span>Desconto</span>
                                <span>- {discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg text-foreground pt-2 border-t border-border">
                            <span>Total</span>
                            <span>{finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div>        </div>
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
                        disabled={loading || !settings.isOpen}
                        className="w-full btn btn-primary mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enviando...' : settings.isOpen ? 'Confirmar Pedido' : 'Loja Fechada'}
                    </button>
                </form>
            </div>
        </div>
    );
}
