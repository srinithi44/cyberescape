/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Canvas/Three performance optimization
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

module.exports = nextConfig;
