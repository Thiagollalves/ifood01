'use client';
import { useStore } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { Clock, MapPin, Phone, User, Bike, CheckCircle2, ChefHat, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Status mapping for columns
const COLUMNS = [
    {
        id: 'new',
        title: 'Recebidos',
        statuses: ['Received'],
        icon: AlertCircle,
        color: 'bg-red-100 text-red-700 border-red-200'
    },
    {
        id: 'prep',
        title: 'Em Preparo',
        statuses: ['Accepted', 'Preparing'],
        icon: ChefHat,
        color: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    {
        id: 'delivery',
        title: 'Saiu para Entrega',
        statuses: ['Out_for_Delivery'],
        icon: Bike,
        color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
        id: 'done',
        title: 'Entregues',
        statuses: ['Delivered'],
        icon: CheckCircle2,
        color: 'bg-green-100 text-green-700 border-green-200'
    }
];

export default function AdminDashboard() {
    const { orders, updateOrderStatus } = useStore();
    const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);

    // Helper to format date
    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const handleDragStart = (e: React.DragEvent, orderId: string) => {
        setDraggedOrderId(orderId);
        e.dataTransfer.effectAllowed = 'move';
        // Transparent drag image hack or styling could go here
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e: React.DragEvent, targetStatus: OrderStatus) => {
        e.preventDefault();
        if (!draggedOrderId) return;

        // Don't update if status is same (simplified logic, assumes targetStatus is the primary status for the col)
        updateOrderStatus(draggedOrderId, targetStatus);
        setDraggedOrderId(null);
    };

    // Determine target status for drop based on column ID
    const getTargetStatusForColumn = (colId: string): OrderStatus => {
        switch (colId) {
            case 'new': return 'Received';
            case 'prep': return 'Preparing'; // Default to Preparing when dropped here
            case 'delivery': return 'Out_for_Delivery';
            case 'done': return 'Delivered';
            default: return 'Received';
        }
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Gestão de Pedidos</h1>
                <div className="text-sm text-muted">
                    Arraste os cartões para mudar o status
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 flex-1 h-full items-start">
                {COLUMNS.map((col) => {
                    const colOrders = orders
                        .filter(o => col.statuses.includes(o.status))
                        .sort((a, b) => b.createdAt - a.createdAt); // Newest first

                    const Icon = col.icon;

                    return (
                        <div
                            key={col.id}
                            className="flex-shrink-0 w-80 flex flex-col h-full bg-secondary/50 rounded-xl border border-border overflow-hidden"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, getTargetStatusForColumn(col.id))}
                        >
                            {/* Column Header */}
                            <div className={cn("p-4 border-b flex items-center justify-between font-semibold", col.color)}>
                                <div className="flex items-center gap-2">
                                    <Icon size={18} />
                                    {col.title}
                                </div>
                                <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">
                                    {colOrders.length}
                                </span>
                            </div>

                            {/* Cards Container */}
                            <div className="p-3 overflow-y-auto flex-1 space-y-3">
                                {colOrders.length === 0 && (
                                    <div className="text-center py-10 text-muted-light text-sm italic">
                                        Nenhum pedido
                                    </div>
                                )}

                                {colOrders.map(order => (
                                    <div
                                        key={order.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, order.id)}
                                        className={cn(
                                            "bg-white p-4 rounded-lg shadow-sm border border-border cursor-grab active:cursor-grabbing hover:shadow-md transition-all",
                                            draggedOrderId === order.id && "opacity-50 border-dashed border-primary"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-bold text-lg text-primary">#{order.id.slice(0, 4)}</span>
                                            <div className="flex items-center text-xs text-muted font-medium bg-secondary px-2 py-1 rounded-full">
                                                <Clock size={12} className="mr-1" />
                                                {formatTime(order.createdAt)}
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm text-foreground mb-3">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-muted shrink-0" />
                                                <span className="truncate font-medium">{order.customerName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-muted shrink-0" />
                                                <span>{order.customerPhone}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin size={14} className="text-muted shrink-0 mt-0.5" />
                                                <span className="line-clamp-2 text-xs leading-relaxed">{order.address}</span>
                                            </div>
                                        </div>

                                        <div className="border-t pt-3 space-y-1">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="text-sm flex justify-between gap-2">
                                                    <span className="text-muted-foreground truncate">
                                                        <span className="font-semibold text-foreground">{item.quantity}x</span> {item.product.name}
                                                        {item.additionalFlavors?.length ? ' (2 Sabores)' : ''}
                                                    </span>
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-xs text-muted italic">+ mais itens...</p>
                                            )}
                                        </div>

                                        <div className="mt-3 pt-2 border-t flex justify-between items-center">
                                            <span className="text-sm font-bold">
                                                {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                            <div className="flex gap-1">
                                                {/* Status Actions (Quick Buttons for mobile/accessibility) */}
                                                {col.id === 'new' && (
                                                    <button
                                                        title="Aceitar"
                                                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                                                        className="p-1.5 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200"
                                                    >
                                                        <ChefHat size={16} />
                                                    </button>
                                                )}
                                                {col.id === 'prep' && (
                                                    <button
                                                        title="Enviar Entrega"
                                                        onClick={() => updateOrderStatus(order.id, 'Out_for_Delivery')}
                                                        className="p-1.5 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                                                    >
                                                        <Bike size={16} />
                                                    </button>
                                                )}
                                                {col.id === 'delivery' && (
                                                    <button
                                                        title="Finalizar"
                                                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                                        className="p-1.5 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
                                                    >
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
