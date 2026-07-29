import PokedexPageContent from "@/components/PokedexPageContent"
import { getPokedexStaticParameters } from "@/data/pokemonCatalog"
import { getPokemonDossier } from "@/data/pokemonDossiers.server"

interface PokedexPageProps {
  params: Promise<{ id: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getPokedexStaticParameters()
}

export default async function PokedexPage({ params }: PokedexPageProps) {
  const { id } = await params
  const pokemon = getPokemonDossier({ id })

  return <PokedexPageContent id={id} pokemon={pokemon} />
}
