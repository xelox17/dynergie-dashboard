/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_API_URL:    process.env.NEXT_PUBLIC_API_URL    ?? "http://localhost:8000",
    NEXT_PUBLIC_DEMO_MODE:  process.env.NEXT_PUBLIC_DEMO_MODE  ?? "false",
  },
};

export default nextConfig;
