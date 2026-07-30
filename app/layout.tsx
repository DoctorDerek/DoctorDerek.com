import "@/styles/globals.css"
import "@/styles/theme-toggle.css"
import type { Metadata, Viewport } from "next"
import SiteThemeProvider from "@/components/SiteThemeProvider"

export const metadata: Metadata = {
  title:
    "Dr. Derek Austin | AI-Native Senior Full-Stack TypeScript Engineer · Next.js + React Native + Expo",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
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
