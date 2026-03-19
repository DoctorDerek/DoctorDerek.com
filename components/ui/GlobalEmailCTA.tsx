import React from "react"
import Obfuscate from "react-obfuscate"
import classNames from "@/utils/classNames"

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
    <Obfuscate
      email="derekraustin+doctorderek@gmail.com"
      headers={subject ? { subject } : undefined}
      // @ts-expect-error: react-obfuscate types missing className but passes it natively
      className={className}
      style={{ direction: "ltr" }}
    >
      {children || "derekraustin+doctorderek@gmail.com"}
    </Obfuscate>
  )
}
