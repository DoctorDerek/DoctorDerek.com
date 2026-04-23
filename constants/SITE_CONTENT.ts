export const FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS =
  "***REDACTED***"
export const FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS =
  "***REDACTED***"

export const FULLPAGE_ACTIVATION_KEYS = {
  cards: "***REDACTED***",
  cinematic: "***REDACTED***",
  continuousHorizontal: "***REDACTED***",
  dragAndMove: "***REDACTED***",
  offsetSections: "***REDACTED***",
  resetSliders: "***REDACTED***",
  responsiveSlides: "***REDACTED***",
  scrollHorizontally: "***REDACTED***",
  scrollOverflowReset: "***REDACTED***",
} as const

import type { StaticImageData } from "next/image"
import pranjalImage from "@/images/testimonials/pranjal-jain.jpg"
import anangshaImage from "@/images/testimonials/anangsha-alammyan.jpg"
import danImage from "@/images/testimonials/dan-haas.jpg"
import toriImage from "@/images/testimonials/tori-bonagura.jpg"
import yosevuImage from "@/images/testimonials/yosevu-kilonzo.webp"
import stevenImage from "@/images/testimonials/steven-terner.webp"
import johnImage from "@/images/testimonials/john-syme.jpg"

export const SHOW_DR_MAPACHE = false


export const INTRO_BIO_SHORT =
  "Indie Game Dev · AI Context Engineer · I teach LLMs to think · Full-Stack SWE since 2005 · BS & MS in Bioinformatics at age 19 · Doctor of Physical Therapy" as const

export const ABOUT_BIO_LONG: string[] = [
  "I’m Dr. Derek Austin, an Indie Game Dev, AI Context Engineer, and senior full-stack SWE. I don’t just use AI; I teach LLMs how to think.",
  "My foundation is built on deconstructing complex systems. Earning a BS and MS in Bioinformatics by age 19 taught me to find clear signals in massive datasets. A decade in sports medicine as a Doctor of Physical Therapy trained me to diagnose and optimize complex biological systems.",
  "Today, I apply that rigorous, first-principles logic to LLMs. Frustrated by the constraints of standard “gaslighting” AI, I spent over 2,000 hours and 20+ million tokens engineering a solution. I architect the deep context, agentic workflows, and cognitive frameworks that force frontier models beyond simple pattern-matching into genuine, high-level code understanding and reasoning.",
  "I leverage these bespoke cognitive architectures to achieve 10× development velocity. For full-stack apps, I specialize in building with Next.js, TypeScript, Postgres, and cloud-native solutions. For my indie game dev, I use Godot 4, C#, and GDScript.",
  "I operate with total creative sovereignty from Puebla, Mexico, alongside my amazing wife, Abby, and our two cats, Louie and Yuma. I write about my exact systems, failures, and victories on Medium. Thank you for reading!",
] as const

export type AiConsultancyPitch = {
  header: string
  body: string
  ctaButtonText: string
  subtext: string
  emailSubject: string
}

export const AI_CONSULTANCY_PITCH: AiConsultancyPitch = {
  header: "Async AI Audit",
  body: "Standard LLMs generate slop because their context is rotten. I engineer Human-AI Cognitive Systems that force frontier models to reason, not just predict text. Whether you need a brutal teardown of your current architecture or bespoke context engineering (a “constitution”) for your LLM chat workflow or autonomous agents, I provide the elite context, persona, and systems engineering to fix it.",
  ctaButtonText: "Book a 20-Min Async AI Audit — $500 USD",
  subtext:
    "For a serious head start to your startup or indie game development using LLMs: $5,000 USD anchor point for a Custom AI Constitution / Master GDD Template.",
  emailSubject: "AI Cognitive Architecture Inquiry",
} as const

export const CONTACT_PITCH = "I build, architect, and scale robust software systems and engineer elite Human-AI cognitive frameworks. While I am highly selective about full-time roles—prioritizing elite, AI-first engineering teams—I also consult on high-leverage technical challenges. Reach out for a $500 Async AI Audit or a $5,000 Master GDD Template." as const
export const CONTACT_CTA = "Request Async Audit" as const

export type WorkExperience = {
  duration: string
  company: string
}

export const ARCHITECT_EVOLUTION: WorkExperience[] = [
  {
    duration: "2024–Present",
    company:
      "AI Context Engineer & Indie Game Dev | Godot C#, GDScript, 20M+ Tokens",
  },
  {
    duration: "2020–2024",
    company: "Senior Full-Stack SWE | React, Next.js, TypeScript, Tailwind CSS",
  },
  {
    duration: "2019–2020",
    company: "Senior React SWE | React, JavaScript, CSS",
  },
  {
    duration: "2009–2019",
    company: "Full-Stack Web Developer | HTML, CSS, JavaScript",
  },
  {
    duration: "2005–2009",
    company: "Software Engineer | C++, PHP, HTML, CSS, Ruby on Rails, SQL",
  },
] as const

export type SocialProofCta = {
  heading: string
  buttonText: string
  targetUrl: string
}

export const SOCIAL_PROOF_CTA: SocialProofCta = {
  heading: "Join 749+ email subscribers and 21,936+ followers.",
  buttonText: "Follow me on Medium to subscribe to my email newsletter",
  targetUrl: "https://doctorderek.medium.com/",
} as const

export type BlogMetrics = {
  totalPosts: number
  totalWordsK: number
  yearStarted: number
  emailSubscribers: number
  mediumFollowers: number
}

export const BLOG_METRICS: BlogMetrics = {
  totalPosts: 503,
  totalWordsK: 500,
  yearStarted: 2019,
  emailSubscribers: 749,
  mediumFollowers: 21936,
} as const

export type LegalDisclaimer = {
  aiDisclosure: string[]
  websiteDisclaimer: string[]
}

export const LEGAL_DISCLAIMER: LegalDisclaimer = {
  aiDisclosure: [
    "Hello, fellow human! I'm Dr. Derek Austin. Thanks for visiting! 👋",
    "I use LLMs to augment 100% of my software engineering, code architecture, data visualization, and proofreading.",
    "On my Medium blog (Career Programming and According to Context), I use LLMs for data visualization and proofreading ONLY.",
    "I do not use AI-generated images, video, nor text on Career Programming or According to Context.",
  ],
  websiteDisclaimer: [
    "I have taken care when crafting my opinions and compiling data / facts, but errors WILL occur. **Please fact check me!**",
    "This content is for entertainment and educational purposes ONLY. It does NOT constitute career, financial, legal, health, psychological, or any other type of professional advice.",
    "I have included ALL content relating to the conduct, views, activities, and/or aspects of ALL persons or characters for ENTERTAINMENT PURPOSES ONLY.",
    "This website does NOT represent an assertion of fact on those matters or any matters related to ANY persons, living or dead.",
    "ALL included data / facts should be considered illustrative, NOT definitive; thus, the website’s veracity should not be relied on under ANY circumstances beyond ENTERTAINMENT.",
    "THIS WEBSITE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED!",
    "IN NO EVENT SHALL I BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY ARISING FROM THIS WEBSITE.",
    "Side effects may include systems thinking. BROWSE AT YOUR OWN RISK! 😉🫡🦝",
  ],
} as const

export type Testimonial = {
  id: number
  name: string
  title: string
  comment: string
  image?: StaticImageData
}

export type SocialLink = {
  id: string
  label: string
  url?: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "medium",
    label: "Medium",
    url: "https://doctorderek.medium.com/",
  },
  {
    id: "book",
    label: "Book",
    url: "https://www.amazon.com/dp/B0BRJDLJ43",
  },
  {
    id: "email",
    label: "Async AI Audit",
  },
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/DoctorDerek",
  },
] as const

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "John Syme",
    title: "Venture Capitalist",
    image: johnImage,
    comment:
      "It is my pleasure to recommend Derek. He and I have worked together since he started at [JOB], and I have always been impressed with his organization, communication, work product, and work ethic. As a co-founder of a startup, I have leaned on Derek’s strengths as an Engineering Manager, and I would like to highlight specific areas where Derek excels.\n\n1 – Derek possesses strong organizational skills. Not only is Derek adept at managing his own engineering tasks, but he frequently supports other [JOB] developers as they breakdown problems. His ability to organize how to tackle a problem has helped improve the output of the entire engineering team while allowing junior engineers to gain confidence. He thinks systematically, creating processes that ensure smooth workflows, and he has built a [JOB] engineering system that will continue to live on.\n\n2 – Derek’s strong communication skills are tied closely to his organized approach. He provides comprehensive information backed with research to help communicate points allowing the team to make good decisions more quickly. For example, when asked to present his thoughts on how the engineering team should grow, Derek laid out a clear, concise (yet comprehensive) presentation describing options and weighing pros / cons for each potential scenario. This presentation sped the time to decision which is critical in an early-stage startup. Derek demonstrates a strong ability to think through a problem or question deeply then communicate those points to others.\n\n3 – Derek’s ability to think through problems deeply and then deliver high-quality work product makes him an asset to engineering teams. He is adept at writing tickets, planning work, and having a vision for how features should be built for continued improvement of the product. Derek researches technologies and architectures to ensure [JOB] doesn’t make missteps as we continue to improve on the product which will pay future dividends for our team. Derek also created a thoughtful, structured approach to career development for our junior software engineers. His system of mentoring based on Accountability, Accuracy, and Acceleration is something that has helped me better understand the performance and growth of our engineering hires.\n\n4 – Derek can deliver high-quality work product because of his tremendous work ethic, and his commitment to accountability as a software engineer and manager. If he says that he will take on a piece of work, he takes it on and delivers a high-quality result. We asked Derek to step into the Engineer Manager role, and he grew into the role. He holds himself and his team accountable for product deliverables which means that [JOB] can deliver a high-quality tech product on a timely basis. As a leader, I can count on Derek to fully own the code development process, and I am impressed with his ability to put work down to jump on high-impact bugs solving them quickly with little interruption to our users.",
  },
  {
    id: 2,
    name: "Yosevu Kilonzo",
    title: "Senior Full-Stack Software Engineer",
    image: yosevuImage,
    comment:
      "I had the privilege of working with Derek for a year at [JOB]. He is one of the most dedicated and talented people I’ve worked with. He cares deeply about the projects he is a part of, as well as the success of the team and organization as whole. Derek’s commitment is reflected in his holistic approach to management and software development.\n\nHe instilled a high level of ownership and accountability at [JOB], modeling high standards for those around him. His clear and direct verbal and written communication made it easier to know what was expected and helped to keep the team aligned and focused.\n\nOne of the things that sets Derek apart is his expertise as both a technical manager and a highly productive engineer with a strong product sense. He is thoughtful with software architecture, the development process, and staying up to date with technologies, patterns, and best practices with React, Next.js, and TypeScript. This combination ensured efficiency and quality throughout our work together at [JOB], delivering our projects successfully and keeping our team performing at its best.\n\nIn addition to his technical skills, Derek is also a valuable mentor. He is always ready to share his extensive knowledge and experience in software and provide constructive feedback. He created opportunities for growth that helped level up the skills of myself and other team members at [JOB], encouraging a culture of continuous improvement. Derek was an incredible asset at [JOB] and I would jump at the opportunity to work with him again in the future!",
  },
  {
    id: 3,
    name: "Tori Bonagura",
    title: "UI/UX Designer",
    image: toriImage,
    comment:
      "Derek is an extremely talented engineer and an advocate not just for product users, but also for the people building the product. During our time at [JOB], Derek and I worked closely on a small team to build a flexible design system to power our new cross-functional web app.\n\nDerek consistently advocated for doing the upfront work to keep our team in a good position down the line. Additionally, as we started building the experience, Derek always advocated for the user, going beyond the basic flows to support fleshing out states, transitions, and moments of joy — often adding improvements and suggestions along the way. He has a keen attention to detail and truly brings a designer’s vision to life accurately and accessibly.\n\nDerek has a deep wealth of knowledge both in engineering and in life, and he has a knack for breaking down complex terms and concepts so our team could explore new workflows, improve skills, and find better ways of working. He led an internal recurring meeting on ways to practice positive psychology and is quick to practice what he teaches.\n\nHe consistently gives positive recognition to his team and was a big advocate for creating connection in a remote space — I’ll especially miss his movie recommendations each week! To sum it all up, Derek would be an ideal candidate for a company looking to get things done the right way.",
  },
  {
    id: 6,
    name: "Steven Terner, PhD, CAMS",
    title: "Geopolitical Consultant",
    image: stevenImage,
    comment:
      "Professional: Derek designed, built, and copy wrote two of my websites, including my new one. I had originally suggested a WordPress.com blog, which Derek designed and built out to my specifications. However, we agreed that my blog could reach a larger audience at Medium, so Derek redesigned and rebuilt the WordPress website. He came up with an impressive, original web design while significantly improving the website’s performance and mobile design.\n\nThe WordPress site took over 12 seconds to load, but the new site loads in under 3 seconds. He even added a dark mode, which was a great touch. Derek remained enthusiastic about the project throughout, and went the extra mile to make sure the site was written with high-quality code and would rank well for SEO. His exceptional writing and ability to organize information really put my site over the top. I’ve already referred Derek to a colleague looking for a new website because I absolutely trust his problem solving and communication skills. I would genuinely recommend him to anyone looking for a web developer who’s also a great communicator.\n\nPersonal: Derek and I have been friends since freshman year of high school, when he was 11. Even then, one of his biggest strengths was his ability to explain complex topics in simple terms. He’s not didactic or trying to teach, he’s just a natural educator. He’s also adventurous, creative, and always meticulously working on something cool and new. Ask him about his travels, his charity project, gaming, programming, web development, genetics, physical therapy, etc. He’s a fun dude who isn’t afraid to seize the day.",
  },
  {
    id: 4,
    name: "Pranjal Jain",
    title: "Full-Stack Developer",
    image: pranjalImage,
    comment:
      "Dr. Derek Austin is an exceptional engineering manager who fosters a positive and growth-oriented environment for his team. I had the pleasure of working under his leadership for almost a year as a full-stack developer.\n\nDr. Austin’s guidance was instrumental in helping me develop my problem-solving skills. While working on the [JOB] cross-platform application, his insights always helped us overcome critical technical hurdles and ultimately deliver the features on time.\n\nDr. Austin is a highly skilled communicator who excels at delegating tasks and motivating his team members. I highly recommend Dr. Austin to anyone seeking a talented and inspiring engineering manager.",
  },
  {
    id: 5,
    name: "Dan Haas, MS",
    title: "Software Engineer",
    image: danImage,
    comment:
      "As a graduate of Nucamp Web Development Bootcamp who was in the process of finishing my second Bachelor’s, I knew I was right on the cusp of getting a great position as a front-end engineer. I asked for resume feedback in the Nucamp Slack community, and Dr. Derek Austin volunteered to provide me detailed notes on my resume and portfolio.\n\nHis helpful attitude and enthusiasm impressed me, as I hadn’t been one of his students, so his mentoring really went above & beyond. His knowledge of both software engineering and personal marketing made an impact right away. After a few weeks of collaboration, I could better communicate my personal brand, and suddenly I was having much better results from my job hunt.\n\nNow that I’m working as a front end developer, I’ve had the chance to “pay it forward” and help other engineers with their own job hunts. I’d recommend Dr. Derek Austin for anyone needing a front-end developer, mentor, technical writer, or entrepreneur.",
  },
  {
    id: 7,
    name: "Anangsha Alammyan",
    title: "Author and Content Creator",
    image: anangshaImage,
    comment:
      "I came across Dr. Derek’s articles on Medium and was always fascinated by how detailed and well-presented they were. He has fantastic writing skills that make it hard for a reader to stop reading once they started.\n\nI attended his talk at Momentum 2021, and even though I’m not an SEO geek, I found his talk incredibly valuable. It gave me a lot of things to think about when I write, and some important information about how to structure a headline that gives you clicks.\n\nDr. Derek is also a fantastic editor. He edited an article that took me the longest time to write, and with his inputs, it became even better. If you’re ever looking for a technical writer, an editor, or an SEO specialist, I can’t recommend Dr. Derek enough.",
  },
]
