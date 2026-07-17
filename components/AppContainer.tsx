import Head from "next/head"
import Link from "next/link"
import React from "react"
import classNames from "@/utils/classNames"

export default function AppContainer({
  children,
  bgColor,
}: {
  bgColor?: "bg-gray-900" | "bg-gray-600"
  children: React.ReactNode
}) {
  return (
    <div
      className={classNames(
        "flex min-h-screen w-full flex-col text-white",
        bgColor ? bgColor : "bg-gray-900",
      )}
    >
      <Head>
        <title>Pokédex by @DoctorDerek</title>
      </Head>
      <header className="flex min-h-12 w-full items-center justify-center px-4 py-3 text-center">
        <Link
          href="/"
          className="rounded-sm font-semibold text-yellow-300 underline-offset-4 hover:underline"
        >
          Pokédex
        </Link>{" "}
        by{" "}
        <a
          href="https://www.doctorderek.com/"
          className="rounded-sm font-semibold text-yellow-300 underline-offset-4 hover:underline"
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
