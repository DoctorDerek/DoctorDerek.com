import { useState } from "react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"
import Logo from "@/components/ui/Logo"
import Link from "next/link"
import EmailIcon from "./EmailIcon"
import LinkedinIcon from "./LinkedinIcon"
import GithubIcon from "./GithubIcon"
import MediumIcon from "./MediumIcon"
import BookLinkIcon from "./BookLinkIcon"

const navigation = [
  { name: "About", href: "#", current: true },
  { name: "Experience", href: "#", current: false },
  { name: "Testimonials", href: "#", current: false },
  { name: "Blog", href: "#", current: false },
  { name: "Contact", href: "#", current: false },
]

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-[7vh] md:h-0">
      {/* ======== NAVBAR ======= */}
      <div className="sticky top-0 z-40 flex h-full bg-white/10 backdrop-blur-md shadow-xs sm:gap-x-6 sm:px-6 md:h-screen md:w-14 md:px-0 md:border-r md:border-white/20">
        <div className="flex h-full w-full items-center md:flex-col md:items-stretch">
          <div className="flex items-center pl-3 md:order-2 md:h-[40vh] md:w-full md:pl-0 md:justify-center">
            <Link href="/" className="flex items-center md:h-1/2 md:w-full md:justify-center">
              {/* Displays logo on small devices */}
              <Logo
                variant="alternative"
                className="ml-2 h-auto w-32 md:hidden md:ml-0"
              />
              {/* Displays logo on medium and large devices */}
              <Logo
                variant="medLrg"
                className="hidden h-auto w-12 md:block"
              />
            </Link>
          </div>
          <button
            type="button"
            className="ml-auto bg-white/20 px-3.5 py-2 text-white backdrop-blur-md md:order-1 md:ml-0 md:mt-60 md:py-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <XMarkIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            ) : (
              <Bars3Icon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
        {/* ======== SCROLL INDICATOR ======= */}
      </div>

      <div className="fixed inset-0 mt-auto flex h-[90%]">
        {/* =========== SIDEBAR MOBILE MENU =========== */}
        <div className="flex grow flex-col overflow-y-auto">
          {/* ========= div creates spacing between links and navbar */}
          <div className="h-14 md:hidden" />
          {/* =========== NAVIGATION LINKS ========== */}
          <nav
            className={`md:h-11/12 flex h-full flex-col rounded-tr-3xl duration-500 md:mt-auto md:flex-row ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } `}
          >
            <div className="flex h-full w-11/12 flex-col content-between rounded-tr-2xl bg-black/40 backdrop-blur-xl border border-white/20 pl-5 text-white md:w-3/4">
              <ul role="list" className="pt-8">
                {navigation.map((item) => (
                  <li className="hover:text-white" key={item.name}>
                    <a
                      href={item.href}
                      className={
                        "md:restora-bold block py-2 text-5xl font-semibold md:p-1 md:pr-12 md:text-end md:text-7xl lg:text-8xl"
                      }
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
              {/* Sidebar, displays icon links on small devices */}
              <div className="mt-auto w-10/12 pb-6 md:hidden">
                <div className="flex justify-between">
                  <a href="mailto:derekraustin@gmail.com">
                    <EmailIcon fill="white" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/derek-austin/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedinIcon fill="white" />
                  </a>
                  <a
                    href="https://github.com/DoctorDerek"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon fill="white" />
                  </a>
                  <a
                    href="https://doctorderek.medium.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MediumIcon fill="white" />
                  </a>
                  <a
                    href="https://www.amazon.com/dp/B0BRJDLJ43"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BookLinkIcon fill="white" />
                  </a>
                </div>
              </div>
            </div>
            {/* Displays icons in sidebar on medium and large devices */}
            <div className="mx-auto my-auto hidden flex-col justify-between gap-y-4 md:flex">
              <a className="mb-2 block" href="mailto:derekraustin@gmail.com">
                <EmailIcon fill="#F38B57" />
              </a>
              <a
                className="mb-2 block"
                href="https://www.linkedin.com/in/derek-austin/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedinIcon fill="#F38B57" />
              </a>
              <a
                className="mb-2 block"
                href="https://github.com/DoctorDerek"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon fill="#F38B57" />
              </a>
              <a
                className="mb-2 block"
                href="https://doctorderek.medium.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MediumIcon fill="#F38B57" />
              </a>
              <a
                className="mb-2 block"
                href="https://www.amazon.com/dp/B0BRJDLJ43"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BookLinkIcon fill="#F38B57" />
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
