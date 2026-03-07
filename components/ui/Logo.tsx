import LogoAlternative from "@/images/Logo Alternative.svg"
import MedLrgLogo from "@/images/medLrgLogo.svg"

type LogoProps = {
  className?: string
  variant?: "alternative" | "medLrg"
}

export default function Logo({ className, variant = "alternative" }: LogoProps) {
  if (variant === "medLrg") {
    return <MedLrgLogo className={className} />
  }
  
  return <LogoAlternative className={className} />
}
