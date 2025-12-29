/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Disabled React Compiler to fix memory issues - it's still experimental in Next.js 16
  reactCompiler: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
