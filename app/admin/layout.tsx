import Link from 'next/link';
import { LayoutDashboard, Pizza, Settings } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-secondary/50">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-primary">PizzaAdmin</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary text-foreground transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Pedidos</span>
                    </Link>
                    <Link href="/admin/menu" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary text-foreground transition-colors">
                        <Pizza size={20} />
                        <span className="font-medium">Cardápio</span>
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary text-muted-light transition-colors">
                        <Settings size={20} />
                        <span className="font-medium">Confurações</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-card border-b border-border h-16 flex items-center px-6 md:hidden">
                    <span className="font-bold text-primary">PizzaAdmin</span>
                    {/* Mobile toggle would go here */}
                </header>
                <div className="p-6 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
