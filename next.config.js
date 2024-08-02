/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.scdn.co', 'daily-mix.scdn.co', 'charts-images.scdn.co'], // Add your image domains here
  },
}

module.exports = nextConfig
