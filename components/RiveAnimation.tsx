import {
  Alignment,
  Fit,
  Layout,
  RuntimeLoader,
  useRive,
} from "@rive-app/react-canvas-lite"
import { useState } from "react"
import { RIVE_ASSET_URLS } from "@/constants/RIVE_ASSETS"

RuntimeLoader.setWasmUrl(RIVE_ASSET_URLS.runtime)

export default function RiveAnimation({
  onRiveReady,
}: {
  onRiveReady: () => void
}) {
  const [hasError, setHasError] = useState(false)

  const { RiveComponent } = useRive({
    src: RIVE_ASSET_URLS.animation,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    onRiveReady,
    onLoadError: () => {
      setHasError(true)
      onRiveReady()
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
