'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Order, OrderStatus, Product, RestaurantSettings, User, Address } from './types';

interface StoreContextType {
    cart: CartItem[];
    orders: Order[];
    products: Product[];
    settings: RestaurantSettings;
    user: User | null;
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    placeOrder: (order: Order) => void;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: string) => void;
    updateSettings: (settings: RestaurantSettings) => void;
    login: (phone: string, password?: string) => void;
    register: (user: User) => void;
    logout: () => void;
    addAddress: (address: Address) => void;
    cartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_SETTINGS: RestaurantSettings = {
    name: 'Pizza Delivery',
    phone: '(11) 99999-9999',
    address: 'Rua das Pizzas, 123',
    deliveryFee: 5.00,
    deliveryTime: '40-50 min',
    isOpen: true
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
    const [user, setUser] = useState<User | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('pizza-cart');
        const savedOrders = localStorage.getItem('pizza-orders');
        const savedProducts = localStorage.getItem('pizza-products');
        const savedSettings = localStorage.getItem('pizza-settings');
        const savedUser = localStorage.getItem('pizza-user');

        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedOrders) setOrders(JSON.parse(savedOrders));

        // Seed products if empty (first run)
        if (savedProducts) {
            setProducts(JSON.parse(savedProducts));
        } else {
            const { products: seedProducts } = require('./data');
            setProducts(seedProducts);
        }

        if (savedSettings) setSettings(JSON.parse(savedSettings));
        if (savedUser) setUser(JSON.parse(savedUser));

        setIsInitialized(true);

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'pizza-cart' && e.newValue) setCart(JSON.parse(e.newValue));
            if (e.key === 'pizza-orders' && e.newValue) setOrders(JSON.parse(e.newValue));
            if (e.key === 'pizza-products' && e.newValue) setProducts(JSON.parse(e.newValue));
            if (e.key === 'pizza-settings' && e.newValue) setSettings(JSON.parse(e.newValue));
            if (e.key === 'pizza-user' && e.newValue) setUser(JSON.parse(e.newValue));
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

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('pizza-settings', JSON.stringify(settings));
    }, [settings, isInitialized]);

    useEffect(() => {
        if (!isInitialized) return;
        if (user) {
            localStorage.setItem('pizza-user', JSON.stringify(user));
        } else {
            localStorage.removeItem('pizza-user');
        }
    }, [user, isInitialized]);

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

        // Add to user history if logged in
        if (user) {
            const updatedUser = {
                ...user,
                orders: [order, ...user.orders]
            };
            setUser(updatedUser);
        }

        clearCart();
    };

    const updateOrderStatus = (orderId: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

        // Also update user history if the order belongs to them
        if (user) {
            setUser(prevUser => {
                if (!prevUser) return null;
                return {
                    ...prevUser,
                    orders: prevUser.orders.map(o => o.id === orderId ? { ...o, status } : o)
                };
            });
        }
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

    const updateSettings = (newSettings: RestaurantSettings) => {
        setSettings(newSettings);
    };

    // User Auth
    const register = (newUser: User) => {
        // In a real app we would check API availability.
        // Here we just save to session
        setUser(newUser);
        localStorage.setItem('pizza-user', JSON.stringify(newUser)); // Persist immediately
    };

    const login = (phone: string, password?: string) => {
        // Simulating login: Retrieve from storage or check credential
        // For this MVP, we are allowing simple login if user matches (checking storage)
        // OR creating a temporary session if not "registered" fully yet.

        // Try to find a user in a "users" database (omitted for MVP simplicity, we rely on single-user session or 'pizza-user')
        const savedUser = localStorage.getItem('pizza-user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed.phone === phone) {
                // Simple password check (if it was implemented fully we'd hash it)
                if (parsed.password && password && parsed.password !== password) {
                    throw new Error('Senha incorreta');
                }
                setUser(parsed);
                return;
            }
        }

        // Fallback for logic where we just set the phone session (legacy/simple login)
        // Only if password is NOT required/provided.
        if (!password) {
            const tempUser: User = {
                id: phone,
                name: 'Convidado',
                phone,
                whatsapp: phone,
                age: '',
                addresses: [],
                orders: []
            };
            setUser(tempUser);
        } else {
            throw new Error('Usuário não encontrado. Faça seu cadastro.');
        }
    };

    const logout = () => {
        setUser(null);
    };

    const addAddress = (address: Address) => {
        if (!user) return;
        const updatedUser = {
            ...user,
            addresses: [...user.addresses, address]
        };
        setUser(updatedUser);
    };

    const cartTotal = cart.reduce((acc, item) => acc + item.calculatedPrice * item.quantity, 0);

    return (
        <StoreContext.Provider value={{
            cart,
            orders,
            products,
            settings,
            user,
            addToCart,
            removeFromCart,
            clearCart,
            placeOrder,
            updateOrderStatus,
            addProduct,
            updateProduct,
            deleteProduct,
            updateSettings,
            login,
            register,
            logout,
            addAddress,
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
