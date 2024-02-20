/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["klipp.s3.ca-central-1.amazonaws.com"],
  },
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.BACKEND_URL + "/:path*",
      },
    ];
  },
};
module.exports = nextConfig;
