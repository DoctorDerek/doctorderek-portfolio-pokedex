import type { NextConfig } from "next"

const POKEMON_ARTWORK_IMAGE_SIZES = [32, 64, 96, 128]
const POKEMON_ARTWORK_MINIMUM_CACHE_TTL_SECONDS = 2_678_400

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    deviceSizes: [192],
    formats: ["image/webp"],
    imageSizes: POKEMON_ARTWORK_IMAGE_SIZES,
    localPatterns: [],
    minimumCacheTTL: POKEMON_ARTWORK_MINIMUM_CACHE_TTL_SECONDS,
    qualities: [75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname:
          "/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/**",
        search: "",
      },
    ],
  },
}

export default nextConfig
