import React, { useState } from "react"
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas"

export default function RiveAnimation() {
  const [hasError, setHasError] = useState(false)

  const { RiveComponent } = useRive({
    src: "/animation.riv",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    onLoadError: () => setHasError(true),
  })

  if (hasError) {
    return (
      <iframe
        allowFullScreen
        src="https://rive.app/s/0PCnhbxltU_9fMHg94CxVg/embed"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      />
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 h-full w-full">
      <RiveComponent className="h-full w-full" />
    </div>
  )
}
