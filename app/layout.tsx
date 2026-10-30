import "@/styles/globals.css"
import "@/styles/theme-toggle.css"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import SiteThemeProvider from "@/components/SiteThemeProvider"
import {
  RESTORA_DISPLAY_CSS_VARIABLE,
  RESTORA_TEXT_CSS_VARIABLE,
} from "@/constants/TYPOGRAPHY"

const restoraDisplay = localFont({
  src: [
    {
      path: "../vendor/fonts/restoraextrabold-1-webfont.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  display: "swap",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
})

const restoraText = localFont({
  src: [
    {
      path: "../vendor/fonts/restora-1-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../vendor/fonts/restoramedium-1-webfont.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
})

const siteTitle =
  "Dr. Derek Austin | AI-Native Senior Full-Stack TypeScript Engineer · Next.js + React Native + Expo"
const siteDescription =
  "AI-native senior full-stack TypeScript and UI/UX engineer Dr. Derek Austin: seven live Next.js projects with public source and CI/CD."

export const metadata: Metadata = {
  metadataBase: new URL("https://doctorderek.com/"),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "DoctorDerek.com",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
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
      <body
        style={
          {
            [RESTORA_DISPLAY_CSS_VARIABLE]: restoraDisplay.style.fontFamily,
            [RESTORA_TEXT_CSS_VARIABLE]: restoraText.style.fontFamily,
          } as React.CSSProperties
        }
      >
        <SiteThemeProvider>{children}</SiteThemeProvider>
        {process.env.VERCEL_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
