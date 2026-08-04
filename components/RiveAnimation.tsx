import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas-lite"
import { useCallback, useRef, useState } from "react"
import { RIVE_ANIMATION_URL } from "@/constants/RIVE_ASSETS"

export default function RiveAnimation({
  onRiveComplete,
}: {
  onRiveComplete: () => void
}) {
  const [hasError, setHasError] = useState(false)
  const hasReportedCompletion = useRef(false)
  const reportRiveComplete = useCallback(() => {
    if (hasReportedCompletion.current) return

    hasReportedCompletion.current = true
    onRiveComplete()
  }, [onRiveComplete])

  const { RiveComponent } = useRive({
    src: RIVE_ANIMATION_URL,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    onStop: reportRiveComplete,
    onLoop: reportRiveComplete,
    onLoadError: () => {
      setHasError(true)
      reportRiveComplete()
    },
  })

  if (hasError)
    return (
      <iframe
        allowFullScreen
        src="https://rive.app/s/0PCnhbxltU_9fMHg94CxVg/embed"
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full border-none bg-transparent"
        style={{ pointerEvents: "none" }}
      />
    )

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full overflow-hidden"
      style={{ pointerEvents: "none" }}
    >
      <RiveComponent
        className="pointer-events-none h-full w-full"
        style={{ pointerEvents: "none" }}
      />
    </div>
  )
}
