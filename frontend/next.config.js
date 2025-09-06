/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'images.unsplash.com'],
  },
  // Remove rewrites for production - API will be handled by serverless functions
}

module.exports = nextConfig
