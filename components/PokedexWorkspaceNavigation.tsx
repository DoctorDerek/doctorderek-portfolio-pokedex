import { POKEDEX_WORKSPACE_NAVIGATION_ITEMS } from "@/data/pokedexWorkspace"

export default function PokedexWorkspaceNavigation() {
  return (
    <nav
      aria-label="Pokédex research workspace"
      className="shadow-panel sticky top-2 z-20 rounded-lg border-2 border-outline bg-glass p-2 backdrop-blur md:static md:overflow-visible"
    >
      <ul className="flex flex-wrap gap-2 sm:grid sm:grid-cols-3 sm:flex-nowrap">
        {POKEDEX_WORKSPACE_NAVIGATION_ITEMS.map(({ id, label }) => (
          <li key={id} className="min-w-0">
            <a
              href={`#${id}`}
              className="flex min-h-12 min-w-0 items-center justify-center rounded-md border-2 border-outline px-2 text-center text-xs leading-tight font-bold whitespace-nowrap hover:border-brand hover:bg-panel hover:text-brand motion-safe:transition-[background-color,border-color,color,transform] motion-safe:duration-150 motion-safe:hover:-translate-y-px sm:text-sm"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
