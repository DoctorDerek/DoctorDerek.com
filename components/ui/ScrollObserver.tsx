"use client"

import React, { useEffect } from "react"

export default function ScrollObserver({
  children,
  anchors,
}: {
  children: React.ReactNode
  anchors: string[]
}) {
  useEffect(() => {
    const sections = document.querySelectorAll(".scroll-section")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active")
            const id = entry.target.id
            if (window.history.replaceState) {
              window.history.replaceState(null, "", `#${id}`)
            }
          } else {
            entry.target.classList.remove("active")
          }
        })
      },
      { threshold: 0.15 },
    )

    sections.forEach((sec) => observer.observe(sec))

    return () => {
      observer.disconnect()
    }
  }, [anchors])

  return (
    <div className="w-full">
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null
        return (
          <section
            id={anchors[index] || `section-${index}`}
            key={index}
            className="scroll-section relative w-full"
          >
            {child}
          </section>
        )
      })}
    </div>
  )
}
