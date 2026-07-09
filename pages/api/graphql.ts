import type { NextApiRequest, NextApiResponse } from "next"
import { GRAPHQL_API_ENDPOINT } from "@/utils/fetchPokemonApi"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  try {
    const response = await fetch(GRAPHQL_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" })
  }
}
