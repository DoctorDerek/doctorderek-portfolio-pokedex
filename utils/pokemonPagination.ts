const POKEMON_PAGE_SIZE = 10

export const MAX_POKEMON_NUMBER = 151

export function calculatePokemonCount({ id }: { id: string }) {
  return (
    POKEMON_PAGE_SIZE * (Math.floor((Number(id) - 1) / POKEMON_PAGE_SIZE) + 1)
  )
}

export function calculateCurrentPage({ id }: { id: string }) {
  return calculatePokemonCount({ id }) / POKEMON_PAGE_SIZE
}

export const MAX_PAGE_NUMBER = calculateCurrentPage({
  id: String(MAX_POKEMON_NUMBER),
})

export function getCatalogPageHref({ pageNumber }: { pageNumber: number }) {
  return `/${(pageNumber - 1) * POKEMON_PAGE_SIZE + 1}`
}

export function getVisibleCatalogPageNumbers({
  currentPageNumber,
}: {
  currentPageNumber: number
}) {
  if (currentPageNumber === 1) return [1, 2, 3, 4]
  if (currentPageNumber === MAX_PAGE_NUMBER)
    return [
      MAX_PAGE_NUMBER - 3,
      MAX_PAGE_NUMBER - 2,
      MAX_PAGE_NUMBER - 1,
      MAX_PAGE_NUMBER,
    ]
  if (currentPageNumber < MAX_PAGE_NUMBER / 2)
    return [
      currentPageNumber - 1,
      currentPageNumber,
      currentPageNumber + 1,
      currentPageNumber + 2,
    ]
  return [
    currentPageNumber - 2,
    currentPageNumber - 1,
    currentPageNumber,
    currentPageNumber + 1,
  ]
}
