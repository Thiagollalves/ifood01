import { Product } from './types';

export const products: Product[] = [
    {
        id: '1',
        name: 'Margherita',
        description: 'Molho de tomate, mussarela e manjericão fresco.',
        price: 45.00,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=60',
        popular: true
    },
    {
        id: '2',
        name: 'Calabresa',
        description: 'Molho de tomate, mussarela, calabresa fatiada e cebola.',
        price: 48.00,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60',
        popular: true
    },
    {
        id: '3',
        name: 'Quatro Queijos',
        description: 'Molho de tomate, mussarela, provolone, gorgonzola e parmesão.',
        price: 52.00,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1571407970349-bc1671709bd5?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '4',
        name: 'Portuguesa',
        description: 'Mussarela, presunto, ovo, cebola, azeitona e ervilha.',
        price: 50.00,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '5',
        name: 'Coca-Cola 2L',
        description: 'Refrigerante garrafa 2 litros.',
        price: 12.00,
        category: 'Drink',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '6',
        name: 'Guaraná Antarctica 2L',
        description: 'Refrigerante garrafa 2 litros.',
        price: 11.00,
        category: 'Drink',
        image: 'https://images.unsplash.com/photo-1629553655490-50d4d293f0b2?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '7',
        name: 'Petit Gâteau',
        description: 'Bolo de chocolate com recheio cremoso. Acompanha sorvete.',
        price: 22.00,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop&q=60'
    }
];
