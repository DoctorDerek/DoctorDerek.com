import { GlobalStateContext } from "@/machines/globalMachine"
import LogoAlternative from "@/images/Logo Alternative-cropped.svg"
import LogoCropped from "@/images/Logo-cropped.svg"

type LogoProps = {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  const isAlternative = GlobalStateContext.useSelector((state) =>
    state.matches({ logo: "alternative" }),
  )
  const send = GlobalStateContext.useActorRef().send

  return (
    <div className={`perspective ${className}`} style={{ perspective: "1000px" }}>
      <div
        className="cursor-pointer h-full w-full"
        onClick={(e) => {
          e.preventDefault()
          send({ type: "TOGGLE_LOGO" })
        }}
      >
        <div
          className="wrapper relative h-full w-full"
          style={{
            transform: isAlternative ? "rotateY(0deg)" : "rotateY(180deg)",
            transition: "transform 0.8s ease-out",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="front h-full w-full"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <LogoAlternative className="h-full w-full object-contain" />
          </div>
          <div
            className="back absolute left-0 top-0 h-full w-full"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <LogoCropped className="h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}
