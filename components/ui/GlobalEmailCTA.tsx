"use client"

import { Email } from "react-obfuscate-email"
import { AI_CONSULTANCY_PITCH } from "@/constants/SITE_CONTENT"

type GlobalEmailCTAProps = {
  accessibleName?: string
  className?: string
  children?: React.ReactNode
}

export default function GlobalEmailCTA({
  accessibleName,
  className,
  children,
}: GlobalEmailCTAProps) {
  return (
    <Email
      email="derekraustin+doctorderek@gmail.com"
      subject={AI_CONSULTANCY_PITCH.emailSubject}
      className={className}
      aria-label={accessibleName}
    >
      {children || "derekraustin+doctorderek@gmail.com"}
    </Email>
  )
}
