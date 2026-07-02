import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title:
    "Dr. Derek Austin | Indie Game Dev, AI Context Engineer, Full-Stack SWE, & Content Creator",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
