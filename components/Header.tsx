'use client';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

export function Header() {
    const { cart } = useStore();
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-border">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="text-xl font-bold text-primary">
                    Pizza<span className="text-foreground">Delivery</span>
                </Link>
                {/* Desktop Cart Link (Hidden on mobile if BottomNav is used, but good to have) */}
                <Link href="/cart" className="relative p-2 text-foreground hover:text-primary hidden md:block">
                    <ShoppingBag />
                    {itemCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white shadow-sm">
                            {itemCount}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
}
