import { LEGAL_DISCLAIMER } from "@/constants/SITE_CONTENT"
import Tilt from "react-parallax-tilt"

export default function Footer() {
  return (
    <footer className="bg-[#311B4D]/60 p-12 text-white backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl translate-y-8 grid-cols-1 gap-12 opacity-0 transition-all duration-700 ease-spring-soft md:grid-cols-2 [.active_&]:translate-y-0 [.active_&]:opacity-100">
        <div>
          <Tilt
            className="w-max cursor-pointer"
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            perspective={1000}
            scale={1.02}
            transitionSpeed={1000}
          >
            <h3 className="mb-4 text-2xl font-bold tracking-wider text-[#FB70AA] uppercase">
              AI Disclosure
            </h3>
          </Tilt>
          <ul className="space-y-2 text-lg opacity-90">
            {LEGAL_DISCLAIMER.aiDisclosure.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <Tilt
            className="w-max cursor-pointer"
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            perspective={1000}
            scale={1.02}
            transitionSpeed={1000}
          >
            <h3 className="mb-4 text-2xl font-bold tracking-wider text-[#B9E3FF] uppercase">
              Website Disclaimer
            </h3>
          </Tilt>
          <ul className="space-y-2 text-sm opacity-70">
            {LEGAL_DISCLAIMER.websiteDisclaimer.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
