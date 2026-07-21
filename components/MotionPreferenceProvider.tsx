"use client"

import { MotionConfig } from "motion/react"
import {
  createContext,
  useContext,
  useLayoutEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react"

const MOTION_PREFERENCE_STORAGE_KEY = "doctorderek-motion-preference"
const MOTION_PREFERENCE_CHANGE_EVENT = "doctorderek-motion-change"
const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)"

export type MotionPreference = "system" | "reduce" | "full"

type MotionPreferenceContextValue = {
  motionPreference: MotionPreference
  setMotionPreference: (motionPreference: MotionPreference) => void
  shouldReduceMotion: boolean
}

const MotionPreferenceContext = createContext<
  MotionPreferenceContextValue | undefined
>(undefined)

const isMotionPreference = (
  storedMotionPreference: string | null,
): storedMotionPreference is MotionPreference =>
  storedMotionPreference === "system" ||
  storedMotionPreference === "reduce" ||
  storedMotionPreference === "full"

const getMotionPreferenceSnapshot = () => {
  const storedMotionPreference = window.localStorage.getItem(
    MOTION_PREFERENCE_STORAGE_KEY,
  )
  return isMotionPreference(storedMotionPreference)
    ? storedMotionPreference
    : "system"
}

const subscribeToMotionPreference = (onMotionPreferenceChange: () => void) => {
  window.addEventListener("storage", onMotionPreferenceChange)
  window.addEventListener(
    MOTION_PREFERENCE_CHANGE_EVENT,
    onMotionPreferenceChange,
  )

  return () => {
    window.removeEventListener("storage", onMotionPreferenceChange)
    window.removeEventListener(
      MOTION_PREFERENCE_CHANGE_EVENT,
      onMotionPreferenceChange,
    )
  }
}

const getSystemReducedMotionSnapshot = () =>
  window.matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches

const subscribeToSystemReducedMotion = (
  onSystemReducedMotionChange: () => void,
) => {
  const reducedMotionMediaQuery = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY)
  reducedMotionMediaQuery.addEventListener(
    "change",
    onSystemReducedMotionChange,
  )

  return () =>
    reducedMotionMediaQuery.removeEventListener(
      "change",
      onSystemReducedMotionChange,
    )
}

export const useMotionPreference = () => {
  const motionPreference = useContext(MotionPreferenceContext)
  if (!motionPreference)
    throw new Error("Motion preference must be used within its provider.")
  return motionPreference
}

export default function MotionPreferenceProvider({
  children,
}: {
  children: ReactNode
}) {
  const motionPreference = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreferenceSnapshot,
    () => "system",
  )
  const systemShouldReduceMotion = useSyncExternalStore(
    subscribeToSystemReducedMotion,
    getSystemReducedMotionSnapshot,
    () => false,
  )
  const shouldReduceMotion =
    motionPreference === "reduce" ||
    (motionPreference === "system" && systemShouldReduceMotion)
  const reducedMotion =
    motionPreference === "system"
      ? "user"
      : shouldReduceMotion
        ? "always"
        : "never"

  useLayoutEffect(() => {
    document.documentElement.dataset.motionPreference = motionPreference
    return () => {
      delete document.documentElement.dataset.motionPreference
    }
  }, [motionPreference])

  const setMotionPreference = (nextMotionPreference: MotionPreference) => {
    window.localStorage.setItem(
      MOTION_PREFERENCE_STORAGE_KEY,
      nextMotionPreference,
    )
    window.dispatchEvent(new Event(MOTION_PREFERENCE_CHANGE_EVENT))
  }

  return (
    <MotionPreferenceContext.Provider
      value={{
        motionPreference,
        setMotionPreference,
        shouldReduceMotion,
      }}
    >
      <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
    </MotionPreferenceContext.Provider>
  )
}
