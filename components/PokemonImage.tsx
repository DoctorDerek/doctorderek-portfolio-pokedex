import Image from "next/image"
import classNames from "@/utils/classNames"

export default function PokemonImage({
  size,
  imageUrl,
  altText,
}: {
  size: "h-8 w-8" | "h-16 w-16"
  imageUrl: string
  altText: string
}) {
  return (
    <div
      className={classNames(
        "relative overflow-hidden rounded-full bg-white",
        size === "h-16 w-16"
          ? "h-16 w-16 border-2 border-solid border-gray-400"
          : "h-8 w-8",
      )}
    >
      <Image
        src={imageUrl}
        fill
        sizes={size === "h-16 w-16" ? "64px" : "32px"}
        alt={altText}
        className="h-full w-full object-contain"
      />
    </div>
  )
}
