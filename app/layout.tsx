import "@/styles/globals.css"
import "@/styles/theme-toggle.css"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import SiteThemeProvider from "@/components/SiteThemeProvider"

const restora = localFont({
  src: [
    {
      path: "../vendor/fonts/restora-1.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../vendor/fonts/restoraextrabold-1.otf",
      weight: "800",
      style: "normal",
    },
  ],
  display: "optional",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
  variable: "--font-restora",
})

const siteTitle =
  "Dr. Derek Austin | AI-Native Senior Full-Stack TypeScript Engineer · Next.js + React Native + Expo"
const siteDescription =
  "AI-native senior full-stack TypeScript and UI/UX engineer Dr. Derek Austin’s portfolio, featuring six live Next.js projects, public source code, CI/CD, and 100% Codecov coverage."

export const metadata: Metadata = {
  metadataBase: new URL("https://www.doctorderek.com/"),
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
      <body className={restora.variable}>
        <SiteThemeProvider>{children}</SiteThemeProvider>
      </body>
    </html>
  )
}
