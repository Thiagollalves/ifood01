export type Category = 'Pizza' | 'Drink' | 'Dessert';

export interface Address {
    id: string;
    label: string; // e.g., "Casa", "Trabalho"
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    zipCode: string;
}

export interface User {
    id: string;
    name: string;
    phone: string;
    password?: string; // Optional for simulated legacy users or social logic
    whatsapp: string;
    age: string;
    photoUrl?: string; // Base64 or URL
    email?: string;
    addresses: Address[];
    orders: Order[]; // For history
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: Category;
    image: string;
    popular?: boolean;
}

export type PizzaSize = 'M' | 'L' | 'XL';

export interface CartItem {
    id: string; // Unique for cart entry (e.g. combination of product + options)
    product: Product;
    quantity: number;
    size?: PizzaSize;
    extras?: string[];
    additionalFlavors?: Product[];
    observation?: string;
    calculatedPrice: number;
}

export type OrderStatus = 'Received' | 'Accepted' | 'Preparing' | 'Out_for_Delivery' | 'Delivered';

export interface Order {
    id: string;
    customerName: string;
    customerPhone: string;
    address: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    createdAt: number; // timestamp
}

export interface RestaurantSettings {
    name: string;
    phone: string;
    address: string;
    deliveryFee: number;
    deliveryTime: string; // e.g. "40-60 min"
    isOpen: boolean;
}
