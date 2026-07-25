"use client"

import dynamic from "next/dynamic"

const ToggleDarkMode = dynamic(() => import("@/components/ToggleDarkMode"), {
  ssr: false,
})

export default function SiteSettings() {
  return (
    <div className="max-w-sm">
      <ToggleDarkMode />
    </div>
  )
}
