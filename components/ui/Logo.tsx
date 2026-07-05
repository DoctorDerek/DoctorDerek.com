import LogoDefault from "@/images/Logo-Default-Landscape.svg"
import LogoSecondary from "@/images/Logo-Secondary-Portrait.svg"
import { GlobalStateContext } from "@/machines/globalMachine"
import classNames from "@/utils/classNames"

type LogoProps = {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  const isAlternative = GlobalStateContext.useSelector((state) =>
    state.matches({ logo: "alternative" }),
  )
  const send = GlobalStateContext.useActorRef().send

  return (
    <div
      className={classNames("perspective", className)}
      style={{ perspective: "1000px" }}
    >
      <div
        className="h-full w-full cursor-pointer transition-transform duration-300 ease-spring-bouncy hover:scale-105 active:scale-95"
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
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <LogoDefault className="h-full w-full object-contain" />
          </div>
          <div
            className="back absolute top-0 left-0 h-full w-full"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <LogoSecondary className="h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}
