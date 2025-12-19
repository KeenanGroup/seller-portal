import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'media.thekeenangroup.com' },
      { protocol: 'https', hostname: 'pub-c251132e338c43a78dd6e48d0d8d1204.r2.dev' },
    ],
  },
}

export default nextConfig
