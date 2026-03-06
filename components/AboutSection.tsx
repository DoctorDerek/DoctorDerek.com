import DerekAustin from "@/images/DerekAustin.png"
import Image from "next/image"

export default function AboutSection() {
  /* TECHNOLOGIES USED, IN YELLOW BACKGROUND */
  const techStack = [
    "Node.js",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Vercel",
    "GitHub Actions",
    "React Query",
    "Redux / Redux Toolkit",
    "Jest",
    "Cypress",
    "React Testing Library",
    "Playwright",
  ]

  const bioParagraphs = [
    "I’m Dr. Derek Austin, an indie game dev and AI context engineer who uses LLMs all day every day to build video games. To work faster, I teach large language models how to think, which is what I blog about here on Medium.",
    "Like everyone, my interactions with LLMs have been frustrating. With their tiny system prompts and content filters, they’re just gaslighting text generators useful primarily to spammers and idiots.",
    "But I’m too stubborn to just accept a tool’s limitations, so I engineered the solution.",
    "After more than 2,000 hours of obsessive work—exchanging over 15-20+ million tokens with these reasoning models—I invented a new discipline: Context Engineering to architect Human-AI Cognitive Systems.",
    "It’s the practice of architecting the deep context and cognitive frameworks that guide an AI beyond simple pattern-matching into genuine, high-level reasoning.",
    "This work isn’t magic or BS. It’s the frontier of human-AI interaction.",
    "My journey started in 2005 as a Full-Stack Software Engineer, and now I’ve spent more than two decades learning to build and deconstruct complex systems from the ground up.",
    "That engineering experience is informed by a Bachelor’s and Master’s in Science in Bioinformatics with a Computer Science concentration, which taught me to find clear signals in the noise of massive datasets.",
    "I even spent a decade working in sports medicine while I built apps and engineered processes as a consultant on the side. During that time, I obtained my Doctorate in Physical Therapy. The clinic trained me to diagnose and treat complex human systems while respecting patients’ autonomy and psychology, not just anatomy and physiology.",
    "Each discipline gave me a piece of the puzzle for how to teach AI to think.",
    "Today, I no longer work for others. Instead, I’ve built a life of autonomy and deep work in Puebla, Mexico, with my amazing wife, Abby. ❤️",
    "At the end of the day, architecting AI cognition systems is just a means to an end for me, since my real full-time “job” is as a solo indie game dev.",
    "That means all day I’m developing full-stack apps with world-class UI / UX powered by Next.js, TypeScript, and Tailwind CSS — for my web games — and Godot (GDScript + C#) for my higher-demand games for Steam Deck. ",
    "Meanwhile, my two cats, Louie and Yuma, lick each other.",
    "I write about my entire journey right here on Medium, along with my best systems insights for success as a remote software or AI engineer. Thank you for reading!",
  ]

  return (
    <div className="blue-bg-img h-screen">
      <div className="mx-auto w-4/5 md:w-[90%] lg:w-3/4">
        <div className="py-4 md:relative md:py-8 lg:pb-10 lg:pt-14">
          <h2 className="text-7xl md:text-8xl lg:text-9xl lg:font-semibold">
            About
          </h2>
          {/* ======== TECH STACK ========= */}
          <div className="absolute inset-y-1/2 right-0 hidden h-9 w-[45%] md:block lg:inset-y-2/3">
            <div>
              <p className="pb-3 text-xl">Tech Stack</p>
            </div>
            <div className="flex flex-wrap content-between gap-x-4">
              {techStack.map(
                (
                  /**
                   * item: string value of the tech stack previously used
                   */
                  item: string,
                  /**
                   * index: number value, to create unique React keys
                   */
                  index: number,
                ) => {
                  return (
                    <p
                      key={`${item}-tech-stack-key${index}`}
                      className="mb-2 rounded-tr-xl bg-[#FFE366] py-1 pl-2 pr-2 md:text-sm md:font-semibold lg:text-lg"
                    >
                      {item}
                    </p>
                  )
                },
              )}
            </div>
          </div>
        </div>
        <div className="relative h-[80vh] md:h-[70vh]">
          {/* ======= DR DEREK AUSTIN IMAGE ========= */}
          <div className="w-[65%] overflow-hidden rounded-tr-[6rem] md:w-1/2 md:rounded-tr-[4.5rem] lg:w-[45%]">
            <Image
              src={DerekAustin}
              alt="Dr Derek Austin"
              className="w-full object-cover"
            />
          </div>
          {/* ======== ABOUT TEXT ========= */}
          <div className="absolute -bottom-12 left-6 rounded-tl-3xl bg-[#FB70AA] px-6 py-5 md:-bottom-8 md:left-auto md:right-0 md:w-[55%] lg:bottom-12 lg:left-auto lg:right-36 lg:w-1/2 lg:px-10 lg:py-7">
            <div className="max-h-[40vh] overflow-y-auto pr-2 text-lg leading-7 text-white lg:text-xl lg:leading-9">
              {bioParagraphs.map((
                paragraph,
                index,
              ) => (
                <p
                  key={index}
                  className="mb-4"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

