import { AI_CONSULTANCY_PITCH } from "@/constants/SITE_CONTENT"
import React from "react"
import { Email } from "react-obfuscate-email"

type GlobalEmailCTAProps = {
  className?: string
  children?: React.ReactNode
}

export default function GlobalEmailCTA({
  className,
  children,
}: GlobalEmailCTAProps) {
  return (
    <Email
      email="derekraustin+doctorderek@gmail.com"
      subject={AI_CONSULTANCY_PITCH.emailSubject}
      className={className}
    >
      {children || "derekraustin+doctorderek@gmail.com"}
    </Email>
  )
}
