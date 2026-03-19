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
    <div className={classNames("cursor-pointer", className)}>
      <Obfuscate
        email="derekraustin+doctorderek@gmail.com"
        headers={subject ? { subject } : undefined}
      >
        {children || "derekraustin+doctorderek@gmail.com"}
      </Obfuscate>
    </div>
  )
}
