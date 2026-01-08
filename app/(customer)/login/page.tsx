'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useStore();
    const router = useRouter();

    const [phone, setPhone] = useState('');
    const [name, setName] = useState(''); // Valid as password for now

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 8) return;

        try {
            login(phone, name); // name state is holding password
            router.back();
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white space-y-8">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <h1 className="text-primary text-4xl font-bold mb-2">iFood</h1>
                    <h2 className="text-xl font-semibold text-foreground">Acesse sua conta</h2>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-3 py-3 border rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Continuar com Google
                    </button>
                    <button className="w-full flex items-center justify-center gap-3 py-3 border rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
                        Continuar com Facebook
                    </button>
                </div>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">ou entre com celular</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <form onSubmit={handleFinalSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted">Celular / Login</label>
                        <input
                            type="tel"
                            placeholder="(00) 00000-0000"
                            className="w-full p-3 border rounded-lg outline-none focus:border-primary text-lg"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted">Senha (Opcional se convidado)</label>
                        <input
                            type="password"
                            placeholder="******"
                            className="w-full p-3 border rounded-lg outline-none focus:border-primary text-lg"
                            value={name} // Reusing 'name' state as password for validaiton simplicity in this MVP step
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full btn btn-primary py-3 text-lg font-bold"
                    >
                        Entrar
                    </button>
                </form>

                <div className="text-center space-y-4">
                    <Link href="/signup" className="block text-primary font-semibold hover:underline">
                        Não tem conta? Cadastre-se
                    </Link>
                    <Link href="/" className="block text-muted text-sm">
                        Continuar como convidado
                    </Link>
                </div>
            </div>
        </div>
    );
}
