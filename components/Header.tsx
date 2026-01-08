'use client';

import { ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Header() {
    const { cart, user } = useStore();
    const pathname = usePathname();
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Hide header on login page
    if (pathname === '/login') return null;

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-border h-16 z-50 px-4 flex items-center justify-between shadow-sm">
            <Link href="/" className="font-bold text-xl text-primary">
                Pizza Delivery
            </Link>

            <div className="flex items-center gap-4">
                <Link
                    href={user ? "/profile" : "/login"}
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:bg-secondary p-2 rounded-full transition-colors"
                >
                    <div className="bg-secondary p-1.5 rounded-full">
                        <User size={20} className="text-muted" />
                    </div>
                    <span className="hidden md:inline">
                        {user ? user.name.split(' ')[0] : 'Entrar'}
                    </span>
                </Link>

                <Link href="/cart" className="relative p-2 hover:bg-secondary rounded-full transition-colors">
                    <ShoppingBag className="text-primary" size={24} />
                    {itemCount > 0 && (
                        <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in">
                            {itemCount}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
}
