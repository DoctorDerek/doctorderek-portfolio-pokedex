import type { Metadata } from "next"
import PokedexPageContent from "@/components/PokedexPageContent"
import { getPokedexStaticParameters } from "@/data/pokemonCatalog"
import { getPokemonDossier } from "@/data/pokemonDossiers.server"
import { getPokemonDossierRoute } from "@/data/pokemonRoutes"

interface PokedexPageProps {
  params: Promise<{ id: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getPokedexStaticParameters()
}

export async function generateMetadata({
  params,
}: PokedexPageProps): Promise<Metadata> {
  const { id } = await params
  const pokemon = getPokemonDossier({ id })

  if (!pokemon) return {}

  return {
    alternates: {
      canonical: getPokemonDossierRoute(pokemon.id),
    },
    description: `${pokemon.name} (#${pokemon.number}) dossier with types, abilities, dimensions, and base stats in an unofficial Pokédex parody.`,
    title: `${pokemon.name} #${pokemon.number}`,
  }
}

export default async function PokedexPage({ params }: PokedexPageProps) {
  const { id } = await params
  const pokemon = getPokemonDossier({ id })

  return <PokedexPageContent id={id} pokemon={pokemon} />
}
