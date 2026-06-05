// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i0.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i1.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i2.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s0.wp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "taiwodavid0027.wordpress.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
