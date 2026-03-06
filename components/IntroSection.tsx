import EmailIcon from "./EmailIcon"
import LinkedinIcon from "./LinkedinIcon"
import GithubIcon from "./GithubIcon"
import MediumIcon from "./MediumIcon"
import BookLinkIcon from "./BookLinkIcon"
import TypewriterComponent, {
  type Options,
  type TypewriterClass,
} from "typewriter-effect"

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
    <div className="yw-bg-img flex h-[90vh] flex-col md:h-screen">
      <div className="mx-auto w-4/5 pt-4 md:w-[90%]">
        <div className="text-3xl text-[#FB70AA] md:text-5xl lg:text-7xl">
          <Typewriter />
        </div>
      </div>
      <div className="mx-auto mt-auto w-4/5 pt-4 md:w-[90%] lg:mb-8 mb-12">
        <div className="w-3/4 md:w-11/12 lg:w-3/5">
          <div className="flex justify-around py-6 md:mx-auto lg:justify-between">
            <a
              className="text-lg text-[#F38B57] md:mr-4 md:flex lg:text-xl"
              href="mailto:derekraustin@gmail.com"
            >
              <EmailIcon fill="#F38B57" />
              <span className="restoramedium ml-2 hidden pt-1 md:block">
                Email
              </span>
            </a>
            <a
              className="text-lg text-[#F38B57] md:mr-4 md:flex lg:text-xl"
              href="https://www.linkedin.com/in/derek-austin/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedinIcon fill="#F38B57" />
              <span className="restoramedium ml-2 hidden pt-1 md:block">
                Linkedin
              </span>
            </a>
            <a
              href="https://github.com/DoctorDerek"
              className="text-lg text-[#F38B57] md:mr-4 md:flex lg:text-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon fill="#F38B57" />
              <span className="restoramedium ml-2 hidden pt-1 md:block">
                Github
              </span>
            </a>
            <a
              href="https://doctorderek.medium.com/"
              className="text-lg text-[#F38B57] md:mr-4 md:flex lg:text-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MediumIcon fill="#F38B57" />
              <span className="restoramedium ml-2 hidden pt-1 md:block">
                Medium
              </span>
            </a>
            <a
              className="lg:xl text-lg text-[#F38B57] md:flex"
              href="https://www.amazon.com/dp/B0BRJDLJ43"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookLinkIcon fill="#F38B57" />
              <span className="restoramedium ml-2 hidden pt-1 md:block">
                Book
              </span>
            </a>
          </div>
          <div className="mt-4 border-t-2 border-[#d6bb61] md:w-5/12 lg:mt-8 lg:w-1/3" />
        </div>
      </div>
    </div>
  )
}
