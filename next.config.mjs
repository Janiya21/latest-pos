/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        runtime: 'nodejs', // Use Node.js runtime for server-side logic
      },
};

export default nextConfig;
