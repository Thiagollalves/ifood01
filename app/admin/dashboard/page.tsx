'use client';
import { useStore } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { ChevronDown, Clock, MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const STATUS_OPTIONS: OrderStatus[] = ['Received', 'Accepted', 'Preparing', 'Out_for_Delivery', 'Delivered'];

export default function AdminDashboard() {
    const { orders, updateOrderStatus } = useStore();

    // Sort by received time (newest first)
    const sortedOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">Gerenciar Pedidos</h1>
                <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm">
                    <span className="font-bold">{orders.filter(o => o.status !== 'Delivered').length}</span> ativos
                </div>
            </div>

            <div className="grid gap-4">
                {sortedOrders.map((order) => (
                    <div key={order.id} className="bg-card rounded-lg border border-border shadow-sm p-4 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-lg">#{order.id.slice(0, 6)}</span>
                                <span className="text-sm text-muted">
                                    {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className="px-2 py-0.5 bg-secondary text-xs rounded-full font-medium">
                                    {order.customerName}
                                </span>
                            </div>

                            <div className="text-sm space-y-1">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-2 text-foreground">
                                        <span className="font-bold text-primary">{item.quantity}x</span>
                                        <span>
                                            {item.product.name} {item.size && `(${item.size})`}
                                            {item.observation && <span className="text-xs text-red-500 italic"> - Obs: {item.observation}</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-light mt-2">
                                <div className="flex items-center gap-1">
                                    <Phone size={12} /> {order.customerPhone}
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin size={12} /> {order.address}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[200px]">
                            <select
                                className={cn(
                                    "w-full p-2 rounded-lg text-sm font-medium outline-none cursor-pointer text-white",
                                    order.status === 'Received' ? "bg-blue-500" :
                                        order.status === 'Accepted' ? "bg-yellow-500" :
                                            order.status === 'Preparing' ? "bg-orange-500" :
                                                order.status === 'Out_for_Delivery' ? "bg-purple-500" :
                                                    "bg-green-500"
                                )}
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            >
                                {STATUS_OPTIONS.map(status => (
                                    <option key={status} value={status} className="bg-white text-black">
                                        {status.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                            <div className="text-right font-bold text-lg">
                                {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                        </div>
                    </div>
                ))}

                {sortedOrders.length === 0 && (
                    <div className="text-center py-20 text-muted">Aguardando pedidos...</div>
                )}
            </div>
        </div>
    );
}
