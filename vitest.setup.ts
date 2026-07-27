import { cleanup } from "@testing-library/react"
import { afterAll, afterEach, beforeAll, vi } from "vitest"
import "@testing-library/jest-dom/vitest"
import { pokemonApiMockServer } from "@/tests/mocks/server"

beforeAll(() => {
  pokemonApiMockServer.listen({ onUnhandledRequest: "error" })
})

afterEach(() => {
  cleanup()
  pokemonApiMockServer.resetHandlers()
})

afterAll(() => {
  pokemonApiMockServer.close()
})

/**
 * ONE-TIME EXCEPTION TO NO CODE COMMENT RULE:
 * Required mock for Happy-DOM/JSDOM to prevent crashes when next-themes
 * evaluates media queries.
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
