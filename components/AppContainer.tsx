import Link from "next/link"
import type { ReactNode } from "react"
import classNames from "@/utils/classNames"

const HEADER_LINK_CLASS_NAME =
  "rounded-sm font-semibold text-yellow-300 underline-offset-4 hover:text-yellow-200 hover:underline motion-safe:transition-colors motion-safe:duration-150"

export default function AppContainer({
  children,
  bgColor,
}: {
  bgColor?: "bg-gray-900" | "bg-gray-600"
  children: ReactNode
}) {
  return (
    <div
      className={classNames(
        "flex min-h-screen w-full flex-col text-white",
        bgColor ? bgColor : "bg-gray-900",
      )}
    >
      <header className="flex min-h-12 w-full flex-wrap items-center justify-center gap-x-1 gap-y-1 px-4 py-3 text-center">
        <Link href="/" className={HEADER_LINK_CLASS_NAME}>
          Pokédex
        </Link>
        <span>by</span>
        <a
          href="https://www.doctorderek.com/"
          className={HEADER_LINK_CLASS_NAME}
        >
          @DoctorDerek
        </a>
      </header>
      <main className="flex w-full flex-1 items-start justify-center px-3 pb-3 sm:px-6 md:items-center md:pb-6">
        {children}
      </main>
    </div>
  )
}
