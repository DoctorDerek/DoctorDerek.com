import Head from "next/head"
import ScrollObserver from "@/components/ui/ScrollObserver"
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

      <ScrollObserver
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
      >
        <TopSection />
        <IntroSection />
        <AboutSection />
        <DrMapacheSection />
        <WorkExperienceSection />
        <AiConsultancySection />
        <Testimonials />
        <BlogSection posts={posts} />
        <ContactSection />
        <Footer />
      </ScrollObserver>
    </>
  )
}
