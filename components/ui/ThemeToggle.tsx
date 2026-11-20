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
      aria-pressed={isDarkTheme}
      aria-label={
        isDarkTheme ? "Switch to light theme" : "Switch to dark theme"
      }
      className="group/theme inline-flex cursor-pointer rounded-full border-0 bg-transparent p-0"
      onClick={onToggle}
    >
      <ThemeToggleArtwork />
    </button>
  )
}
