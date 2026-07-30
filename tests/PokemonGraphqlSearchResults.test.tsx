import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import PokemonGraphqlSearchResults from "@/components/PokemonGraphqlSearchResults"
import type { PokemonSearchResultFragment } from "@/graphql/pokemonSearch.generated"

describe("PokemonGraphqlSearchResults", () => {
  it("renders safe fallbacks when the API omits optional metadata", () => {
    const pokemon: PokemonSearchResultFragment = {
      base_experience: null,
      id: 122,
      name: "mr-mime",
      pokemonspecy: null,
      pokemontypes: [{ type: null }],
    }

    render(
      <PokemonGraphqlSearchResults
        state={{ pokemons: [pokemon], status: "success" }}
      />,
    )

    expect(screen.getByRole("link", { name: /Mr Mime/ })).toHaveAttribute(
      "href",
      "/pokemon/122",
    )
    expect(screen.getByText("—")).toBeVisible()
    expect(screen.getByText("Unknown")).toBeVisible()
    expect(screen.getByText("Generation unknown")).toBeVisible()
    expect(screen.getByText("Standard")).toBeVisible()
  })

  it("renders localized names, generations, classifications, and known types", () => {
    const pokemon: PokemonSearchResultFragment = {
      base_experience: 172,
      id: 122,
      name: "mr-mime",
      pokemonspecy: {
        generation: { name: "generation-i" },
        is_legendary: true,
        is_mythical: true,
        pokemonspeciesnames: [],
      },
      pokemontypes: [{ type: { name: "psychic" } }, { type: null }],
    }

    render(
      <PokemonGraphqlSearchResults
        state={{ pokemons: [pokemon], status: "success" }}
      />,
    )

    expect(screen.getByRole("heading", { name: "Mr Mime" })).toBeVisible()
    expect(screen.getByText("Generation I")).toBeVisible()
    expect(screen.getByText("Legendary · Mythical")).toBeVisible()
    expect(screen.getByText("Psychic")).toBeVisible()
  })
})
