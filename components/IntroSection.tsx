import SocialLinks from "./ui/SocialLinks"
import { INTRO_BIO_SHORT } from "@/constants/SITE_CONTENT"

export default function IntroSection() {
  return (
    <div className="relative flex h-full flex-col py-20 pb-24 md:pb-20">
      <div className="mx-auto w-4/5 translate-y-12 pt-4 opacity-0 transition-all duration-700 ease-spring-soft md:w-[90%] md:pt-20 lg:pt-32 [.active_&]:translate-y-0 [.active_&]:opacity-100">
        <div className="text-3xl leading-snug font-medium text-white drop-shadow-md md:text-5xl md:leading-tight lg:text-6xl">
          {INTRO_BIO_SHORT}
        </div>
      </div>
      <div className="mx-auto mt-auto mb-12 w-4/5 translate-y-12 pt-4 opacity-0 transition-all delay-200 duration-700 ease-spring-soft md:w-[90%] lg:mb-8 [.active_&]:translate-y-0 [.active_&]:opacity-100">
        <div className="w-3/4 md:w-11/12 lg:w-3/5">
          <SocialLinks
            containerClasses="flex justify-around py-6 md:mx-auto lg:justify-between"
            linkClasses="text-lg text-white transition-transform duration-300 ease-spring-bouncy hover:scale-110 active:scale-95 md:mr-4 md:flex lg:text-xl"
            labelClasses="restoramedium ml-2 hidden pt-1 md:block"
            showLabels={true}
          />
          <div className="mt-4 border-t-2 border-[#d6bb61] md:w-5/12 lg:mt-8 lg:w-1/3" />
        </div>
      </div>
    </div>
  )
}
