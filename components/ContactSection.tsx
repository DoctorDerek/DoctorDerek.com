import { useState } from "react"
import Image from "next/image"
import contactimage from "@/images/contactimage.png"
import DerekSpriteImg from "@/images/DerekSpriteImg.png"

const ContactSection = () => {
  const [isFlipped, setIsFlipped] = useState(false)
  return (
    <div className="h-full w-full">
      <div className="flex h-screen flex-col md:flex-row">
        <div className="mx-auto h-[45%] w-[85%] md:flex md:h-full md:w-1/2 md:flex-col md:pl-8 lg:w-[45%] lg:justify-start lg:pl-20">
          <div className="py-4 md:mt-16 md:mb-2 lg:mb-0 lg:py-0">
            <h2 className="text-7xl text-white drop-shadow-lg md:text-8xl lg:pt-8 lg:pb-14 lg:text-9xl">
              Contact
            </h2>
          </div>

          {/* Flipping images with state */}
          <div
            className="perspective w-3/5 animate-float md:h-1/2 md:w-full"
            style={{ animationDelay: "1s" }}
          >
            <div
              className="cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div
                className="wrapper md:relative lg:inline-flex"
                style={{
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.8s ease-out",
                }}
              >
                {/*==== Front image ======  md:h-3/4 md:w-[85%]*/}
                <div className="front h-full">
                  <Image
                    src={contactimage}
                    alt="John Doe"
                    className="object-cover md:relative"
                  />
                </div>
                {/*===== Back image ======= */}
                <div className="back hidden h-full md:absolute md:top-0 md:right-0 md:bottom-0 md:left-0 md:block">
                  <Image
                    src={DerekSpriteImg}
                    alt="John Doe"
                    className="object-cover md:relative"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto flex h-[55%] w-full flex-col md:mt-0 md:h-full md:w-1/2 md:pl-8 lg:w-[55%]">
          <div className="mx-auto mt-8 w-4/5 md:mt-32 md:ml-0 md:h-1/6 md:w-11/12 lg:my-auto lg:mr-0 lg:ml-auto lg:w-11/12 lg:pt-16 lg:pl-14">
            <p className="rounded-xl bg-black/20 py-4 pr-2 pl-2 text-xl leading-8 text-white backdrop-blur-md md:pl-4 md:text-xl lg:pr-20 lg:text-2xl lg:leading-9">
              Discover the power of versatile frontend developing with Derek
              Austin. Get in touch to discuss your next development project, or
              to simply chat.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactSection
