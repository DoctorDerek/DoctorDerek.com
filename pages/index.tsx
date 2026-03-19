import Head from "next/head"
import ReactFullpage, { FullPageProps } from "@fullpage/react-fullpage"
import {
  FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS,
  FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS,
} from "@/constants/SITE_CONTENT"

const pluginWrapper = () => {
  require("@/utils/fullpage.cinematic.min.js")
}

// -----------------------------------------------------------------------------
// Type Augmentation for Fullpage.js Extensions
// -----------------------------------------------------------------------------
type MapacheFullpageProps = FullPageProps & {
  pluginWrapper?: () => void
  render?: (comp: { state: any; fullpageApi: any }) => React.ReactElement
  anchors?: string[]

  // Extension Keys
  licenseKey?: string
  cinematicKey?: string
  
  // Extension toggles
  cinematic?: boolean
  effects?: boolean
  parallax?: boolean
  dropEffect?: boolean
  waterEffect?: boolean
  cards?: boolean
  responsiveSlides?: boolean
  continuousHorizontal?: boolean
  scrollHorizontally?: boolean
  interlockedSlides?: boolean | number[]
  dragAndMove?: boolean | "vertical" | "horizontal" | "fingersonly" | "mouseonly"
  offsetSections?: boolean
  resetSliders?: boolean
  fadingEffect?: boolean | "sections" | "slides"
  scrollOverflowReset?: boolean | "sections" | "slides"

  // Extension options
  cinematicOptions?: any
  effectsOptions?: any
  parallaxOptions?: { type?: string; percentage?: number; property?: string }
  dropEffectOptions?: { speed?: number; color?: string; zIndex?: number }
  waterEffectOptions?: { animateContent?: boolean; animateOnMouseMove?: boolean }
  cardsOptions?: { perspective?: number; fadeContent?: boolean; fadeBackground?: boolean }
}

const MapacheFullpage = ReactFullpage as unknown as React.FC<MapacheFullpageProps>

import IntroSection from "@/components/IntroSection"
import AboutSection from "@/components/AboutSection"
import DrMapacheSection from "@/components/DrMapacheSection"
import AiConsultancySection from "@/components/AiConsultancySection"
import WorkExperienceSection from "@/components/WorkExperienceSection"
import Testimonials from "@/components/Testimonials"
import BlogSection from "@/components/BlogSection"
import ContactSection from "@/components/ContactSection"
import TopSection from "@/components/TopSection"
import Footer from "@/components/Footer"
import getMediumPosts, { MediumPost } from "@/utils/medium"
import dynamic from "next/dynamic"

const RiveAnimation = dynamic(() => import("@/components/RiveAnimation"), {
  ssr: false,
})

export async function getStaticProps() {
  const posts = await getMediumPosts()
  return {
    props: {
      posts,
    },
    revalidate: 86400,
  }
}

export default function Home({ posts }: { posts: MediumPost[] }) {
  const sections = [
    <TopSection key="top" />,
    <IntroSection key="intro" />,
    <AboutSection key="about" />,
    <DrMapacheSection key="mapache" />,
    <WorkExperienceSection key="experience" />,
    <AiConsultancySection key="consultancy" />,
    <Testimonials key="testimonials" />,
    <BlogSection key="blog" posts={posts} />,
    <ContactSection key="contact" />,
    <Footer key="footer" />,
  ]

  return (
    <>
      <Head>
        <title>
          Dr. Derek Austin | Indie Game Dev, AI Context Engineer, Full-STack
          SWE, & Content Creator
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <RiveAnimation />

      <MapacheFullpage
        pluginWrapper={pluginWrapper}
        licenseKey={FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS}
        cinematic={true}
        cinematicKey={FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS}
        anchors={[
          "home",
          "intro",
          "about",
          "mapache",
          "experience",
          "consultancy",
          "testimonials",
          "blog",
          "contact",
          "footer",
        ]}
        render={() => (
          <ReactFullpage.Wrapper>
            {sections.map((section) => (
              <div key={section.key} className="section">
                {section}
              </div>
            ))}
          </ReactFullpage.Wrapper>
        )}
      />
    </>
  )
}
