export default function AiConsultancySection() {
  const handleBookClick = () => {
    window.location.href = [
      "mailto:",
      "derekraustin",
      "+doctorderek",
      "@",
      "gmail.com",
      "?subject=AI%20Evaluation%20Consultancy",
    ].join("")
  }

  return (
    <div className="flex h-screen items-center justify-center p-8">
      <div className="max-w-4xl rounded-2xl border border-white/20 bg-white/10 p-12 text-white backdrop-blur-md">
        <h2 className="mb-8 text-6xl font-bold">AI Evaluation Service</h2>
        <p className="mb-10 text-2xl leading-relaxed">
          I offer a max-autonomy, lowest-friction, most-info-dense, most-useful
          genius service where I help people create “Constitutions” and “GDDs”
          for their AI agents. I provide elite prompt, context, persona, and
          cognitive engineering of LLMs for your specific tasks.
        </p>
        <button
          onClick={handleBookClick}
          className="rounded-tr-3xl bg-[#FFE366] px-12 py-6 text-2xl font-bold text-[#311B4D] transition-transform hover:scale-105"
        >
          Book a 20-Minute Async AI Audit - $500 USD
        </button>
        <p className="mt-6 text-xl opacity-80">
          Also available: $5,000 USD anchor point for a custom GDD for AI Master
          Template.
        </p>
      </div>
    </div>
  )
}
