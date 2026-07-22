"use client"

import { ThemeProvider } from "next-themes"

export default function SiteThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
