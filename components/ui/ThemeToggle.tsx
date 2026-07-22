import ThemeToggleArtwork from "@/components/ui/ThemeToggleArtwork"
import classNames from "@/utils/classNames"

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
      className={classNames(
        "inline-flex cursor-pointer rounded-full border-0 bg-transparent p-0",
        isDarkTheme ? "theme-toggle--dark" : "theme-toggle--light",
      )}
      onClick={onToggle}
    >
      <ThemeToggleArtwork />
    </button>
  )
}
