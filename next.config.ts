import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.6'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig