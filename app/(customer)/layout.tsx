import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container flex-1 py-4 pb-24 md:pb-8">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
