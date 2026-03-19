import React from "react"
import { Email } from "react-obfuscate-email"

type GlobalEmailCTAProps = {
  subject?: string
  className?: string
  children?: React.ReactNode
}

export default function GlobalEmailCTA({
  subject,
  className,
  children,
}: GlobalEmailCTAProps) {
  return (
    <Email
      email="derekraustin+doctorderek@gmail.com"
      subject={subject}
      className={className}
    >
      {children || "derekraustin+doctorderek@gmail.com"}
    </Email>
  )
}
