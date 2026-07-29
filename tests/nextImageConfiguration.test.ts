import { describe, expect, it } from "vitest"
import nextConfig from "@/next.config"

describe("Next image configuration", () => {
  it("limits Vercel transformations to the rendered Pokémon artwork sizes", () => {
    expect(nextConfig.images?.deviceSizes).toEqual([192])
    expect(nextConfig.images?.formats).toEqual(["image/webp"])
    expect(nextConfig.images?.imageSizes).toEqual([96])
    expect(nextConfig.images?.localPatterns).toEqual([])
    expect(nextConfig.images?.minimumCacheTTL).toBe(31_536_000)
    expect(nextConfig.images?.qualities).toEqual([75])
    expect(nextConfig.images?.remotePatterns).toEqual([
      {
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname:
          "/PokeAPI/sprites/8dfa3d97e953caaafaafd4963eff7621811af08e/sprites/pokemon/other/official-artwork/**",
        protocol: "https",
        search: "",
      },
    ])
  })
})
