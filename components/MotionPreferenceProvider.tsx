"use client"

import { MotionConfig } from "motion/react"
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react"

const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)"

type MotionPreferenceContextValue = {
  shouldReduceMotion: boolean
}

const MotionPreferenceContext = createContext<
  MotionPreferenceContextValue | undefined
>(undefined)

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
  const contextValue = useContext(MotionPreferenceContext)
  if (!contextValue)
    throw new Error("Motion preference must be used within its provider.")
  return contextValue
}

export default function MotionPreferenceProvider({
  children,
}: {
  children: ReactNode
}) {
  const shouldReduceMotion = useSyncExternalStore(
    subscribeToSystemReducedMotion,
    getSystemReducedMotionSnapshot,
    () => false,
  )

  return (
    <MotionPreferenceContext.Provider
      value={{
        shouldReduceMotion,
      }}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </MotionPreferenceContext.Provider>
  )
}
