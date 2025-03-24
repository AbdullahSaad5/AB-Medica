/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        protocol: "http",
      },
      {
        hostname: "ab-medica.vercel.app",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
