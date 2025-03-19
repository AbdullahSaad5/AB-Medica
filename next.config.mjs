/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  swcMinify: true,
};

export default nextConfig;
