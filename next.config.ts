import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname:
          "/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/**",
      },
    ],
  },
}

export default nextConfig
