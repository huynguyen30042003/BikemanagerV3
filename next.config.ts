/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "5001",
        pathname: "/media/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
  reactStrictMode: true
};

export default nextConfig;
