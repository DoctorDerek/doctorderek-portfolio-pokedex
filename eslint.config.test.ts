import { ESLint } from "eslint"
import { beforeAll, describe, expect, it } from "vitest"
import packageManifest from "@/package.json"

const eslint = new ESLint({ cwd: process.cwd() })

beforeAll(async () => {
  await eslint.calculateConfigForFile("app/page.tsx")
})

describe("TypeScript lint configuration", () => {
  it.each([
    "app/page.tsx",
    "app/pokemon/[id]/page.tsx",
    "components/PokemonCatalog.tsx",
    "data/pokemonSearch.ts",
    "hooks/useProgressivePokemonCatalog.ts",
    "types/pokemon.ts",
    "utils/pokemonCatalog.ts",
    "graphql/pokeapi.generated.ts",
    "tests/PokemonDetailsPanel.test.tsx",
    "tests/createPokedexArtifacts.test.ts",
    "tests/pokemonSearch.generated.ts",
    "e2e/pokedex.spec.ts",
    "scripts/createPokedexArtifacts.mts",
    "scripts/lintProbe.cts",
    "codegen.ts",
    "eslint.config.ts",
    "eslint.config.test.ts",
    "next.config.ts",
    "playwright.config.ts",
    "prettier.config.ts",
    "vitest.config.ts",
    "vitest.setup.ts",
  ])(
    "reports unsafe types in %s without changing advisory severity",
    async (filePath) => {
      const [result] = await eslint.lintText("export type UnsafeValue = any", {
        filePath,
      })

      expect(result.messages).toEqual([
        expect.objectContaining({
          ruleId: "@typescript-eslint/no-explicit-any",
          severity: 1,
        }),
      ])
    },
  )

  it("allows the generator-owned metadata type only in its output file", async () => {
    const [result] = await eslint.lintText(
      "export type DocumentMetadata = Record<string, any>",
      { filePath: "graphql/pokemonSearch.generated.ts" },
    )

    expect(result.messages).toEqual([])
    expect(
      await eslint.isPathIgnored("graphql/pokemonSearch.generated.ts"),
    ).toBe(false)
  })

  it.each([
    "components/PokemonCatalog.tsx",
    "tests/PokemonDetailsPanel.test.tsx",
    "e2e/pokedex.spec.ts",
    "codegen.ts",
    "graphql/pokemonSearch.generated.ts",
  ])("still reports unused imports in %s", async (filePath) => {
    const [result] = await eslint.lintText(
      'import { useRef } from "react"\nexport const value = 1',
      { filePath },
    )

    expect(result.messages).toEqual([
      expect.objectContaining({
        ruleId: "@typescript-eslint/no-unused-vars",
        severity: 1,
      }),
    ])
  })

  it("retains React Hooks rules alongside TypeScript rules", async () => {
    const [result] = await eslint.lintText(
      'import { useState } from "react"; export default function Example({ active }: { active: boolean }) { if (active) useState(0); return null }',
      { filePath: "components/PokemonCatalog.tsx" },
    )

    expect(result.messages).toEqual([
      expect.objectContaining({ ruleId: "react-hooks/rules-of-hooks" }),
    ])
  })

  it("accepts valid typed JSX", async () => {
    const [result] = await eslint.lintText(
      "export default function Example({ label }: { label: string }) { return <span>{label}</span> }",
      { filePath: "components/PokemonCatalog.tsx" },
    )

    expect(result.messages).toEqual([])
  })

  it("keeps fatal parsing failures as errors", async () => {
    const [result] = await eslint.lintText("export const value =", {
      filePath: "data/pokemonSearch.ts",
    })

    expect(result.messages).toEqual([
      expect.objectContaining({ fatal: true, severity: 2 }),
    ])
  })
})

describe("lint scope boundaries", () => {
  it("keeps the lint command rooted at the repository", () => {
    expect(packageManifest.scripts.lint).toBe("eslint .")
  })

  it.each([
    ".next/types/fixture.ts",
    "next-env.d.ts",
    "out/fixture.ts",
    "coverage/fixture.ts",
    "playwright-report/fixture.ts",
    "test-results/fixture.ts",
    "repomix-temp.private.ts",
    "reference/private.ts",
  ])("keeps generated or private file %s ignored", async (filePath) => {
    expect(await eslint.isPathIgnored(filePath)).toBe(true)
  })

  it("does not apply TypeScript import rules to JavaScript tooling", async () => {
    const [result] = await eslint.lintText('require("node:fs")', {
      filePath: "lintProbe.cjs",
    })

    expect(result.messages).toEqual([])
  })
})
