'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Order, OrderStatus, Product } from './types';

interface StoreContextType {
    cart: CartItem[];
    orders: Order[];
    products: Product[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    placeOrder: (order: Order) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: string) => void;
    cartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]); // Initialize empty, load from seed/storage
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('pizza-cart');
        const savedOrders = localStorage.getItem('pizza-orders');
        const savedProducts = localStorage.getItem('pizza-products');

        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedOrders) setOrders(JSON.parse(savedOrders));

        // Seed products if empty (first run)
        if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
        } else {
            const { products: seedProducts } = require('./data');
            setProducts(seedProducts);
        }

        setIsInitialized(true);

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'pizza-cart' && e.newValue) setCart(JSON.parse(e.newValue));
            if (e.key === 'pizza-orders' && e.newValue) setOrders(JSON.parse(e.newValue));
            if (e.key === 'pizza-products' && e.newValue) setProducts(JSON.parse(e.newValue));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('pizza-cart', JSON.stringify(cart));
    }, [cart, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('pizza-orders', JSON.stringify(orders));
    }, [orders, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('pizza-products', JSON.stringify(products));
    }, [products, isInitialized]);

    const addToCart = (item: CartItem) => {
        setCart(prev => [...prev, item]);
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(i => i.id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const placeOrder = (order: Order) => {
        setOrders(prev => [order, ...prev]);
        clearCart();
    };

    const updateOrderStatus = (orderId: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    };

    // Product CRUD
    const addProduct = (product: Product) => {
        setProducts(prev => [...prev, product]);
    };

    const updateProduct = (product: Product) => {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    };

    const deleteProduct = (productId: string) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    const cartTotal = cart.reduce((acc, item) => acc + item.calculatedPrice * item.quantity, 0);

    return (
        <StoreContext.Provider value={{
            cart,
            orders,
            products, // Export managed products
            addToCart,
            removeFromCart,
            clearCart,
            placeOrder,
            updateOrderStatus,
            addProduct,
            updateProduct,
            deleteProduct,
            cartTotal
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}
