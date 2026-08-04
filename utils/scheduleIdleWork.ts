const REQUIRED_IDLE_WORK_TIMEOUT_MILLISECONDS = 2_500

export default function scheduleIdleWork(callback: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    const idleCallbackId = window.requestIdleCallback(callback, {
      timeout: REQUIRED_IDLE_WORK_TIMEOUT_MILLISECONDS,
    })

    return () => window.cancelIdleCallback(idleCallbackId)
  }

  const animationFrameId = window.requestAnimationFrame(callback)

  return () => window.cancelAnimationFrame(animationFrameId)
}
