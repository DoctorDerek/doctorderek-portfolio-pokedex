import { useQuery } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import ApplicationProviders from "@/app/providers"

function PokemonQueryConsumer({
  queryFunction,
}: {
  queryFunction: () => Promise<string>
}) {
  const { data, error, isPending } = useQuery({
    queryKey: ["application-provider-test"],
    queryFn: queryFunction,
    retry: false,
  })

  if (isPending) return <p>Loading Pokémon…</p>
  if (error instanceof Error) return <p role="alert">{error.message}</p>

  return <p>{data}</p>
}

describe("ApplicationProviders", () => {
  it("provides TanStack Query state to application consumers", async () => {
    const queryFunction = vi.fn().mockResolvedValue("Bulbasaur")

    render(
      <ApplicationProviders>
        <PokemonQueryConsumer queryFunction={queryFunction} />
      </ApplicationProviders>,
    )

    expect(screen.getByText("Loading Pokémon…")).toBeInTheDocument()
    expect(await screen.findByText("Bulbasaur")).toBeInTheDocument()
    expect(queryFunction).toHaveBeenCalledOnce()
  })

  it("surfaces query failures through the shared provider", async () => {
    const queryFunction = vi
      .fn()
      .mockRejectedValue(new Error("Pokémon registry unavailable."))

    render(
      <ApplicationProviders>
        <PokemonQueryConsumer queryFunction={queryFunction} />
      </ApplicationProviders>,
    )

    expect(screen.getByText("Loading Pokémon…")).toBeInTheDocument()
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Pokémon registry unavailable.",
    )
    expect(queryFunction).toHaveBeenCalledOnce()
  })
})
