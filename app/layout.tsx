import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pizza Delivery',
  description: 'A melhor pizza da cidade',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PizzaApp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={cn(inter.className, "min-h-screen bg-secondary pb-[80px] md:pb-0")}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
