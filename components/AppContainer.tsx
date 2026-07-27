import Link from "next/link"
import type { ReactNode } from "react"
import ThemeControlSlot from "@/components/ThemeControlSlot"
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
      <header className="grid min-h-12 w-full grid-cols-1 items-center gap-y-2 px-4 py-3 text-center sm:grid-cols-[1fr_auto_1fr] sm:gap-x-2">
        <div className="hidden justify-self-start sm:block" />
        <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
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
        </div>
        <div className="justify-self-center sm:justify-self-end">
          <ThemeControlSlot />
        </div>
        <p className="text-muted col-span-full text-sm leading-tight sm:col-span-3">
          Unofficial National Pokédex research registry: non-commercial
          portfolio exploration of GraphQL, progressive catalog behavior, and
          accessible interaction.
        </p>
      </header>
      <main className="flex w-full flex-1 items-start justify-center px-3 pb-3 sm:px-6 md:pb-6">
        {children}
      </main>
    </div>
  )
}
