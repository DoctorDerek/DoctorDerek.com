import cx from "classix"
import ThemeToggleArtwork from "@/components/ui/ThemeToggleArtwork"

export default function ThemeToggle({
  isDarkTheme,
  onToggle,
}: {
  isDarkTheme: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-label={
        isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
      }
      className={cx(
        "inline-flex cursor-pointer rounded-full border-0 bg-transparent p-0",
        isDarkTheme ? "theme-toggle--dark" : "theme-toggle--light",
      )}
      onClick={onToggle}
    >
      <ThemeToggleArtwork />
    </button>
  )
}
