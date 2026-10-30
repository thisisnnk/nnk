/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@tsparticles/react', '@tsparticles/engine', '@tsparticles/slim'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ybghrhxtiqwarnirmyur.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig
