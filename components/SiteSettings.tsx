"use client"

import dynamic from "next/dynamic"
import MotionSettings from "@/components/MotionSettings"

const ToggleDarkMode = dynamic(() => import("@/components/ToggleDarkMode"), {
  ssr: false,
})

export default function SiteSettings() {
  return (
    <section aria-labelledby="site-settings-heading" className="max-w-sm">
      <h2 id="site-settings-heading" className="restorabold text-xl text-white">
        Settings
      </h2>
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-white">Appearance</h3>
        <div className="mt-2">
          <ToggleDarkMode />
        </div>
      </div>
      <MotionSettings />
    </section>
  )
}
