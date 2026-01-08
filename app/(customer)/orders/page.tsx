'use client';
import { useStore } from '@/lib/store';
import { OrderStatus } from '@/lib/types';
import { CheckCircle2, Circle, Truck, ChefHat, ClipboardList, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

const STEPS: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'Received', label: 'Recebido', icon: ClipboardList },
    { status: 'Accepted', label: 'Aceito', icon: CheckCircle2 },
    { status: 'Preparing', label: 'Preparando', icon: ChefHat },
    { status: 'Out_for_Delivery', label: 'Saiu para Entrega', icon: Truck },
    { status: 'Delivered', label: 'Entregue', icon: MapPin },
] as const;

export default function OrdersPage() {
    const { orders } = useStore();

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="bg-secondary p-6 rounded-full">
                    <ClipboardList size={48} className="text-muted" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Nenhum pedido ainda</h2>
                <p className="text-muted">Seus pedidos anteriores aparecerão aqui.</p>
                <Link href="/" className="btn btn-primary mt-4">
                    Fazer um Pedido
                </Link>
            </div>
        );
    }

    // Active status index helper
    const getStatusIndex = (status: OrderStatus) => STEPS.findIndex(s => s.status === status);

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground">Meus Pedidos</h1>

            <div className="space-y-6">
                {orders.slice().reverse().map((order) => {
                    const currentStepIndex = getStatusIndex(order.status);

                    return (
                        <div key={order.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                            <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30">
                                <div>
                                    <p className="text-xs text-muted">Pedido #{order.id.slice(0, 8)}</p>
                                    <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                                </div>
                                <span className={cn(
                                    "px-2 py-1 rounded-full text-xs font-medium",
                                    order.status === 'Delivered' ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
                                )}>
                                    {STEPS.find(s => s.status === order.status)?.label}
                                </span>
                            </div>

                            <div className="p-4">
                                {/* Status Steps */}
                                <div className="relative flex justify-between mb-8 px-2">
                                    {/* Line */}
                                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10 -translate-y-1/2" />
                                    <div
                                        className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-500"
                                        style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                                    />

                                    {STEPS.map((step, idx) => {
                                        const isCompleted = idx <= currentStepIndex;
                                        const isCurrent = idx === currentStepIndex;
                                        const Icon = step.icon;

                                        return (
                                            <div key={step.status} className="flex flex-col items-center gap-2 bg-card">
                                                <div className={cn(
                                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                                                    isCompleted ? "bg-primary border-primary text-white" : "bg-card border-border text-muted-light",
                                                    isCurrent ? "ring-4 ring-primary/20 scale-110" : ""
                                                )}>
                                                    <Icon size={14} />
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] sm:text-xs font-medium absolute top-10 w-20 text-center",
                                                    isCompleted ? "text-primary" : "text-muted-light"
                                                )}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Items Summary */}
                                <div className="mt-8 space-y-2">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <span className="font-semibold text-primary">{item.quantity}x</span>
                                            <span className="text-foreground">{item.product.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                    <span className="text-sm text-foreground">{order.address}</span>
                                    <span className="font-bold text-lg">{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
