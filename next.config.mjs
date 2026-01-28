/** @type {import('next').NextConfig} */
import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Prevent Next from picking workspace root based on a lockfile outside Web-ui.
  // This matters for output tracing and can also affect module resolution in some setups.
  outputFileTracingRoot: path.join(process.cwd()),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Security headers for all pages
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Static uploads must be cached aggressively; filenames are unique (UUID) for products.
        // Hero/secondary are stable names, but can be cache-busted by changing file names in bot,
        // or by manual hard refresh.
        source: '/images/uploads/:path*',
        headers: [
          // Cache images for performance. If you need instant updates for hero/secondary,
          // use filename versioning on upload (recommended) or a hard refresh.
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ]
  },
}

export default nextConfig
