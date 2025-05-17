import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig = {
  /* config options here */
  output: 'standalone',
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
