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
    ],
  },
}

module.exports = nextConfig
