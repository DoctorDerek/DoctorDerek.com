import { expect, type Page } from "@playwright/test"
import { POST_LOAD_QUIET_PERIOD_MILLISECONDS } from "@/constants/STARTUP_TIMING"

declare global {
  interface Window {
    __postLoadQuietPeriodCallbackCount: number
    __releasePostLoadQuietPeriodCallbacks: () => void
  }
}

export const installPostLoadQuietPeriodController = async (page: Page) => {
  await page.addInitScript((postLoadQuietPeriodMilliseconds) => {
    const postLoadQuietPeriodCallbacks = new Map<number, () => void>()
    const nativeClearTimeout = window.clearTimeout.bind(window)
    const nativeSetTimeout = window.setTimeout.bind(window)
    let nextPostLoadQuietPeriodCallbackId = -1

    window.setTimeout = ((
      handler: TimerHandler,
      timeout?: number,
      ...arguments_: unknown[]
    ) => {
      if (
        timeout === postLoadQuietPeriodMilliseconds &&
        typeof handler === "function"
      ) {
        const quietPeriodCallbackId = nextPostLoadQuietPeriodCallbackId
        nextPostLoadQuietPeriodCallbackId -= 1
        postLoadQuietPeriodCallbacks.set(quietPeriodCallbackId, () =>
          handler(...arguments_),
        )
        return quietPeriodCallbackId
      }

      return nativeSetTimeout(handler, timeout, ...arguments_)
    }) as typeof window.setTimeout
    window.clearTimeout = ((timeoutId?: number) => {
      if (
        timeoutId !== undefined &&
        postLoadQuietPeriodCallbacks.delete(timeoutId)
      )
        return

      nativeClearTimeout(timeoutId)
    }) as typeof window.clearTimeout

    Object.defineProperty(window, "__releasePostLoadQuietPeriodCallbacks", {
      configurable: true,
      value: () => {
        const scheduledQuietPeriodCallbacks = [
          ...postLoadQuietPeriodCallbacks.values(),
        ]
        postLoadQuietPeriodCallbacks.clear()
        scheduledQuietPeriodCallbacks.forEach((callback) => callback())
      },
    })
    Object.defineProperty(window, "__postLoadQuietPeriodCallbackCount", {
      configurable: true,
      get: () => postLoadQuietPeriodCallbacks.size,
    })
  }, POST_LOAD_QUIET_PERIOD_MILLISECONDS)
}

export const completePostLoadQuietPeriod = (page: Page) =>
  page.evaluate(() => window.__releasePostLoadQuietPeriodCallbacks())

export const waitForPostLoadQuietPeriod = (page: Page) =>
  expect
    .poll(() => page.evaluate(() => window.__postLoadQuietPeriodCallbackCount))
    .toBeGreaterThan(0)
