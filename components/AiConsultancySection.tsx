import GlobalEmailCTA from "@/components/ui/GlobalEmailCTA"
import SectionHeading from "@/components/ui/SectionHeading"
import { AI_CONSULTANCY_PITCH } from "@/constants/SITE_CONTENT"

export default function AiConsultancySection() {
  return (
    <div className="flex min-h-full w-full items-center p-4 py-20 md:p-8">
      <div className="ease-spring-bouncy my-auto flex max-w-4xl translate-y-12 scale-95 flex-col rounded-2xl border border-white/20 bg-white/10 p-6 text-white opacity-0 backdrop-blur-md transition-all duration-700 md:p-12 [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
        <SectionHeading className="mb-8">
          <h2 className="text-4xl font-bold text-balance min-[375px]:text-5xl md:text-6xl">
            {AI_CONSULTANCY_PITCH.header}
          </h2>
        </SectionHeading>
        <p className="mb-10 text-xl leading-relaxed md:text-2xl">
          {AI_CONSULTANCY_PITCH.body}
        </p>
        <GlobalEmailCTA className="ease-spring-bouncy inline-block w-full rounded-tr-3xl bg-[#FFE366] px-6 py-4 text-center text-xl font-bold text-[#311B4D] shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95 md:w-max md:px-12 md:py-6 md:text-2xl">
          {AI_CONSULTANCY_PITCH.ctaButtonText}
        </GlobalEmailCTA>
        <p className="mt-6 text-lg opacity-90 md:text-xl">
          {AI_CONSULTANCY_PITCH.subtext}
        </p>
      </div>
    </div>
  )
}
