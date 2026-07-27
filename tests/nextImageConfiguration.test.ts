import { describe, expect, it } from "vitest"
import nextConfig from "@/next.config"

describe("Next image configuration", () => {
  it("limits Vercel transformations to the rendered Pokémon artwork sizes", () => {
    expect(nextConfig.images?.deviceSizes).toEqual([192])
    expect(nextConfig.images?.formats).toEqual(["image/webp"])
    expect(nextConfig.images?.imageSizes).toEqual([32, 64, 96, 128])
    expect(nextConfig.images?.localPatterns).toEqual([])
    expect(nextConfig.images?.minimumCacheTTL).toBe(2_678_400)
    expect(nextConfig.images?.qualities).toEqual([75])
    expect(nextConfig.images?.remotePatterns).toEqual([
      {
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname:
          "/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/**",
        protocol: "https",
        search: "",
      },
    ])
  })
})
