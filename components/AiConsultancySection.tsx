import SectionHeading from "@/components/ui/SectionHeading"
import { AI_CONSULTANCY_PITCH } from "@/constants/SITE_CONTENT"

export default function AiConsultancySection() {
  return (
    <div className="short-slide:py-3 flex min-h-full w-full items-center justify-center p-4 py-20 md:p-8">
      <div className="ease-spring-bouncy border-site-border bg-site-surface-soft text-site-foreground short-slide:p-4 my-auto flex max-w-4xl translate-y-12 scale-95 flex-col rounded-2xl border p-6 opacity-0 backdrop-blur-md transition-all duration-700 md:p-12 [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
        <SectionHeading className="short-slide:mb-4 mb-8">
          <h2 className="text-4xl font-bold text-balance min-[375px]:text-5xl md:text-6xl">
            {AI_CONSULTANCY_PITCH.header}
          </h2>
        </SectionHeading>
        <p className="short-slide:mb-4 short-slide:text-[clamp(1rem,4.75vw,1.25rem)] short-slide:leading-snug mb-10 text-xl leading-relaxed md:text-2xl">
          {AI_CONSULTANCY_PITCH.body}
        </p>
        <a
          className="ease-spring-bouncy inline-block w-full rounded-tr-3xl bg-[#FFE366] px-6 py-4 text-center text-xl font-bold text-[#311B4D] shadow-xl transition-transform duration-300 [--site-focus:var(--site-focus-contrast)] hover:scale-105 active:scale-95 md:w-max md:px-12 md:py-6 md:text-2xl"
          href="#contact"
        >
          {AI_CONSULTANCY_PITCH.ctaButtonText}
        </a>
        <p className="short-slide:mt-4 short-slide:text-base mt-6 text-lg opacity-90 md:text-xl">
          {AI_CONSULTANCY_PITCH.subtext}
        </p>
      </div>
    </div>
  )
}
