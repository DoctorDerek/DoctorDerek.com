"use client"

import ReactConfetti from "react-confetti"
import { Toaster } from "react-hot-toast"
import useViewportSize from "@/hooks/useViewportSize"

const MAPACHITO_VIVID_CONFETTI_COLORS = [
  "#008b8b",
  "#9c0052",
  "#008ec1",
  "#ff4500",
  "#790fc5",
  "#008f39",
]

export default function EndOfSiteCelebration({
  isConfettiActive,
  onConfettiComplete,
}: {
  isConfettiActive: boolean
  onConfettiComplete: () => void
}) {
  const { height, width } = useViewportSize()

  return (
    <>
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
      {isConfettiActive && (
        <ReactConfetti
          aria-hidden="true"
          className="end-of-site-confetti"
          colors={MAPACHITO_VIVID_CONFETTI_COLORS}
          height={height}
          numberOfPieces={240}
          onConfettiComplete={onConfettiComplete}
          recycle={false}
          style={{ position: "fixed", zIndex: 20 }}
          width={width}
        />
      )}
    </>
  )
}
