import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import { useEffect, useRef, useState } from "react"
import SiteSettings from "@/components/SiteSettings"
import Logo from "@/components/ui/Logo"
import SocialLinks from "@/components/ui/SocialLinks"
import classNames from "@/utils/classNames"

const navigation = [
  { name: "About", anchor: "about" },
  { name: "Experience", anchor: "experience" },
  { name: "Testimonials", anchor: "testimonials" },
  { name: "Portfolio", anchor: "portfolio" },
  { name: "Blog", anchor: "blog" },
  { name: "Contact", anchor: "contact" },
]

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navElementRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const closeSidebar = () => {
    setSidebarOpen(false)
    menuButtonRef.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    if (!sidebarOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar()
      }
    }

    window.addEventListener("keydown", handleEscape, true)
    const focusFirstNavLink = () => {
      navElementRef.current
        ?.querySelector<HTMLAnchorElement>("a")
        ?.focus({ preventScroll: true })
    }
    const requestId = window.requestAnimationFrame(focusFirstNavLink)

    return () => {
      window.cancelAnimationFrame(requestId)
      window.removeEventListener("keydown", handleEscape, true)
    }
  }, [sidebarOpen])

  return (
    <div className="h-[7dvh]">
      <div className="bg-site-surface-soft sticky top-0 z-40 flex h-full shadow-xs backdrop-blur-md sm:gap-x-6 sm:px-6">
        <div className="flex h-full w-full items-center justify-between">
          <div className="flex items-center pl-3">
            <Logo className="ml-2 h-8 w-32" />
          </div>
          <button
            type="button"
            aria-controls="site-navigation"
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            className="bg-site-surface-hover text-site-foreground ml-auto px-3.5 py-2 backdrop-blur-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            ref={menuButtonRef}
          >
            {sidebarOpen ? (
              <XMarkIcon
                className="text-site-foreground h-6 w-6"
                aria-hidden="true"
              />
            ) : (
              <Bars3Icon
                className="text-site-foreground h-6 w-6"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>

      <div
        className={classNames(
          "pointer-events-none fixed inset-x-0 top-[7dvh] z-30 flex h-[calc(100svh-7dvh)] md:h-[calc(100dvh-7dvh)]",
          sidebarOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        data-testid="site-navigation-overlay"
      >
        <div className="relative flex w-full flex-col overflow-hidden">
          <div
            className={classNames(
              "bg-site-surface-soft/70 absolute inset-0 backdrop-blur-sm",
              sidebarOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0",
            )}
            data-testid="site-navigation-backdrop"
            onPointerDown={closeSidebar}
            onClick={closeSidebar}
          />
          <nav
            id="site-navigation"
            ref={navElementRef}
            inert={!sidebarOpen ? true : undefined}
            className={classNames(
              "bg-site-surface relative z-10 flex h-full min-h-0 w-11/12 flex-col overflow-hidden rounded-tr-3xl duration-500 md:w-full md:flex-row md:overflow-hidden",
              sidebarOpen
                ? "pointer-events-auto translate-x-0"
                : "pointer-events-none -translate-x-full",
            )}
          >
            <div className="border-site-border bg-site-surface text-site-foreground flex min-h-0 w-full touch-pan-y flex-col content-between overflow-y-auto rounded-tr-2xl border pb-6 pl-5 backdrop-blur-xl md:w-3/4">
              <ul role="list" className="pt-8">
                {navigation.map((item) => (
                  <li className="hover:text-site-foreground" key={item.name}>
                    <a
                      href={`#${item.anchor}`}
                      className="md:restora-bold ease-spring-bouncy hover:text-site-foreground block py-2 text-5xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 md:p-1 md:pr-12 md:text-end md:text-7xl lg:text-8xl"
                      onClick={closeSidebar}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-6 pr-5 pb-6">
                <SiteSettings />
                <div
                  role="group"
                  aria-label="Social links"
                  className="w-full md:hidden"
                >
                  <SocialLinks
                    fill="currentColor"
                    containerClasses="text-site-foreground flex w-full items-center justify-between"
                    linkClasses="site-focus-contrast flex items-center justify-center rounded-md p-1"
                    labelClasses="sr-only"
                    showLabels={true}
                  />
                </div>
              </div>
            </div>
            <div className="mx-auto my-auto hidden flex-col justify-between gap-y-4 md:flex">
              <SocialLinks
                fill="#F38B57"
                containerClasses="flex flex-col gap-y-4"
                linkClasses="mb-2 block"
              />
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
