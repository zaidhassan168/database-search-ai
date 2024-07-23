/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
      }
    }
    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/examples',
        permanent: true,
      },
    ];
  },
}

export default nextConfig