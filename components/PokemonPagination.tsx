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
    <div
      className={classNames(
        "bottom-0 flex w-full items-center justify-between bg-gray-900 p-4 text-xs",
        currentPageNumber === MAX_PAGE_NUMBER ? "absolute" : "sticky",
      )}
    >
      <div className="flex space-x-2">
        {visiblePageNumbers.map((pageNumber) => (
          <PaginationLink
            key={`page${pageNumber}`}
            paddingX="px-2"
            href={getCatalogPageHref({ pageNumber })}
            currentPage={currentPageNumber === pageNumber}
            text={String(pageNumber)}
          />
        ))}
      </div>
      <div className="flex space-x-2">
        <PaginationLink
          paddingX="px-3"
          href={getCatalogPageHref({
            pageNumber: currentPageNumber === 1 ? 1 : currentPageNumber - 1,
          })}
          text="Prev"
        />
        <PaginationLink
          paddingX="px-3"
          href={getCatalogPageHref({
            pageNumber:
              currentPageNumber === MAX_PAGE_NUMBER
                ? MAX_PAGE_NUMBER
                : currentPageNumber + 1,
          })}
          text="Next"
        />
      </div>
    </div>
  )
}

function PaginationLink({
  paddingX,
  href,
  currentPage,
  text,
}: {
  paddingX: "px-2" | "px-3"
  href: string
  currentPage?: boolean
  text: string
}) {
  return (
    <Link href={href}>
      <div
        className={classNames(
          "flex flex-col content-center items-center rounded-md border-2 border-solid py-1",
          paddingX,
          currentPage
            ? "border-yellow-400 bg-gray-700"
            : "border-transparent bg-gray-600 hover:bg-gray-700",
        )}
      >
        {text}
      </div>
    </Link>
  )
}
