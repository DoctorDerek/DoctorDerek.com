import Image from "next/image"
import DerekAustin from "@/images/DerekAustin.png"

const techStack = [
  "Node.js",
  "Typescript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Vercel",
  "Github Actions",
  "React Query",
  "Redux / Redux Toolkit",
  "Jest",
  "Cypress",
  "React Testing Library",
  "Playwright",
  "Tailwind CSS",
]

export default function TechStackSection() {
  return (
    <div className="h-screen text-white drop-shadow-md">
      <div className="mx-auto w-4/5">
        <div className="mb-auto translate-y-12 py-4 opacity-0 transition-all duration-700 ease-spring-soft [.active_&]:translate-y-0 [.active_&]:opacity-100">
          <h2 className="text-7xl">About</h2>
        </div>
        {/*========= DR DEREK AUSTIN IMAGE ========= */}
        <div className="relative h-[75vh]">
          <div className="w-[65%] translate-y-12 scale-90 opacity-0 transition-all delay-200 duration-700 ease-spring-bouncy [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
            <div
              className="animate-float overflow-hidden rounded-tr-[6rem]"
              style={{ animationDelay: "0.5s" }}
            >
              <Image
                src={DerekAustin}
                alt="Dr Derek Austin"
                className="w-full object-cover"
              />
            </div>
          </div>
          <div className="h-3/5">
            <div className="w-4/5 translate-y-8 opacity-0 transition-all delay-300 duration-700 ease-spring-soft [.active_&]:translate-y-0 [.active_&]:opacity-100">
              <p className="restorabold pt-5 pb-3 text-2xl text-white">
                Tech Stack
              </p>
            </div>
            {/* ========= TECH STACK ============ */}
            <div className="flex w-5/6 flex-wrap content-between gap-x-2">
              {techStack.map((item: string, index: number) => (
                <div
                  key={`techstack${item + index}reactkey`}
                  className="mb-3 translate-y-12 opacity-0 transition-all duration-700 ease-spring-soft [.active_&]:translate-y-0 [.active_&]:opacity-100"
                  style={{ transitionDelay: `${index * 50 + 400}ms` }}
                >
                  <p className="rounded-tr-xl border border-white/30 bg-white/20 py-1 pr-2 pl-2 text-xl text-white backdrop-blur-md transition-transform duration-300 ease-spring-bouncy hover:-translate-y-1 hover:scale-105">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
