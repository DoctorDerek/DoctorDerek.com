import "@/styles/globals.css"
import "@/styles/theme-toggle.css"
import type { Metadata, Viewport } from "next"
import SiteThemeProvider from "@/components/SiteThemeProvider"

export const metadata: Metadata = {
  title:
    "Dr. Derek Austin | AI-Native Senior Full-Stack TypeScript Engineer · Next.js + React Native + Expo",
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
