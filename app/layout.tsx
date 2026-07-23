import "@/styles/globals.css"
import "@/styles/theme-toggle.css"
import type { Metadata, Viewport } from "next"
import SiteThemeProvider from "@/components/SiteThemeProvider"

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <SiteThemeProvider>{children}</SiteThemeProvider>
      </body>
    </html>
  )
}
