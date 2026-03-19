export default function scrollToSection(anchor: string): void {
  const el = document.getElementById(anchor)
  if (el) {
    el.scrollIntoView({ behavior: "smooth" })
  }
}
