import TypewriterComponent, {
  type Options,
  type TypewriterClass,
} from "typewriter-effect"
import SocialLinks from "./ui/SocialLinks"

const INTRO_STRING =
  "Indie Game Dev · AI Context Engineer · I teach LLMs to think · Full-Stack SWE since 2005 · BS & MS in Bioinformatics at age 19 · Doctor of Physical Therapy"

const TypewriterOnInit = (typewriter: TypewriterClass) =>
  typewriter.typeString(INTRO_STRING).start().pauseFor(3000)

const TypewriterOptions: Options = { delay: 25, loop: true, deleteSpeed: 1 }

const Typewriter = () => (
  <TypewriterComponent onInit={TypewriterOnInit} options={TypewriterOptions} />
)

export default function IntroSection() {
  return (
    <div className="relative flex h-[90vh] flex-col md:h-screen">
      <div className="mx-auto w-4/5 pt-4 opacity-0 translate-y-12 transition-all duration-700 ease-spring-soft [.active_&]:opacity-100 [.active_&]:translate-y-0 md:w-[90%] md:pt-20 lg:pt-32">
        <div className="text-3xl text-[#FB70AA] md:text-5xl lg:text-7xl">
          <Typewriter />
        </div>
      </div>
      <div className="mx-auto mt-auto mb-12 w-4/5 pt-4 opacity-0 translate-y-12 transition-all duration-700 delay-200 ease-spring-soft [.active_&]:opacity-100 [.active_&]:translate-y-0 md:w-[90%] lg:mb-8">
        <div className="w-3/4 md:w-11/12 lg:w-3/5">
          <SocialLinks
            containerClasses="flex justify-around py-6 md:mx-auto lg:justify-between"
            linkClasses="text-lg text-[#F38B57] transition-transform duration-300 ease-spring-bouncy hover:scale-110 active:scale-95 md:mr-4 md:flex lg:text-xl"
            labelClasses="restoramedium ml-2 hidden pt-1 md:block"
            showLabels={true}
          />
          <div className="mt-4 border-t-2 border-[#d6bb61] md:w-5/12 lg:mt-8 lg:w-1/3" />
        </div>
      </div>
    </div>
  )
}
