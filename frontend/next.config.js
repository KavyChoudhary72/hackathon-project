/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // GSAP / ScrollTrigger cleanup is cleaner without double-mount in dev
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
