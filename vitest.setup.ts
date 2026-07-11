import { cleanup } from "@testing-library/react"
import { afterEach, vi } from "vitest"
import "@testing-library/jest-dom/vitest"

afterEach(() => {
  cleanup()
})

vi.mock("@rive-app/react-canvas", () => ({
  useRive: () => ({ RiveComponent: () => null }),
}))

vi.mock("@fullpage/react-fullpage", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}))
