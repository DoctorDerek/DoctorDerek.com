import dynamic from "next/dynamic"
import { useState } from "react"

const Rive = dynamic(
  () => import("@rive-app/react-canvas").then((mod) => mod.default),
  { ssr: false },
)

export default function RiveAnimation() {
  const [hasError, setHasError] = useState(false)

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
      <Rive
        src="/animation.riv"
        className="h-full w-full"
        // @ts-expect-error onLoadError is not in the types but exists in the component
        onLoadError={() => setHasError(true)}
      />
    </div>
  )
}
