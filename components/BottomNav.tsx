'use client';
import { Home, ShoppingBag, Clock } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';

export function BottomNav() {
    const pathname = usePathname();
    const { cart } = useStore();
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const links = [
        { href: '/', icon: Home, label: 'Início' },
        { href: '/cart', icon: ShoppingBag, label: 'Sacola', badge: cartCount },
        { href: '/orders', icon: Clock, label: 'Pedidos' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white pb-safe md:hidden shadow-lg">
            <div className="flex justify-around py-3">
                {links.map(({ href, icon: Icon, label, badge }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex flex-col items-center gap-1 text-xs font-medium transition-colors",
                            pathname === href ? "text-primary" : "text-muted-light hover:text-muted"
                        )}
                    >
                        <div className="relative">
                            <Icon size={24} />
                            {badge !== undefined && badge > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white shadow-sm">
                                    {badge}
                                </span>
                            )}
                        </div>
                        <span>{label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
