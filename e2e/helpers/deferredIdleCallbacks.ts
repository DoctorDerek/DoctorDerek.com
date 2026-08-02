import { expect, type Page } from "@playwright/test"

declare global {
  interface Window {
    __deferredIdleCallbackCount: number
    __releaseDeferredIdleCallbacks: () => void
  }
}

export const installDeferredIdleCallbackController = (page: Page) =>
  page.addInitScript(() => {
    const idleCallbacks = new Map<number, IdleRequestCallback>()
    let nextIdleCallbackId = 1

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
  })

export const releaseDeferredIdleCallbacks = (page: Page) =>
  page.evaluate(() => window.__releaseDeferredIdleCallbacks())

export const waitForDeferredIdleCallback = (page: Page) =>
  expect
    .poll(() => page.evaluate(() => window.__deferredIdleCallbackCount))
    .toBeGreaterThan(0)
