import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '128kVPN',
        short_name: '128kVPN',
        description: 'Experience speed restrictions easily with a VPN',
        start_url: '/',
        display: 'standalone',
        background_color: '#eceff1',
        theme_color: '#fff',
        icons: [
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
