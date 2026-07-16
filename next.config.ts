import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.pokemondb.net",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/1",
      },
    ]
  },
}

export default nextConfig
