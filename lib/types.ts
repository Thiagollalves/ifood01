export type Category = 'Pizza' | 'Drink' | 'Dessert';

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
