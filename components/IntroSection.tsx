import { INTRO_BIO_SHORT } from "@/constants/SITE_CONTENT"
import SocialLinks from "./ui/SocialLinks"

export default function IntroSection() {
  return (
    <div className="relative flex min-h-dvh flex-col justify-evenly gap-1 py-1 xl:h-full xl:min-h-0 xl:justify-start xl:gap-0 xl:py-20">
      <div className="ease-spring-soft mx-auto w-11/12 translate-y-12 opacity-0 transition-all duration-700 xl:w-[90%] xl:pt-32 [.active_&]:translate-y-0 [.active_&]:opacity-100">
        <div className="restoramedium text-site-foreground text-3xl leading-snug font-medium wrap-break-word drop-shadow-md xl:text-6xl xl:leading-tight">
          {INTRO_BIO_SHORT}
        </div>
      </div>
      <div className="ease-spring-soft mx-auto w-4/5 translate-y-12 opacity-0 transition-all delay-200 duration-700 xl:mt-auto xl:mb-8 xl:w-[90%] xl:pt-4 [.active_&]:translate-y-0 [.active_&]:opacity-100">
        <div className="w-3/4 md:w-11/12 lg:w-3/5">
          <SocialLinks
            containerClasses="flex justify-around py-2 xl:mx-auto xl:justify-between xl:py-6"
            linkClasses="text-lg text-site-foreground transition-transform duration-300 ease-spring-bouncy hover:scale-110 active:scale-95 md:mr-4 md:flex lg:text-xl"
            labelClasses="restoramedium ml-2 hidden pt-1 md:block"
            showLabels={true}
          />
          <div className="border-site-accent-text mt-4 border-t-2 md:w-5/12 lg:mt-8 lg:w-1/3" />
        </div>
      </div>
    </div>
  )
}
