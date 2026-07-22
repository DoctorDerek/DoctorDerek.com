"use client"

import {
  useMotionPreference,
  type MotionPreference,
} from "@/components/MotionPreferenceProvider"

const MOTION_PREFERENCE_DESCRIPTIONS: Record<MotionPreference, string> = {
  system: "Follows your device’s reduced-motion setting.",
  reduce: "Pauses decorative motion and uses instant transitions.",
  full: "Allows the site’s complete animation experience.",
}

export default function MotionSettings() {
  const { motionPreference, setMotionPreference } = useMotionPreference()

  return (
    <div className="mt-6 max-w-sm">
      <label
        htmlFor="motion-preference"
        className="block text-sm font-semibold text-white"
      >
        Motion
      </label>
      <select
        id="motion-preference"
        value={motionPreference}
        aria-describedby="motion-preference-description"
        className="mt-2 w-full rounded-lg border border-white/30 bg-[#171126] px-3 py-2 text-base text-white focus-visible:ring-2 focus-visible:ring-[#FFE366]"
        onChange={(event) =>
          setMotionPreference(event.currentTarget.value as MotionPreference)
        }
      >
        <option value="system">Use device setting</option>
        <option value="reduce">Reduce motion</option>
        <option value="full">Allow full motion</option>
      </select>
      <p
        id="motion-preference-description"
        className="mt-2 text-sm leading-5 text-white/80"
      >
        {MOTION_PREFERENCE_DESCRIPTIONS[motionPreference]}
      </p>
    </div>
  )
}
