import { useSyncExternalStore } from "react"

const SERVER_VIEWPORT_SIZE = "0:0"

const getViewportSizeSnapshot = () =>
  `${window.innerWidth}:${window.innerHeight}`

const subscribeToViewportSize = (onViewportSizeChange: () => void) => {
  window.addEventListener("resize", onViewportSizeChange)
  return () => window.removeEventListener("resize", onViewportSizeChange)
}

export default function useViewportSize() {
  const viewportSize = useSyncExternalStore(
    subscribeToViewportSize,
    getViewportSizeSnapshot,
    () => SERVER_VIEWPORT_SIZE,
  )
  const [width, height] = viewportSize.split(":").map(Number)

  return { height, width }
}
