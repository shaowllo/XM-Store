import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
    ],
  },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
};

export default withNextIntl(nextConfig);
