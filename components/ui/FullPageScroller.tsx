"use client"

import React, { useEffect, useState, useRef } from "react"
import classNames from "@/utils/classNames"
import scrollToSection from "@/utils/scrollToSection"

export default function FullPageScroller({
  children,
  anchors,
}: {
  children: React.ReactNode
  anchors: string[]
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const win = window as Window & {
      scrollToSection?: (anchor: string) => void
    }
    // Expose global scroll utility for the Navbar
    win.scrollToSection = (anchor: string) => {
      const el = document.getElementById(anchor)
      if (el && scrollerRef.current) {
        scrollerRef.current.scrollTo({
          top: el.offsetTop,
          behavior: "smooth",
        })
      }
    }

    const sections = document.querySelectorAll(".page-section")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active")
            const id = entry.target.id
            const idx = anchors.indexOf(id)
            if (idx !== -1) {
              setActiveIndex(idx)
              // Cleanly update hash without page jump
              if (window.history.replaceState) {
                window.history.replaceState(null, "", `#${id}`)
              }
            }
          } else {
            entry.target.classList.remove("active")
          }
        })
      },
      { threshold: 0.3 }, // Low threshold triggers .active animation perfectly on entry
    )

    sections.forEach((sec) => observer.observe(sec))

    return () => {
      observer.disconnect()
      delete (window as Window & { scrollToSection?: (anchor: string) => void })
        .scrollToSection
    }
  }, [anchors])

  return (
    <div className="fixed inset-0 z-0">
      <div
        ref={scrollerRef}
        className="h-dvh w-full snap-y snap-mandatory overflow-x-hidden overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollBehavior: "smooth" }}
      >
        {React.Children.map(children, (child, index) => {
          const element = child as React.ReactElement<{
            className?: string
            id?: string
          }>
          if (!React.isValidElement(element)) return null
          return React.cloneElement(element, {
            id: anchors[index] || `section-${index}`,
            className: classNames(
              "page-section relative w-full snap-start snap-always",
              element.props.className,
            ),
          })
        })}
      </div>

      {/* Navigation Dots */}
      <div className="fixed top-1/2 right-4 z-50 flex -translate-y-1/2 flex-col gap-3">
        {anchors.map((anchor, i) => (
          <button
            key={anchor}
            onClick={() => scrollToSection(anchor)}
            className="group relative flex h-4 w-4 items-center justify-center"
            aria-label={`Scroll to ${anchor}`}
          >
            <span
              className={classNames(
                "rounded-full transition-all duration-300",
                activeIndex === i
                  ? "h-3 w-3 bg-white"
                  : "h-2 w-2 bg-white/40 group-hover:bg-white/80",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
