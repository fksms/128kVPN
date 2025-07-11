import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://128kvpn.net',
            lastModified: '2025-07-11',
            changeFrequency: 'monthly',
            priority: 1,
            alternates: {
                languages: {
                    ja: 'https://128kvpn.net/ja',
                    en: 'https://128kvpn.net/en',
                },
            },
        },
        {
            url: 'https://128kvpn.net/guide',
            lastModified: '2025-07-11',
            changeFrequency: 'monthly',
            priority: 0.8,
            alternates: {
                languages: {
                    ja: 'https://128kvpn.net/ja/guide',
                    en: 'https://128kvpn.net/en/guide',
                },
            },
        },
        {
            url: 'https://128kvpn.net/privacy-policy',
            lastModified: '2025-07-11',
            changeFrequency: 'monthly',
            priority: 0.5,
            alternates: {
                languages: {
                    ja: 'https://128kvpn.net/ja/privacy-policy',
                    en: 'https://128kvpn.net/en/privacy-policy',
                },
            },
        },
        {
            url: 'https://128kvpn.net/register',
            lastModified: '2025-07-11',
            changeFrequency: 'monthly',
            priority: 0.3,
            alternates: {
                languages: {
                    ja: 'https://128kvpn.net/ja/register',
                    en: 'https://128kvpn.net/en/register',
                },
            },
        },
        {
            url: 'https://128kvpn.net/login',
            lastModified: '2025-07-11',
            changeFrequency: 'monthly',
            priority: 0.3,
            alternates: {
                languages: {
                    ja: 'https://128kvpn.net/ja/login',
                    en: 'https://128kvpn.net/en/login',
                },
            },
        },
    ];
}
