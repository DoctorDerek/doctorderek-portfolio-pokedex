import { POKEDEX_WORKSPACE_NAVIGATION_ITEMS } from "@/data/pokedexWorkspace"

export default function PokedexWorkspaceNavigation() {
  const buttonFocusClassName =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"

  return (
    <nav
      aria-label="Pokédex research workspace"
      className="sticky top-2 z-20 rounded-lg border-2 border-gray-700 bg-gray-900/95 p-2 shadow-xl backdrop-blur md:static md:overflow-visible"
    >
      <ul className="flex flex-wrap gap-2 sm:grid sm:grid-cols-3 sm:flex-nowrap">
        {POKEDEX_WORKSPACE_NAVIGATION_ITEMS.map(({ id, label }) => (
          <li key={id} className="min-w-0">
            <a
              href={`#${id}`}
              className={`flex min-h-12 min-w-0 items-center justify-center rounded-md border-2 border-gray-600 px-2 text-center text-xs leading-tight font-bold whitespace-nowrap text-gray-100 hover:border-yellow-400 hover:bg-gray-700 hover:text-yellow-300 motion-safe:transition-colors motion-safe:duration-150 sm:text-sm ${buttonFocusClassName}`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
