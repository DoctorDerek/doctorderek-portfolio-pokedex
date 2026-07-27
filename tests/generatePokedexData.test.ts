import { mkdir, readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { format } from "prettier"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  fetchPokedexSnapshot,
  generatePokedexData,
} from "@/scripts/generatePokedexData.mts"
import { createPokedexArtifacts } from "@/scripts/createPokedexArtifacts.mts"

const generatorMocks = vi.hoisted(() => ({
  createPokedexArtifacts: vi.fn(),
  format: vi.fn(),
  mkdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
}))

vi.mock("node:fs/promises", () => {
  return {
    default: generatorMocks,
    mkdir: generatorMocks.mkdir,
    readFile: generatorMocks.readFile,
    writeFile: generatorMocks.writeFile,
  }
})

vi.mock("prettier", () => ({
  format: generatorMocks.format,
}))

vi.mock("@/scripts/createPokedexArtifacts.mts", () => ({
  createPokedexArtifacts: generatorMocks.createPokedexArtifacts,
  EXPECTED_POKEMON_COUNT: 1_025,
}))

const mockedCreatePokedexArtifacts = vi.mocked(createPokedexArtifacts)
const mockedFormat = vi.mocked(format)
const mockedMkdir = vi.mocked(mkdir)
const mockedReadFile = vi.mocked(readFile)
const mockedWriteFile = vi.mocked(writeFile)

function createGraphqlResponse({
  body,
  ok = true,
  status = 200,
}: {
  body: unknown
  ok?: boolean
  status?: number
}) {
  return {
    json: vi.fn().mockResolvedValue(body),
    ok,
    status,
  } as Response
}

describe("Pokédex data generation", () => {
  beforeEach(() => {
    mockedReadFile.mockResolvedValue("query PokedexSnapshot { pokemon { id } }")
    vi.stubGlobal("fetch", vi.fn())
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it("fetches the bounded snapshot with the checked-in GraphQL document", async () => {
    const snapshot = { pokemon: [] }
    const fetchMock = vi.mocked(globalThis.fetch)
    fetchMock.mockResolvedValue(createGraphqlResponse({ body: { data: snapshot } }))

    await expect(fetchPokedexSnapshot()).resolves.toBe(snapshot)

    expect(mockedReadFile).toHaveBeenCalledWith(expect.any(URL), "utf8")
    expect(fetchMock).toHaveBeenCalledWith(
      "https://graphql.pokeapi.co/v1beta2",
      expect.objectContaining({
        body: expect.stringContaining('"pokemonCount":1025'),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
    )
  })

  it.each([
    {
      body: { data: {} },
      expectedError: "PokéAPI GraphQL request failed with status 503.",
      ok: false,
      status: 503,
    },
    {
      body: null,
      expectedError: "PokéAPI GraphQL returned an invalid response.",
      ok: true,
      status: 200,
    },
    {
      body: { errors: [{ message: "PokéAPI rejected the query." }] },
      expectedError: "PokéAPI rejected the query.",
      ok: true,
      status: 200,
    },
    {
      body: { data: null },
      expectedError: "PokéAPI GraphQL returned no snapshot data.",
      ok: true,
      status: 200,
    },
    {
      body: { errors: [null] },
      expectedError: "PokéAPI GraphQL returned no snapshot data.",
      ok: true,
      status: 200,
    },
    {
      body: { data: {}, errors: [{}] },
      expectedError: undefined,
      ok: true,
      status: 200,
    },
    {
      body: { data: {}, errors: [{ message: 42 }] },
      expectedError: undefined,
      ok: true,
      status: 200,
    },
  ])(
    "processes the snapshot response: $expectedError",
    async ({ body, expectedError, ok, status }) => {
      vi.mocked(globalThis.fetch).mockResolvedValue(
        createGraphqlResponse({ body, ok, status }),
      )

      if (expectedError)
        await expect(fetchPokedexSnapshot()).rejects.toThrow(expectedError)
      else await expect(fetchPokedexSnapshot()).resolves.toEqual({})
    },
  )

  it("formats and writes deterministic artifacts after a valid snapshot", async () => {
    const snapshot = { pokemon: [] }
    const catalog = [{ id: 1 }]
    const dossiers = [{ id: 1 }]
    vi.mocked(globalThis.fetch).mockResolvedValue(
      createGraphqlResponse({ body: { data: snapshot } }),
    )
    mockedCreatePokedexArtifacts.mockReturnValue({
      catalog,
      dossiers,
    } as never)
    mockedFormat
      .mockResolvedValueOnce('[\n  { "id": 1 }\n]\n')
      .mockResolvedValueOnce('[\n  { "id": 1 }\n]\n')

    await generatePokedexData()

    expect(mockedCreatePokedexArtifacts).toHaveBeenCalledWith(snapshot)
    expect(mockedMkdir).toHaveBeenCalledWith(expect.any(URL), {
      recursive: true,
    })
    expect(mockedWriteFile).toHaveBeenCalledTimes(2)
    expect(mockedWriteFile).toHaveBeenCalledWith(
      expect.any(URL),
      '[\n  { "id": 1 }\n]\n',
    )
  })

  it("runs generation when Node executes the script directly", async () => {
    const snapshot = { pokemon: [] }
    const previousProcessArguments = process.argv
    process.argv = [
      process.argv[0],
      resolve("scripts/generatePokedexData.mts"),
    ]
    vi.mocked(globalThis.fetch).mockResolvedValue(
      createGraphqlResponse({ body: { data: snapshot } }),
    )
    mockedCreatePokedexArtifacts.mockReturnValue({
      catalog: [],
      dossiers: [],
    } as never)
    mockedFormat.mockResolvedValue("[]\n")

    try {
      vi.resetModules()
      await import("@/scripts/generatePokedexData.mts")
    } finally {
      process.argv = previousProcessArguments
    }

    expect(mockedWriteFile).toHaveBeenCalledTimes(2)
  })
})
