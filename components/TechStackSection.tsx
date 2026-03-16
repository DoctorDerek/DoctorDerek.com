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

const TechStackSection = () => {
  return (
    <div className="h-screen text-white drop-shadow-md">
      <div className="mx-auto w-4/5">
        <div className="mb-auto py-4">
          <h2 className="text-7xl">About</h2>
        </div>
        {/*========= DR DEREK AUSTIN IMAGE ========= */}
        <div className="relative h-[75vh]">
          <div
            className="w-[65%] animate-float overflow-hidden rounded-tr-[6rem]"
            style={{ animationDelay: "0.5s" }}
          >
            <Image
              src={DerekAustin}
              alt="Dr Derek Austin"
              className="w-full object-cover"
            />
          </div>
          <div className="h-3/5">
            <div className="w-4/5">
              <p className="restorabold pt-5 pb-3 text-2xl text-white">
                Tech Stack
              </p>
            </div>
            {/* ========= TECH STACK ============ */}
            <div className="flex w-5/6 flex-wrap content-between gap-x-2">
              {techStack.map(
                (
                  /**
                   * item: string value of the technologies used and to create unique React keys with index
                   */
                  item: string,
                  /**
                   * index: number value used with item to create unique React keys
                   */
                  index: number,
                ) => (
                  <p
                    key={`techstack${item + index}reactkey`}
                    className="mb-3 rounded-tr-xl border border-white/30 bg-white/20 py-1 pr-2 pl-2 text-xl text-white backdrop-blur-md"
                  >
                    {item}
                  </p>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TechStackSection
