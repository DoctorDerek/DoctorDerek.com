import Image from "next/image"
import IntroAnimation from "@/images/Intro-Animation.jpg"

export default function WorkExperienceSection() {
  const evolution = [
    { period: "2025–2026 (Today)", skills: "Godot C# & GDScript | AI Context Engineer (15-20+ Million Tokens Exchanged)" },
    { period: "2020–2026", skills: "React / Next.js + TypeScript + Tailwind CSS | Lead Frontend SWE" },
    { period: "2019–2020", skills: "React, JavaScript, CSS | React SWE" },
    { period: "2009–2019", skills: "HTML, CSS, JS | Web Developer" },
    { period: "2005–2009", skills: "C++, PHP, HTML, CSS, Ruby on Rails | Full-Stack SWE" }
  ]

  return (
    <div className="relative h-screen flex flex-col items-center justify-center p-8">
      <Image src={IntroAnimation} alt="Work Experience Background" fill className="-z-10 object-cover" priority={false} />
      <h2 className="text-7xl font-bold mb-12 text-white drop-shadow-md">The Architect’s Evolution</h2>
      <div className="space-y-8 max-w-4xl w-full">
        {evolution.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-tr-3xl border-l-4 border-white/50 border-t border-r border-b border-t-white/10 border-r-white/10 border-b-white/10 text-white">
            <span className="text-2xl font-bold text-white min-w-[200px]">{item.period}</span>
            <span className="text-2xl text-white/90">{item.skills}</span>
          </div>
        ))}

      </div>
    </div>
  )
}
