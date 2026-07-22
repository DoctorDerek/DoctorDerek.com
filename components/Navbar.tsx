import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useState } from "react"
import MotionSettings from "@/components/MotionSettings"
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

  return (
    <div className="h-[7dvh]">
      <div className="sticky top-0 z-40 flex h-full bg-white/10 shadow-xs backdrop-blur-md sm:gap-x-6 sm:px-6">
        <div className="flex h-full w-full items-center justify-between">
          <div className="flex items-center pl-3">
            <Link href="/" className="flex items-center">
              <Logo className="ml-2 h-8 w-32" />
            </Link>
          </div>
          <button
            type="button"
            aria-controls="site-navigation"
            aria-expanded={sidebarOpen}
            aria-label={
              sidebarOpen
                ? "Close navigation and settings"
                : "Open navigation and settings"
            }
            className="ml-auto bg-white/20 px-3.5 py-2 text-white backdrop-blur-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-30 mt-auto flex h-[90%]">
        <div className="pointer-events-none flex grow flex-col overflow-y-auto overscroll-contain">
          <div className="h-14 md:hidden" />
          <nav
            id="site-navigation"
            inert={!sidebarOpen ? true : undefined}
            className={classNames(
              "flex h-full flex-col rounded-tr-3xl duration-500 md:mt-auto md:h-11/12 md:flex-row",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div
              className={classNames(
                "flex h-full w-11/12 flex-col content-between rounded-tr-2xl border border-white/20 bg-black/40 pl-5 text-white backdrop-blur-xl md:w-3/4",
                sidebarOpen ? "pointer-events-auto" : "pointer-events-none",
              )}
            >
              <ul role="list" className="pt-8">
                {navigation.map((item) => (
                  <li className="hover:text-white" key={item.name}>
                    <a
                      href={`#${item.anchor}`}
                      className="md:restora-bold ease-spring-bouncy block py-2 text-5xl font-semibold transition-all duration-300 hover:scale-105 hover:text-white active:scale-95 md:p-1 md:pr-12 md:text-end md:text-7xl lg:text-8xl"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-6 pr-5 pb-6">
                <MotionSettings />
                <div className="w-10/12 md:hidden">
                  <SocialLinks
                    fill="white"
                    containerClasses="flex flex-col gap-y-4"
                    linkClasses="mb-2 flex items-center gap-x-2 text-xl"
                    showLabels={true}
                  />
                </div>
              </div>
            </div>
            <div
              className={classNames(
                "mx-auto my-auto hidden flex-col justify-between gap-y-4 md:flex",
                sidebarOpen ? "pointer-events-auto" : "pointer-events-none",
              )}
            >
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
