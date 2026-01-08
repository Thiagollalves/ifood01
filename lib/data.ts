import { Product, Category } from './types';

export const products: Product[] = [
    // --- PIZZAS SALGADAS ---
    {
        id: '1',
        name: 'Pizza Margherita',
        description: 'Molho de tomate, mussarela, manjericão fresco e azeite.',
        price: 45.00,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=60',
        popular: true
    },
    {
        id: '2',
        name: 'Pizza Pepperoni',
        description: 'Mussarela e fatias generosas de pepperoni.',
        price: 49.90,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=60',
        popular: true
    },
    {
        id: '3',
        name: 'Pizza Calabresa',
        description: 'Calabresa fatiada, cebola e azeitonas pretas.',
        price: 42.00,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '4',
        name: 'Pizza Quatro Queijos',
        description: 'Mussarela, provolone, parmesão e gorgonzola.',
        price: 52.00,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1571407970349-bc1671709bd5?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '5',
        name: 'Pizza Frango com Catupiry',
        description: 'Frango desfiado temperado e o autêntico Catupiry.',
        price: 48.00,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60',
        popular: true
    },
    {
        id: '6',
        name: 'Pizza Portuguesa',
        description: 'Presunto, ovos, cebola, ervilha e palmito.',
        price: 46.00,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '7',
        name: 'Pizza Vegetariana',
        description: 'Mix de pimentões, champignon, brócolis e cebola roxa.',
        price: 44.00,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1588315029754-04905f758f5f?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '8',
        name: 'Pizza Bacon crocante',
        description: 'Mussarela com muito bacon crocante e orégano.',
        price: 47.00,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1593560708920-63878b209e2e?w=800&auto=format&fit=crop&q=60'
    },

    // --- BEBIDAS ---
    {
        id: '10',
        name: 'Coca-Cola 2L',
        description: 'Refrigerante garrafa 2 litros.',
        price: 14.00,
        category: 'Drink',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '11',
        name: 'Guaraná Antarctica 2L',
        description: 'O original do Brasil.',
        price: 12.00,
        category: 'Drink',
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '12',
        name: 'Suco de Laranja 500ml',
        description: 'Natural, espremido na hora.',
        price: 10.00,
        category: 'Drink',
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '13',
        name: 'Água com Gás',
        description: 'Garrafa 500ml.',
        price: 5.00,
        category: 'Drink',
        image: 'https://images.unsplash.com/photo-1560662659-1582264c7ad6?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '14',
        name: 'Cerveja Heineken Long Neck',
        description: '330ml, gelada.',
        price: 9.00,
        category: 'Drink',
        image: 'https://images.unsplash.com/photo-1618885472179-8e433e69745e?w=800&auto=format&fit=crop&q=60'
    },

    // --- SOBREMESAS ---
    {
        id: '20',
        name: 'Pizza de Chocolate',
        description: 'Chocolate ao leite derretido com granulado.',
        price: 35.00,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60',
        popular: true
    },
    {
        id: '21',
        name: 'Pizza Romeu e Julieta',
        description: 'Goiabada cremosa com queijo minas.',
        price: 38.00,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '22',
        name: 'Petit Gateau',
        description: 'Bolo de chocolate quente com sorvete de creme.',
        price: 22.00,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop&q=60'
    },
    {
        id: '23',
        name: 'Pudim de Leite',
        description: 'O clássico pudim sem furinhos.',
        price: 12.00,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60'
    },
];

export const CATEGORIES_DATA: { id: Category | 'All', label: string, image: string }[] = [
    { id: 'All', label: 'Início', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&fit=crop' },
    { id: 'Pizza', label: 'Pizzas', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200&fit=crop' },
    { id: 'Drink', label: 'Bebidas', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&fit=crop' },
    { id: 'Dessert', label: 'Doces', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&fit=crop' }
];

export const CATEGORIES = [
    { id: 'All', label: 'Todos' },
    { id: 'Pizza', label: 'Pizzas' },
    { id: 'Drink', label: 'Bebidas' },
    { id: 'Dessert', label: 'Sobremesas' }
];
