# Pokédex

An unofficial, non-commercial parody and GraphQL portfolio demo that turns the original 151 Pokémon into a suspiciously bureaucratic little field guide. The interface stacks into a touch-friendly mobile dossier and expands into the project’s original compact catalog-and-details layout on larger screens.

[Open the live demo](https://portfolio-pokedex.doctorderek.com/)

## What It Demonstrates

- 151 statically generated Pokémon detail routes using the Next.js Pages Router
- Build-time GraphQL data fetching from the [community Pokémon GraphQL API](https://graphql-pokemon2.vercel.app/)
- Ten-entry catalog pages with active-selection, previous, next, and numbered navigation
- Pokémon statistics including classification, types, size, combat values, weaknesses, and resistances
- Mobile-first responsive layouts, visible keyboard focus, and semantic navigation state
- Strict TypeScript, generated GraphQL models, optimized remote images, and reproducible pnpm installs

## Stack

- Next.js 16, React 19, and the Pages Router
- TypeScript 6 and Tailwind CSS 4
- GraphQL, GraphQL Code Generator, and TanStack Query 5
- Vitest, Testing Library, MSW, Playwright, ESLint, and Prettier

## Local Development

Use [fnm](https://github.com/Schniz/fnm) for the Node version declared in `.node-version` and [pnpm](https://pnpm.io/) for dependency management.

```bash
fnm use
corepack enable pnpm
pnpm install --frozen-lockfile
pnpm dev
```

The development server is available at [http://localhost:3000](http://localhost:3000).

## Verification

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm test
pnpm test:coverage
pnpm exec playwright test
pnpm build
```

Vitest, Testing Library, and MSW cover the TanStack Query provider, generated GraphQL success and failure behavior, build-time query variables, catalog selection and paging state, and the selected Pokémon statistics without contacting the live API. Playwright exercises mobile containment, touch-target sizing, route navigation, selected-state semantics, and the desktop split layout without relying on test-only selectors.

## Roadmap

- Expand the catalog beyond the original 151 Pokémon using a maintained data source
- Move to the App Router after the data layer is stable
- Deepen the parody-forward visual design with purposeful motion
- Expand Testing Trophy coverage and measured Codecov reporting around future user journeys

## License and Parody Notice

The source code is provided under the all-rights-reserved terms in [LICENSE.txt](LICENSE.txt).

This is an unofficial, non-commercial parody project created as a software-engineering and GraphQL portfolio demonstration. It is not affiliated with or endorsed by Nintendo, The Pokémon Company, or their affiliates. Pokémon names, characters, imagery, and trademarks belong to their respective owners.
