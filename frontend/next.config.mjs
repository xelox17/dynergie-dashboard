/** @type {import('next').NextConfig} */
const nextConfig = {
  // NEXT_PUBLIC_API_URL is set in Vercel environment variables
  // Falls back to localhost for local development
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  },
};

export default nextConfig;
