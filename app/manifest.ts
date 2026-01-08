import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Pizza Delivery App',
        short_name: 'PizzaApp',
        description: 'A melhor pizza da cidade no seu bolso',
        start_url: '/',
        display: 'standalone',
        background_color: '#FFFFFF',
        theme_color: '#EA1D2C',
        icons: [
            {
                src: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png', // Temporary placeholder
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
