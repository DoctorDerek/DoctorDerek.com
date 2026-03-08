import { useState } from "react"
import LogoAlternative from "@/images/Logo Alternative-cropped.svg"
import LogoCropped from "@/images/Logo-cropped.svg"
import MedLrgLogo from "@/images/medLrgLogo.svg"

type LogoProps = {
  className?: string
  variant?: "alternative" | "medLrg" | "toggleable"
}

export default function Logo({ className, variant = "alternative" }: LogoProps) {
  const [useAlternative, setUseAlternative] = useState(true)

  if (variant === "medLrg") {
    return <MedLrgLogo className={className} />
  }
  
  if (variant === "toggleable") {
    return (
      <div 
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault()
          setUseAlternative(!useAlternative)
        }}
      >
        {useAlternative ? (
          <LogoAlternative className={className} />
        ) : (
          <LogoCropped className={className} />
        )}
      </div>
    )
  }

  return <LogoAlternative className={className} />
}
