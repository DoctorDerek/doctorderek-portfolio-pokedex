import { permanentRedirect } from "next/navigation"
import { getPokemonDossierRoute } from "@/data/pokemonRoutes"

export default function HomePage() {
  permanentRedirect(getPokemonDossierRoute(1))
}
