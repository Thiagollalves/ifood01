'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
    const { settings, updateSettings } = useStore();
    const [formData, setFormData] = useState(settings);
    const [isSaved, setIsSaved] = useState(false);

    // Sync with store when it loads
    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Configurações da Loja</h1>

            <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl shadow-sm border border-border space-y-6">

                {/* Basic Info */}
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg border-b pb-2">Informações Básicas</h2>

                    <div>
                        <label className="block text-sm font-medium mb-1">Nome do Restaurante</label>
                        <input
                            required
                            type="text"
                            className="w-full p-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Telefone / WhatsApp</label>
                            <input
                                required
                                type="text"
                                className="w-full p-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary/20"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Status da Loja</label>
                            <div className="flex items-center gap-3 h-[42px]">
                                <label className="cursor-pointer flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isOpen}
                                        onChange={e => setFormData({ ...formData, isOpen: e.target.checked })}
                                        className="w-5 h-5 accent-primary"
                                    />
                                    <span className={formData.isOpen ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                        {formData.isOpen ? 'Aberta' : 'Fechada'}
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Endereço Completo</label>
                        <input
                            required
                            type="text"
                            className="w-full p-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="space-y-4 pt-2">
                    <h2 className="font-semibold text-lg border-b pb-2">Entrega</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Taxa de Entrega (R$)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                className="w-full p-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary/20"
                                value={formData.deliveryFee}
                                onChange={e => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tempo Estimado</label>
                            <input
                                required
                                type="text"
                                placeholder="Ex: 40-50 min"
                                className="w-full p-2 border rounded-lg bg-background outline-none focus:ring-2 focus:ring-primary/20"
                                value={formData.deliveryTime}
                                onChange={e => setFormData({ ...formData, deliveryTime: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                    {isSaved && <span className="text-green-600 font-medium animate-in fade-in">Salvo com sucesso!</span>}
                    <div className={isSaved ? "" : "ml-auto"}>
                        <button
                            type="submit"
                            className="btn btn-primary gap-2 px-8"
                        >
                            <Save size={20} /> Salvar Alterações
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
