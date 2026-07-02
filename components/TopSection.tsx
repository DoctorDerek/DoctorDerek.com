import Logo from "@/components/ui/Logo"
import Navbar from "./Navbar"
import TypewriterComponent, {
  type Options,
  type TypewriterClass,
} from "typewriter-effect"
import { INTRO_BIO_SHORT } from "@/constants/SITE_CONTENT"

const TypewriterOptions: Options = { delay: 25, loop: true, deleteSpeed: 10 }

const TypewriterOnInit = (typewriter: TypewriterClass) => {
  const segments = INTRO_BIO_SHORT.split(" · ")
  for (let i = 0; i < segments.length; i++) {
    typewriter.typeString(segments[i]).pauseFor(2000).deleteAll()
  }
  typewriter.start()
}

export default function TopSection() {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col">
      <Navbar />
      <div className="flex flex-1 translate-y-12 scale-95 flex-col items-center justify-center opacity-0 transition-all duration-700 ease-spring-bouncy [.active_&]:translate-y-0 [.active_&]:scale-100 [.active_&]:opacity-100">
        <Logo className="h-16 w-48 md:h-32 md:w-96" />
        <div className="restorabold mt-8 min-h-[4rem] text-center text-xl font-bold text-white drop-shadow-md md:mt-12 md:min-h-[5rem] md:text-3xl lg:text-4xl">
          <TypewriterComponent
            onInit={TypewriterOnInit}
            options={TypewriterOptions}
          />
        </div>
      </div>
    </div>
  )
}
