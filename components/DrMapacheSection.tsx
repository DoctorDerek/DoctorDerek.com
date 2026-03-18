import React from "react"
import Tilt from "react-parallax-tilt"

export default function DrMapacheSection() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-8">
      <div className="fp-noscroll flex h-[80vh] w-full max-w-6xl translate-y-12 flex-col items-center justify-center rounded-3xl border-4 border-[#F38B57] bg-black/80 opacity-0 shadow-[0_0_40px_rgba(243,139,87,0.4)] transition-all duration-700 ease-spring-bouncy [.active_&]:translate-y-0 [.active_&]:opacity-100">
        <div className="flex flex-col items-center text-center">
          <Tilt
            className="mb-6 w-max cursor-pointer"
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            perspective={1000}
            scale={1.02}
            transitionSpeed={1000}
          >
            <h2 className="text-5xl font-bold text-white md:text-7xl">
              Dr. Mapache WebGL
            </h2>
          </Tilt>
          <p className="animate-pulse text-2xl font-bold text-[#F38B57]">
            [ WebGL Game Canvas Placeholder ]
          </p>
          <p className="mt-8 text-xl text-white/60">
            (Inputs isolated via .fp-noscroll)
          </p>
        </div>
      </div>
    </div>
  )
}
