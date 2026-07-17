import Link from "next/link"
import classNames from "@/utils/classNames"
import {
  getCatalogPageHref,
  getVisibleCatalogPageNumbers,
  MAX_PAGE_NUMBER,
} from "@/utils/pokemonPagination"

export default function PokemonPagination({
  currentPageNumber,
}: {
  currentPageNumber: number
}) {
  const visiblePageNumbers = getVisibleCatalogPageNumbers({
    currentPageNumber,
  })

  return (
    <nav
      aria-label="Pokémon catalog pages"
      className="sticky bottom-0 flex w-full flex-wrap items-center justify-between gap-2 bg-gray-900 px-3 py-3 text-xs md:px-4"
    >
      <div className="flex gap-2">
        {visiblePageNumbers.map((pageNumber) => (
          <PaginationLink
            key={`page${pageNumber}`}
            href={getCatalogPageHref({ pageNumber })}
            currentPage={currentPageNumber === pageNumber}
            text={String(pageNumber)}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <PaginationLink
          wide
          href={getCatalogPageHref({
            pageNumber: currentPageNumber === 1 ? 1 : currentPageNumber - 1,
          })}
          text="Prev"
        />
        <PaginationLink
          wide
          href={getCatalogPageHref({
            pageNumber:
              currentPageNumber === MAX_PAGE_NUMBER
                ? MAX_PAGE_NUMBER
                : currentPageNumber + 1,
          })}
          text="Next"
        />
      </div>
    </nav>
  )
}

function PaginationLink({
  href,
  currentPage,
  text,
  wide,
}: {
  href: string
  currentPage?: boolean
  text: string
  wide?: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={currentPage ? "page" : undefined}
      className={classNames(
        "flex min-h-11 items-center justify-center rounded-md border-2 border-solid px-2",
        wide ? "min-w-14" : "min-w-11",
        currentPage
          ? "border-yellow-400 bg-gray-700"
          : "border-transparent bg-gray-600 hover:bg-gray-700",
      )}
    >
      {text}
    </Link>
  )
}
