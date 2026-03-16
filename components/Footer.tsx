import { LEGAL_DISCLAIMER } from "@/constants/SITE_CONTENT"

export default function Footer() {
  return (
    <footer className="bg-[#311B4D]/60 p-12 text-white backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-2xl font-bold tracking-wider text-[#FB70AA] uppercase">
            AI Disclosure
          </h3>
          <ul className="space-y-2 text-lg opacity-90">
            {LEGAL_DISCLAIMER.aiDisclosure.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-2xl font-bold tracking-wider text-[#B9E3FF] uppercase">
            Website Disclaimer
          </h3>
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
