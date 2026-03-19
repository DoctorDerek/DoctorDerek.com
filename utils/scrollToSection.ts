export default function scrollToSection(anchor: string): void {
  const win = window as Window & { scrollToSection?: (a: string) => void }
  if (typeof win.scrollToSection === "function") {
    win.scrollToSection(anchor)
  }
}
