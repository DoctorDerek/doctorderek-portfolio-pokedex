import type { NextConfig } from "next"
import { POKEMON_ARTWORK_REPOSITORY_PATH } from "./data/pokemonArtwork.ts"

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
        pathname: `${POKEMON_ARTWORK_REPOSITORY_PATH}/**`,
        search: "",
      },
    ],
  },
}

export default nextConfig
