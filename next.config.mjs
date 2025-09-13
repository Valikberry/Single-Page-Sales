/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    staleTimes: {
      dynamic: 30, // 30 seconds for dynamic pages
      static: 300, // 5 minutes for static content
    },
  },
};

export default nextConfig;
