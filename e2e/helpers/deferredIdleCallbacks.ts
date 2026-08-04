import { expect, type Page } from "@playwright/test"
import { POST_LOAD_QUIET_PERIOD_MILLISECONDS } from "@/constants/STARTUP_TIMING"

declare global {
  interface Window {
    __deferredIdleCallbackCount: number
    __postLoadQuietPeriodCallbackCount: number
    __releaseDeferredIdleCallbacks: () => void
    __releasePostLoadQuietPeriodCallbacks: () => void
  }
}

export const installDeferredIdleCallbackController = async (page: Page) => {
  await page.addInitScript((postLoadQuietPeriodMilliseconds) => {
    const idleCallbacks = new Map<number, IdleRequestCallback>()
    const postLoadQuietPeriodCallbacks = new Map<number, () => void>()
    const nativeClearTimeout = window.clearTimeout.bind(window)
    const nativeSetTimeout = window.setTimeout.bind(window)
    let nextIdleCallbackId = 1
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

    window.requestIdleCallback = (callback) => {
      const idleCallbackId = nextIdleCallbackId
      nextIdleCallbackId += 1
      idleCallbacks.set(idleCallbackId, callback)
      return idleCallbackId
    }
    window.cancelIdleCallback = (idleCallbackId) =>
      idleCallbacks.delete(idleCallbackId)

    Object.defineProperty(window, "__releaseDeferredIdleCallbacks", {
      configurable: true,
      value: () => {
        const scheduledIdleCallbacks = [...idleCallbacks.values()]
        idleCallbacks.clear()
        scheduledIdleCallbacks.forEach((callback) =>
          callback({
            didTimeout: false,
            timeRemaining: () => 50,
          }),
        )
      },
    })
    Object.defineProperty(window, "__deferredIdleCallbackCount", {
      configurable: true,
      get: () => idleCallbacks.size,
    })
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

export const releaseDeferredIdleCallbacks = (page: Page) =>
  page.evaluate(() => window.__releaseDeferredIdleCallbacks())

export const expectNoDeferredIdleCallbacks = (page: Page) =>
  expect
    .poll(() => page.evaluate(() => window.__deferredIdleCallbackCount))
    .toBe(0)

export const waitForDeferredIdleCallback = (page: Page) =>
  expect
    .poll(() => page.evaluate(() => window.__deferredIdleCallbackCount))
    .toBeGreaterThan(0)

export const waitForPostLoadQuietPeriod = (page: Page) =>
  expect
    .poll(() => page.evaluate(() => window.__postLoadQuietPeriodCallbackCount))
    .toBeGreaterThan(0)
