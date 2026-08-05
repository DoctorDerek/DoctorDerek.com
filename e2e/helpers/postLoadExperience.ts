import { expect, type Page } from "@playwright/test"
import {
  DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS,
  RIVE_START_DELAY_MILLISECONDS,
} from "@/constants/STARTUP_TIMING"

type PostLoadBoundaryMilliseconds =
  | typeof DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS
  | typeof RIVE_START_DELAY_MILLISECONDS

declare global {
  interface Window {
    __browserIdleCallbackCount: number
    __postLoadBoundaryCallbackCount: (delayMilliseconds: number) => number
    __releaseBrowserIdleCallbacks: () => void
    __releasePostLoadBoundaryCallbacks: (delayMilliseconds: number) => void
  }
}

export const installPostLoadExperienceController = async (page: Page) => {
  await page.addInitScript(
    ({ deferredTypographyDelayMilliseconds, riveStartDelayMilliseconds }) => {
      const controlledPostLoadDelays = new Set([
        deferredTypographyDelayMilliseconds,
        riveStartDelayMilliseconds,
      ])
      const postLoadBoundaryCallbacks = new Map<
        number,
        { callback: () => void; delayMilliseconds: number }
      >()
      const browserIdleCallbacks = new Map<number, IdleRequestCallback>()
      const nativeClearTimeout = window.clearTimeout.bind(window)
      const nativeSetTimeout = window.setTimeout.bind(window)
      const nativeCancelIdleCallback = window.cancelIdleCallback?.bind(window)
      let nextPostLoadBoundaryCallbackId = -1
      let nextBrowserIdleCallbackId = -1_000

      window.setTimeout = ((
        handler: TimerHandler,
        timeout?: number,
        ...arguments_: unknown[]
      ) => {
        if (
          timeout !== undefined &&
          controlledPostLoadDelays.has(timeout) &&
          typeof handler === "function"
        ) {
          const postLoadBoundaryCallbackId = nextPostLoadBoundaryCallbackId
          nextPostLoadBoundaryCallbackId -= 1
          postLoadBoundaryCallbacks.set(postLoadBoundaryCallbackId, {
            callback: () => handler(...arguments_),
            delayMilliseconds: timeout,
          })
          return postLoadBoundaryCallbackId
        }

        return nativeSetTimeout(handler, timeout, ...arguments_)
      }) as typeof window.setTimeout
      window.clearTimeout = ((timeoutId?: number) => {
        if (
          timeoutId !== undefined &&
          postLoadBoundaryCallbacks.delete(timeoutId)
        )
          return

        nativeClearTimeout(timeoutId)
      }) as typeof window.clearTimeout
      window.requestIdleCallback = ((callback: IdleRequestCallback) => {
        const browserIdleCallbackId = nextBrowserIdleCallbackId
        nextBrowserIdleCallbackId -= 1
        browserIdleCallbacks.set(browserIdleCallbackId, callback)
        return browserIdleCallbackId
      }) as typeof window.requestIdleCallback
      window.cancelIdleCallback = ((browserIdleCallbackId: number) => {
        if (browserIdleCallbacks.delete(browserIdleCallbackId)) return

        nativeCancelIdleCallback?.(browserIdleCallbackId)
      }) as typeof window.cancelIdleCallback

      Object.defineProperty(window, "__releasePostLoadBoundaryCallbacks", {
        configurable: true,
        value: (delayMilliseconds: number) => {
          const scheduledBoundaryCallbacks = [
            ...postLoadBoundaryCallbacks.entries(),
          ].filter(
            ([, scheduledCallback]) =>
              scheduledCallback.delayMilliseconds === delayMilliseconds,
          )
          scheduledBoundaryCallbacks.forEach(
            ([callbackId, scheduledCallback]) => {
              postLoadBoundaryCallbacks.delete(callbackId)
              scheduledCallback.callback()
            },
          )
        },
      })
      Object.defineProperty(window, "__postLoadBoundaryCallbackCount", {
        configurable: true,
        value: (delayMilliseconds: number) =>
          [...postLoadBoundaryCallbacks.values()].filter(
            (scheduledCallback) =>
              scheduledCallback.delayMilliseconds === delayMilliseconds,
          ).length,
      })
      Object.defineProperty(window, "__releaseBrowserIdleCallbacks", {
        configurable: true,
        value: () => {
          const scheduledBrowserIdleCallbacks = [
            ...browserIdleCallbacks.values(),
          ]
          browserIdleCallbacks.clear()
          scheduledBrowserIdleCallbacks.forEach((callback) =>
            callback({
              didTimeout: false,
              timeRemaining: () => 50,
            }),
          )
        },
      })
      Object.defineProperty(window, "__browserIdleCallbackCount", {
        configurable: true,
        get: () => browserIdleCallbacks.size,
      })
    },
    {
      deferredTypographyDelayMilliseconds:
        DEFERRED_TYPOGRAPHY_DELAY_MILLISECONDS,
      riveStartDelayMilliseconds: RIVE_START_DELAY_MILLISECONDS,
    },
  )
}

export const completePostLoadBoundary = (
  page: Page,
  delayMilliseconds: PostLoadBoundaryMilliseconds,
) =>
  page.evaluate(
    (expectedDelayMilliseconds) =>
      window.__releasePostLoadBoundaryCallbacks(expectedDelayMilliseconds),
    delayMilliseconds,
  )

export const waitForPostLoadBoundary = (
  page: Page,
  delayMilliseconds: PostLoadBoundaryMilliseconds,
) =>
  expect
    .poll(() =>
      page.evaluate(
        (expectedDelayMilliseconds) =>
          window.__postLoadBoundaryCallbackCount(expectedDelayMilliseconds),
        delayMilliseconds,
      ),
    )
    .toBeGreaterThan(0)

export const completeBrowserIdleCallback = (page: Page) =>
  page.evaluate(() => window.__releaseBrowserIdleCallbacks())

export const waitForBrowserIdleCallback = (page: Page) =>
  expect
    .poll(() => page.evaluate(() => window.__browserIdleCallbackCount))
    .toBeGreaterThan(0)
