import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Configure next/image to use the website returned by the GraphQL API:
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
        // Show Pokémon #1 (Bulbasaur) on the homepage route / using rewrites:
        source: "/",
        destination: "/1",
      },
    ]
  },
}

export default nextConfig
