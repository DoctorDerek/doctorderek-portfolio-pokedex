import { describe, expect, it } from "vitest"
import type { PokedexSnapshotQuery } from "@/graphql/pokeapi.generated"
import {
  createPokedexArtifacts,
  EXPECTED_POKEMON_COUNT,
} from "@/scripts/createPokedexArtifacts.mjs"

function createPokemonSnapshotEntry(
  id: number,
): PokedexSnapshotQuery["pokemon"][number] {
  return {
    base_experience: 64,
    height: 7,
    id,
    name: `pokemon-${id}`,
    pokemon_species_id: id,
    pokemonabilities: [
      {
        ability: { name: "static-charge" },
        is_hidden: false,
      },
    ],
    pokemonspecy: {
      base_happiness: 70,
      capture_rate: 45,
      generation: { name: "generation-ix" },
      id,
      is_legendary: false,
      is_mythical: false,
      pokemoncolor: { name: "electric-blue" },
      pokemonhabitat: null,
      pokemonshape: { name: "quadruped" },
      pokemonspeciesnames: [
        {
          genus: "Fixture Pokémon",
          name: `Pokémon ${id}`,
        },
      ],
    },
    pokemonstats: [
      { base_stat: 45, stat: { name: "hp" } },
      { base_stat: 49, stat: { name: "attack" } },
      { base_stat: 49, stat: { name: "defense" } },
      { base_stat: 65, stat: { name: "special-attack" } },
      { base_stat: 65, stat: { name: "special-defense" } },
      { base_stat: 45, stat: { name: "speed" } },
    ],
    pokemontypes: [{ type: { name: "electric" } }],
    weight: 69,
  }
}

function createPokedexSnapshot(): PokedexSnapshotQuery {
  return {
    pokemon: Array.from({ length: EXPECTED_POKEMON_COUNT }, (_, index) =>
      createPokemonSnapshotEntry(index + 1),
    ),
    pokemonspecies_aggregate: {
      aggregate: { count: EXPECTED_POKEMON_COUNT },
    },
  }
}

describe("Pokédex data artifact generation", () => {
  it("normalizes one complete national Pokédex into deterministic artifacts", () => {
    const { catalog, dossiers } = createPokedexArtifacts(
      createPokedexSnapshot(),
    )

    expect(catalog).toHaveLength(EXPECTED_POKEMON_COUNT)
    expect(dossiers).toHaveLength(EXPECTED_POKEMON_COUNT)
    expect(catalog[0]).toEqual({
      baseStatTotal: 318,
      generation: "Generation IX",
      id: 1,
      imageUrl:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      name: "Pokémon 1",
      number: "0001",
      slug: "pokemon-1",
      types: ["Electric"],
    })
    expect(catalog.at(-1)?.number).toBe("1025")
    expect(dossiers[0]).toMatchObject({
      abilities: [{ isHidden: false, name: "Static Charge" }],
      baseExperience: 64,
      baseHappiness: 70,
      baseStats: {
        attack: 49,
        defense: 49,
        hp: 45,
        specialAttack: 65,
        specialDefense: 65,
        speed: 45,
      },
      captureRate: 45,
      category: "Fixture Pokémon",
      color: "Electric Blue",
      habitat: null,
      heightInMeters: 0.7,
      shape: "Quadruped",
      weightInKilograms: 6.9,
    })
    expect(catalog[0]).not.toHaveProperty("abilities")
  })

  it("rejects an aggregate count that does not match the snapshot contract", () => {
    const snapshot = createPokedexSnapshot()
    snapshot.pokemonspecies_aggregate.aggregate = {
      count: EXPECTED_POKEMON_COUNT - 1,
    }

    expect(() => createPokedexArtifacts(snapshot)).toThrow(
      `Expected ${EXPECTED_POKEMON_COUNT} Pokémon species but received ${EXPECTED_POKEMON_COUNT - 1}.`,
    )
  })

  it("rejects a truncated default Pokémon result", () => {
    const snapshot = createPokedexSnapshot()
    snapshot.pokemon.pop()

    expect(() => createPokedexArtifacts(snapshot)).toThrow(
      `Expected ${EXPECTED_POKEMON_COUNT} default Pokémon but received ${EXPECTED_POKEMON_COUNT - 1}.`,
    )
  })

  it("rejects duplicate canonical identifiers", () => {
    const snapshot = createPokedexSnapshot()
    snapshot.pokemon[1] = createPokemonSnapshotEntry(1)

    expect(() => createPokedexArtifacts(snapshot)).toThrow(
      "PokéAPI returned duplicate canonical Pokémon identifiers.",
    )
  })

  it("rejects incomplete canonical base stats", () => {
    const snapshot = createPokedexSnapshot()
    snapshot.pokemon[0].pokemonstats = snapshot.pokemon[0].pokemonstats.filter(
      ({ stat }) => stat?.name !== "speed",
    )

    expect(() => createPokedexArtifacts(snapshot)).toThrow(
      "Pokémon pokemon-1 is missing its speed stat.",
    )
  })

  it.each([
    {
      expectedError: "Pokémon pokemon-1 is missing canonical species data.",
      mutate: (snapshot: PokedexSnapshotQuery) => {
        snapshot.pokemon[0].pokemonspecy = null
      },
    },
    {
      expectedError:
        "Pokémon pokemon-1 does not map directly to canonical species 1.",
      mutate: (snapshot: PokedexSnapshotQuery) => {
        snapshot.pokemon[0].id = EXPECTED_POKEMON_COUNT + 1
      },
    },
    {
      expectedError: "Pokémon pokemon-1 is missing its English species name.",
      mutate: (snapshot: PokedexSnapshotQuery) => {
        const species = snapshot.pokemon[0].pokemonspecy
        if (species) species.pokemonspeciesnames = []
      },
    },
    {
      expectedError: "Pokémon pokemon-1 has a duplicate hp stat.",
      mutate: (snapshot: PokedexSnapshotQuery) => {
        snapshot.pokemon[0].pokemonstats.push({
          base_stat: 45,
          stat: { name: "hp" },
        })
      },
    },
    {
      expectedError: "Pokémon pokemon-1 is missing its debut generation.",
      mutate: (snapshot: PokedexSnapshotQuery) => {
        const species = snapshot.pokemon[0].pokemonspecy
        if (species) species.generation = null
      },
    },
    {
      expectedError: "Pokémon pokemon-1 has an unnamed ability.",
      mutate: (snapshot: PokedexSnapshotQuery) => {
        snapshot.pokemon[0].pokemonabilities[0].ability = null
      },
    },
    {
      expectedError: "Pokémon pokemon-1 has an unnamed type.",
      mutate: (snapshot: PokedexSnapshotQuery) => {
        snapshot.pokemon[0].pokemontypes[0].type = null
      },
    },
  ])(
    "rejects malformed canonical data: $expectedError",
    ({ expectedError, mutate }) => {
      const snapshot = createPokedexSnapshot()
      mutate(snapshot)

      expect(() => createPokedexArtifacts(snapshot)).toThrow(expectedError)
    },
  )

  it("rejects canonical Pokémon returned outside national order", () => {
    const snapshot = createPokedexSnapshot()
    ;[snapshot.pokemon[0], snapshot.pokemon[1]] = [
      snapshot.pokemon[1],
      snapshot.pokemon[0],
    ]

    expect(() => createPokedexArtifacts(snapshot)).toThrow(
      "PokéAPI did not return one continuous national Pokédex.",
    )
  })
})
