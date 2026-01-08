'use client';

import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { LogOut, MapPin, Plus, User as UserIcon, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Address } from '@/lib/types';
import { cn } from '@/lib/utils'; // Assuming cn utility is available or add import

export default function ProfilePage() {
    const { user, logout, addAddress } = useStore();
    const router = useRouter();
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState<Partial<Address>>({ label: 'Casa' });

    if (!user) {
        router.push('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAddress.street || !newAddress.number || !newAddress.neighborhood) return;

        const address: Address = {
            id: crypto.randomUUID(),
            label: newAddress.label || 'Casa',
            street: newAddress.street,
            number: newAddress.number,
            complement: newAddress.complement || '',
            neighborhood: newAddress.neighborhood,
            city: newAddress.city || 'São Paulo', // Hardcoded city for MVP simplicity
            zipCode: newAddress.zipCode || '00000-000'
        };

        addAddress(address);
        setShowAddressForm(false);
        setNewAddress({ label: 'Casa' });
    };

    return (
        <div className="p-4 space-y-6 pb-24">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                    <UserIcon size={32} className="text-muted" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">{user.name}</h1>
                    <p className="text-muted text-sm">{user.phone}</p>
                </div>
            </div>

            <hr className="border-border" />

            {/* Addresses */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg">Meus Endereços</h2>
                    <button
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="text-primary text-sm font-semibold flex items-center gap-1"
                    >
                        <Plus size={16} /> Adicionar
                    </button>
                </div>

                {showAddressForm && (
                    <form onSubmit={handleSaveAddress} className="bg-secondary/30 p-4 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 gap-3">
                            <select
                                className="p-2 border rounded-md"
                                value={newAddress.label}
                                onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                            >
                                <option value="Casa">Casa</option>
                                <option value="Trabalho">Trabalho</option>
                                <option value="Outro">Outro</option>
                            </select>
                            <input
                                placeholder="CEP"
                                className="p-2 border rounded-md w-full"
                                value={newAddress.zipCode || ''}
                                onChange={e => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                            />
                        </div>
                        <input
                            placeholder="Rua"
                            className="p-2 border rounded-md w-full"
                            value={newAddress.street || ''}
                            onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                            required
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                placeholder="Número"
                                className="p-2 border rounded-md w-full"
                                value={newAddress.number || ''}
                                onChange={e => setNewAddress({ ...newAddress, number: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Complemento"
                                className="p-2 border rounded-md w-full"
                                value={newAddress.complement || ''}
                                onChange={e => setNewAddress({ ...newAddress, complement: e.target.value })}
                            />
                        </div>
                        <input
                            placeholder="Bairro"
                            className="p-2 border rounded-md w-full"
                            value={newAddress.neighborhood || ''}
                            onChange={e => setNewAddress({ ...newAddress, neighborhood: e.target.value })}
                            required
                        />
                        <div className="flex gap-2 pt-2">
                            <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-md font-medium">Salvar</button>
                            <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md font-medium">Cancelar</button>
                        </div>
                    </form>
                )}

                {user.addresses.length === 0 && !showAddressForm ? (
                    <p className="text-muted text-sm italic">Nenhum endereço salvo.</p>
                ) : (
                    <div className="space-y-3">
                        {user.addresses.map(addr => (
                            <div key={addr.id} className="flex items-start gap-3 p-3 border rounded-lg bg-white shadow-sm">
                                <MapPin className="text-primary mt-1 shrink-0" size={20} />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-sm">{addr.label}</h3>
                                    <p className="text-sm text-muted">
                                        {addr.street}, {addr.number} {addr.complement ? `- ${addr.complement}` : ''}
                                    </p>
                                    <p className="text-xs text-muted-light">{addr.neighborhood} - {addr.city}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <hr className="border-border" />

            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-red-600 font-medium py-3 rounded-lg hover:bg-red-50 transition-colors"
            >
                <LogOut size={20} />
                Sair da conta
            </button>
        </div>
    );
}
