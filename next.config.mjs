import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
    ],
  },
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default withNextIntl(nextConfig);
