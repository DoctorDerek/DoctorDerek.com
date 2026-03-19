import SectionHeading from "@/components/ui/SectionHeading"
import GlobalEmailCTA from "@/components/ui/GlobalEmailCTA"

export default function AiConsultancySection() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-8 py-20">
      <div className="flex max-w-4xl translate-y-12 scale-95 flex-col rounded-2xl border border-white/20 bg-white/10 p-12 text-white opacity-0 backdrop-blur-md transition-all duration-700 ease-spring-bouncy [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
        <SectionHeading className="mb-8">
          <h2 className="text-6xl font-bold">AI Evaluation Service</h2>
        </SectionHeading>
        <p className="mb-10 text-2xl leading-relaxed">
          I offer a max-autonomy, lowest-friction, most-info-dense, most-useful
          genius service where I help people create context engineering
          documents for their agents: AGENTS.md, Constitutions, and Game Design
          Documents (GDD). I provide elite prompt, context, persona, and
          cognitive engineering of LLMs for your specific tasks.
        </p>
        <GlobalEmailCTA
          subject="AI Evaluation Consultancy"
          className="inline-block w-max text-center rounded-tr-3xl bg-[#FFE366] px-12 py-6 text-2xl font-bold text-[#311B4D] transition-transform duration-300 ease-spring-bouncy hover:scale-105 active:scale-95"
        >
          Book a 20-Minute Async AI Audit - $500 USD
        </GlobalEmailCTA>
        <p className="mt-6 text-xl opacity-80">
          Also available: $5,000 USD anchor point for a custom GDD for AI Master
          Template.
        </p>
      </div>
    </div>
  )
}
