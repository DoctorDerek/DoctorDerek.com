import { vi } from "vitest"

vi.mock("@rive-app/react-canvas", () => ({
  useRive: () => ({ RiveComponent: () => null }),
}))

vi.mock("@fullpage/react-fullpage", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}))
