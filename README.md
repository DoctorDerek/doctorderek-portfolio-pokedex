# Pokédex

[![Production](https://img.shields.io/website?url=https%3A%2F%2Fportfolio-pokedex.doctorderek.com%2F&up_message=live&down_message=offline&label=production&logo=vercel&logoColor=white)](https://portfolio-pokedex.doctorderek.com/) [![Codecov](https://codecov.io/gh/DoctorDerek/doctorderek-portfolio-pokedex/graph/badge.svg)](https://app.codecov.io/gh/DoctorDerek/doctorderek-portfolio-pokedex) [![ESLint, Vitest, and XState](https://github.com/DoctorDerek/doctorderek-portfolio-pokedex/actions/workflows/eslint-vitest-xstate.yml/badge.svg)](https://github.com/DoctorDerek/doctorderek-portfolio-pokedex/actions/workflows/eslint-vitest-xstate.yml) [![Playwright](https://github.com/DoctorDerek/doctorderek-portfolio-pokedex/actions/workflows/playwright.yml/badge.svg)](https://github.com/DoctorDerek/doctorderek-portfolio-pokedex/actions/workflows/playwright.yml)

An unofficial, non-commercial parody and GraphQL portfolio demo that turns a 1,025-entry Pokémon snapshot into a suspiciously bureaucratic little field guide. The interface presents a touch-friendly mobile dossier and expands into the project’s compact catalog-and-details layout on larger screens.

[Open the live demo](https://portfolio-pokedex.doctorderek.com/)

## What It Demonstrates

- 1,025 statically generated Pokémon detail routes using the Next.js App Router
- On-demand GraphQL search against the public [PokéAPI GraphQL endpoint](https://graphql.pokeapi.co/)
- Contextual catalog windows with active-selection semantics and progressive local expansion on scroll
- Pokémon statistics including classification, types, dimensions, abilities, and six base stats
- Mobile-first responsive layouts, visible keyboard focus, and semantic navigation state
- Motion-aware interaction feedback with reduced-motion safeguards
- Strict TypeScript, generated GraphQL models, optimized remote images, and reproducible pnpm installs

## Stack

- Next.js 16, React 19, and the App Router
- TypeScript 6 and Tailwind CSS 4
- GraphQL, GraphQL Code Generator, and TanStack Query 5
- Vitest, Testing Library, MSW, Playwright, ESLint, and Prettier

## Architecture and Performance

- All 1,025 dossier routes are generated from a checked-in snapshot, so route navigation and catalog filtering do not wait on the public API.
- Progressive catalog expansion reveals local rows without visible pagination. GraphQL research runs only after an explicit submission, caps responses at 100 entries, and reuses identical TanStack Query results for 30 minutes.
- The image pipeline accepts one canonical artwork path, emits only 96 px and 192 px WebP candidates at quality 75, and gives each transformation a one-year cache lifetime.

## Mobile Web Lighthouse Measurements

GitHub Actions waits for the merged commit’s matching Vercel Production deployment, validates its generated URL as HTTPS on a `vercel.app` hostname, and then runs five standard mobile Lighthouse measurements against [portfolio-pokedex.doctorderek.com](https://portfolio-pokedex.doctorderek.com/). Every completed run must remain on that canonical Production origin. The badges and linked HTML report publish the run with the median Performance score.

[![Mobile Web Lighthouse Performance](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fdoctorderek.github.io%2Fdoctorderek-portfolio-pokedex%2Flighthouse-results.json&query=%24.performance&label=performance&suffix=%2F100&logo=lighthouse&logoColor=white&color=informational)](https://doctorderek.github.io/doctorderek-portfolio-pokedex/) [![Mobile Web Lighthouse Accessibility](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fdoctorderek.github.io%2Fdoctorderek-portfolio-pokedex%2Flighthouse-results.json&query=%24.accessibility&label=accessibility&suffix=%2F100&logo=lighthouse&logoColor=white&color=informational)](https://doctorderek.github.io/doctorderek-portfolio-pokedex/) [![Mobile Web Lighthouse Best Practices](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fdoctorderek.github.io%2Fdoctorderek-portfolio-pokedex%2Flighthouse-results.json&query=%24.bestPractices&label=best%20practices&suffix=%2F100&logo=lighthouse&logoColor=white&color=informational)](https://doctorderek.github.io/doctorderek-portfolio-pokedex/) [![Mobile Web Lighthouse SEO](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fdoctorderek.github.io%2Fdoctorderek-portfolio-pokedex%2Flighthouse-results.json&query=%24.seo&label=SEO&suffix=%2F100&logo=lighthouse&logoColor=white&color=informational)](https://doctorderek.github.io/doctorderek-portfolio-pokedex/)

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
pnpm test:xstate-diff
pnpm exec playwright test
pnpm build
pnpm audit --prod
```

Vitest, Testing Library, and MSW cover the TanStack Query provider, generated GraphQL success and failure behavior, build-time query variables, catalog selection and progressive range state, and the selected Pokémon statistics without contacting the live API. Pull requests also publish an advisory static XState v5 state-machine diff visualization. Playwright exercises mobile containment, touch-target sizing, route navigation, selected-state semantics, motion preferences, and the desktop split layout without relying on test-only selectors.

## License and Parody Notice

The source code is provided under the all-rights-reserved terms in [LICENSE.txt](LICENSE.txt).

This is an unofficial, non-commercial parody project created as a software-engineering and GraphQL portfolio demonstration. It is not affiliated with or endorsed by Nintendo, The Pokémon Company, or their affiliates. Pokémon names, characters, imagery, and trademarks belong to their respective owners.
