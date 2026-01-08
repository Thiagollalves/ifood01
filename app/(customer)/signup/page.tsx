'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, Upload, ArrowLeft } from 'lucide-react';
import { Address, User } from '@/lib/types';

export default function SignupPage() {
    const { register } = useStore();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        whatsapp: '',
        password: '',
        zipCode: '',
        street: '',
        number: '',
        neighborhood: '',
        city: 'São Paulo', // Default for MVP
        state: 'SP'
    });

    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newAddress: Address = {
            id: crypto.randomUUID(),
            label: 'Casa',
            street: formData.street,
            number: formData.number,
            neighborhood: formData.neighborhood,
            city: formData.city,
            zipCode: formData.zipCode
        };

        const newUser: User = {
            id: formData.phone,
            name: formData.name,
            age: formData.age,
            phone: formData.phone,
            whatsapp: formData.whatsapp,
            password: formData.password,
            photoUrl: photoPreview || undefined,
            addresses: [newAddress],
            orders: []
        };

        register(newUser);
        router.push('/profile');
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="p-4 border-b flex items-center gap-4 sticky top-0 bg-white z-10">
                <Link href="/login" className="text-foreground">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-lg font-bold">Criar Conta</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-md mx-auto">

                {/* Photo Upload */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative w-24 h-24 rounded-full bg-secondary overflow-hidden border-2 border-dashed border-muted-light flex items-center justify-center group cursor-pointer hover:border-primary transition-colors">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="text-muted-light" size={32} />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handlePhotoUpload}
                        />
                    </div>
                    <span className="text-sm text-primary font-medium">Adicionar Foto</span>
                </div>

                {/* Personal Info */}
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg border-b pb-1">Dados Pessoais</h2>

                    <input
                        placeholder="Nome Completo"
                        className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Idade"
                            type="number"
                            className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                            value={formData.age}
                            onChange={e => setFormData({ ...formData, age: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Celular"
                            type="tel"
                            className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>
                    <input
                        placeholder="WhatsApp"
                        type="tel"
                        className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                        value={formData.whatsapp}
                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Senha"
                        type="password"
                        className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>

                {/* Address */}
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg border-b pb-1">Endereço Principal</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="CEP"
                            className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                            value={formData.zipCode}
                            onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Número"
                            className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                            value={formData.number}
                            onChange={e => setFormData({ ...formData, number: e.target.value })}
                            required
                        />
                    </div>
                    <input
                        placeholder="Rua"
                        className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                        value={formData.street}
                        onChange={e => setFormData({ ...formData, street: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Bairro"
                        className="w-full p-3 border rounded-lg outline-none focus:border-primary"
                        value={formData.neighborhood}
                        onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Cidade"
                        className="w-full p-3 bg-secondary border rounded-lg outline-none text-muted"
                        value={formData.city}
                        readOnly
                    />
                </div>

                <button type="submit" className="w-full btn btn-primary py-4 text-lg font-bold rounded-xl shadow-lg mt-4">
                    Cadastrar
                </button>
            </form>
        </div>
    );
}
