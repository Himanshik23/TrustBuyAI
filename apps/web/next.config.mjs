/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(process.env.DOCKER_BUILD ? { output: "standalone" } : {}),
};

export default nextConfig;
