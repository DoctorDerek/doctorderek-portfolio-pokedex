import { vi } from "vitest"

const EMPTY_DOM_RECT = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  toJSON: () => ({}),
  top: 0,
  width: 0,
  x: 0,
  y: 0,
} satisfies DOMRectReadOnly

class ControllableIntersectionObserver implements IntersectionObserver {
  readonly root: Document | Element | null
  readonly rootMargin: string
  readonly scrollMargin = "0px"
  readonly thresholds: ReadonlyArray<number>
  private readonly callback: IntersectionObserverCallback
  private readonly observedElements = new Set<Element>()
  private disconnected = false

  constructor(
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {},
  ) {
    this.callback = callback
    this.root = options.root ?? null
    this.rootMargin = options.rootMargin ?? "0px"
    this.thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold ?? 0]
    intersectionObserverInstances.push(this)
  }

  disconnect() {
    this.disconnected = true
    this.observedElements.clear()
  }

  observe(target: Element) {
    this.observedElements.add(target)
  }

  takeRecords() {
    return []
  }

  unobserve(target: Element) {
    this.observedElements.delete(target)
  }

  triggerObservedIntersections() {
    if (this.disconnected) return

    this.callback(
      [...this.observedElements].map((target) => ({
        boundingClientRect: EMPTY_DOM_RECT,
        intersectionRatio: 1,
        intersectionRect: EMPTY_DOM_RECT,
        isIntersecting: true,
        rootBounds: null,
        target,
        time: 0,
      })),
      this,
    )
  }

  isActive() {
    return !this.disconnected
  }
}

const intersectionObserverInstances: ControllableIntersectionObserver[] = []

export function installIntersectionObserverMock() {
  intersectionObserverInstances.length = 0
  vi.stubGlobal("IntersectionObserver", ControllableIntersectionObserver)
}

export function restoreIntersectionObserverMock() {
  vi.unstubAllGlobals()
  intersectionObserverInstances.length = 0
}

export function triggerLatestIntersectionObserver() {
  const activeObserver = intersectionObserverInstances.findLast((observer) =>
    observer.isActive(),
  )

  if (!activeObserver)
    throw new Error("No active IntersectionObserver is available.")

  activeObserver.triggerObservedIntersections()
}
