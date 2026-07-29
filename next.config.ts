import type { NextConfig } from "next"
import { POKEMON_ARTWORK_REPOSITORY_PATH } from "./data/pokemonArtwork.ts"
import { POKEMON_DOSSIER_ROUTE_PREFIX } from "./data/pokemonRoutes.ts"

const POKEMON_ARTWORK_IMAGE_SIZES = [96]
const POKEMON_ARTWORK_MINIMUM_CACHE_TTL_SECONDS = 31_536_000

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:id(\\d+)",
        destination: `${POKEMON_DOSSIER_ROUTE_PREFIX}/:id`,
        permanent: true,
      },
    ]
  },
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
        pathname: `${POKEMON_ARTWORK_REPOSITORY_PATH}/*.png`,
        search: "",
      },
    ],
  },
}

export default nextConfig
