export default function WorkExperienceSection() {
  const evolution = [
    { period: "2025–2026 (Today)", skills: "Godot C# & GDScript | AI Context Engineer (15-20+ Million Tokens Exchanged)" },
    { period: "2020–2026", skills: "React / Next.js + TypeScript + Tailwind CSS | Lead Frontend SWE" },
    { period: "2019–2020", skills: "React, JavaScript, CSS | React SWE" },
    { period: "2009–2019", skills: "HTML, CSS, JS | Web Developer" },
    { period: "2005–2009", skills: "C++, PHP, HTML, CSS, Ruby on Rails | Full-Stack SWE" }
  ]

  return (
    <div className="yw-bg-img h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-7xl font-bold mb-12 text-[#311B4D]">The Architect’s Evolution</h2>
      <div className="space-y-8 max-w-4xl w-full">
        {evolution.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 bg-[#FFE366]/50 p-6 rounded-tr-3xl border-l-4 border-[#FB70AA]">
            <span className="text-2xl font-bold text-[#311B4D] min-w-[200px]">{item.period}</span>
            <span className="text-2xl text-[#311B4D]">{item.skills}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
