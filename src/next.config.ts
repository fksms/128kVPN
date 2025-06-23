import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
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
    trailingSlash: false, // パスの末尾にスラッシュがある場合は削除してリダイレクト（デフォルト動作）
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
