export default function scheduleIdleWork(callback: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    const idleCallbackId = window.requestIdleCallback(callback)

    return () => window.cancelIdleCallback(idleCallbackId)
  }

  const animationFrameId = window.requestAnimationFrame(callback)

  return () => window.cancelAnimationFrame(animationFrameId)
}
