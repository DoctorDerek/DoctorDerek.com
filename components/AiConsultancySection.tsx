export default function AiConsultancySection() {
  const handleBookClick = () => {
    window.location.href = ["mailto:", "derekraustin", "+doctorderek", "@", "gmail.com", "?subject=AI%20Evaluation%20Consultancy"].join("")
  }

  return (
    <div className="h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl p-12 text-white border border-white/20">
        <h2 className="text-6xl font-bold mb-8">AI Evaluation Service</h2>
        <p className="text-2xl leading-relaxed mb-10">
          I offer a max-autonomy, lowest-friction, most-info-dense, most-useful genius service where I help people create “Constitutions” and “GDDs” for their AI agents. I provide elite prompt, context, persona, and cognitive engineering of LLMs for your specific tasks.
        </p>
        <button
          onClick={handleBookClick}
          className="bg-[#FFE366] text-[#311B4D] text-2xl font-bold py-6 px-12 rounded-tr-3xl hover:scale-105 transition-transform"
        >
          Book a 20-Minute Async AI Audit - $500 USD
        </button>
        <p className="mt-6 text-xl opacity-80">
          Also available: $5,000 USD anchor point for a custom GDD for AI Master Template.
        </p>
      </div>
    </div>
  )
}
