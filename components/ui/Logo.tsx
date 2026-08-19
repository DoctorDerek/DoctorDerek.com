import FlipPreview from "@/components/ui/FlipPreview"
import SpringRotation from "@/components/ui/SpringRotation"
import {
  FLIP_ACTIVATION_ROTATION_DEGREES,
  LOGO_CONTROL_ACCESSIBLE_NAMES,
} from "@/constants/INTERACTIONS"
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
  const logoFlipCount = GlobalStateContext.useSelector(
    (state) => state.context.logoFlipCount,
  )
  const send = GlobalStateContext.useActorRef().send

  return (
    <FlipPreview
      accessibleName={
        isAlternative
          ? LOGO_CONTROL_ACCESSIBLE_NAMES.showAlternative
          : LOGO_CONTROL_ACCESSIBLE_NAMES.showPrimary
      }
      containerClassName={classNames("site-logo", className)}
      className="h-full w-full"
      isPressed={!isAlternative}
      onActivate={() => send({ type: "TOGGLE_LOGO" })}
    >
      <SpringRotation
        className="wrapper relative h-full w-full"
        rotationDegrees={logoFlipCount * FLIP_ACTIVATION_ROTATION_DEGREES}
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
            transform: `rotateY(${FLIP_ACTIVATION_ROTATION_DEGREES}deg)`,
          }}
        >
          <LogoSecondary className="h-full w-full object-contain" />
        </div>
      </SpringRotation>
    </FlipPreview>
  )
}
