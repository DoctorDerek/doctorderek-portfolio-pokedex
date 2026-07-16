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
        "flex h-screen w-screen flex-col items-center justify-center text-white",
        bgColor ? bgColor : "bg-gray-900",
      )}
    >
      <Head>
        <title>Pokédex by @DoctorDerek</title>
      </Head>
      <header className="absolute top-0 w-full px-4 py-2 text-center">
        <Link href="/">Pokédex</Link> by{" "}
        <a href="https://www.doctorderek.com/">@DoctorDerek</a>
      </header>
      <main>{children}</main>
    </div>
  )
}
