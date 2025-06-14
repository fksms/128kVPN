import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
    /* config options here */
    output: process.env.NEXT_BUILD_MODE === 'standalone' ? 'standalone' : undefined,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
                port: '',
                pathname: '**',
            },
        ],
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
