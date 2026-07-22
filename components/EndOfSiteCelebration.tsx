"use client"

import { Toaster } from "react-hot-toast"

export default function EndOfSiteCelebration() {
  return (
    <Toaster
      position="bottom-center"
      containerStyle={{ pointerEvents: "none", zIndex: 20 }}
      toastOptions={{
        duration: 5000,
        style: {
          background: "var(--site-surface-strong)",
          border: "1px solid var(--site-border)",
          color: "var(--site-foreground)",
        },
      }}
    />
  )
}
