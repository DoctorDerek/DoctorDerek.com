import type { StaticImageData } from "next/image"
import anangshaImage from "@/images/testimonials/anangsha-alammyan.jpg"
import danImage from "@/images/testimonials/dan-haas.jpg"
import johnImage from "@/images/testimonials/john-syme.jpg"
import pranjalImage from "@/images/testimonials/pranjal-jain.jpg"
import stevenImage from "@/images/testimonials/steven-terner.webp"
import toriImage from "@/images/testimonials/tori-bonagura.jpg"
import yosevuImage from "@/images/testimonials/yosevu-kilonzo.webp"

export const FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS =
  process.env.NEXT_PUBLIC_FULLPAGE_JS_LICENSE_FOR_REACT_FULLPAGE_JS || ""
export const FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS =
  process.env.NEXT_PUBLIC_FULLPAGE_JS_LICENSE_FOR_FULLPAGE_JS_EXTENSIONS || ""

export const FULLPAGE_ACTIVATION_KEYS = {
  cards: process.env.NEXT_PUBLIC_FULLPAGE_ACTIVATION_KEY_CARDS || "",
  cinematic: process.env.NEXT_PUBLIC_FULLPAGE_ACTIVATION_KEY_CINEMATIC || "",
  continuousHorizontal:
    process.env.NEXT_PUBLIC_FULLPAGE_ACTIVATION_KEY_CONTINUOUS_HORIZONTAL || "",
  dragAndMove:
    process.env.NEXT_PUBLIC_FULLPAGE_ACTIVATION_KEY_DRAG_AND_MOVE || "",
  offsetSections:
    process.env.NEXT_PUBLIC_FULLPAGE_ACTIVATION_KEY_OFFSET_SECTIONS || "",
  resetSliders:
    process.env.NEXT_PUBLIC_FULLPAGE_ACTIVATION_KEY_RESET_SLIDERS || "",
  responsiveSlides:
    process.env.NEXT_PUBLIC_FULLPAGE_ACTIVATION_KEY_RESPONSIVE_SLIDES || "",
  scrollHorizontally:
    process.env.NEXT_PUBLIC_FULLPAGE_ACTIVATION_KEY_SCROLL_HORIZONTALLY || "",
  scrollOverflowReset:
    process.env.NEXT_PUBLIC_FULLPAGE_ACTIVATION_KEY_SCROLL_OVERFLOW_RESET || "",
} as const

export const INTRO_BIO_SHORT =
  "AI-Native Senior Full-Stack SWE · UI/UX Engineer · TypeScript specialist · 20+ years of SWE · BS & MS in Bioinformatics age 19 · Doctor of Physical Therapy" as const

export const ABOUT_BIO_LONG: string[] = [
  "I’m Dr. Derek Austin: an AI-Native Senior Full-Stack SWE and UI/UX Engineer. I specialize in architecting and building full-stack TypeScript apps that scale and world-class UI/UX that “feels” right.",
  "I leverage frontier LLMs like Gemini Deep Think and Claude Opus every day, but I explicitly reject the technical debt of “vibe coding.”",
  "When using agentic and other AI-assisted SWE tools, I still take full ownership of the codebase and accountability for results.",
  "Using my strict 5-Step Forge (Plan, Build, Test, Reflect) and 40 “Anti-Slop” pillars, I build with deterministic state machines (XState) and scrub AI slop from my codebases.",
  "This methodology drives my 10× development velocity across disparate stacks: Next.js, TypeScript, Tailwind CSS, Node.js, and Postgres for cloud-native SaaS; and React Native + Expo for cross-platform mobile apps.",
  "I enforce code quality with automated testing (React Testing Library, Playwright), CI/CD pipelines (GitHub Actions, Docker), and production deployments to Vercel and AWS.",
  "I’m a US citizen based in Puebla, Mexico, where I live with my wife and our two cats. I work remotely on US Pacific Time.",
  "Contact me if you need a code owner who values results, accountability, and world-class UI/UX.",
] as const

export type AiConsultancyPitch = {
  header: string
  body: string
  ctaButtonText: string
  subtext: string
  emailSubject: string
}

export const AI_CONSULTANCY_PITCH: AiConsultancyPitch = {
  header: "What I Do Best",
  body: "Startups are drowning in fragile, AI-generated prototypes that cannot scale. I help founders and VC-backed teams build deterministic apps in regulated industries (like HealthTech) at 10x velocity. I hate bugs, I love results, and I know when to move fast and when to pay down tech debt. I ship robust, world-class software that feels “right” for users.",
  ctaButtonText: "Inquire About Availability",
  subtext:
    "Seeking a remote, full-time SWE role at a US startup hiring via a global Employer of Record (EOR). I work on US Pacific Time from Puebla, Mexico.",
  emailSubject: "Full-Time SWE / Code Owner Inquiry",
} as const

export const CONTACT_BULLETS: string[] = [
  "I architect, build, and scale deterministic software systems using elite, AI-augmented engineering approaches including agentic SWE workflows.",
  "I’ve built my career around taking broken MVPs—whether delivered by underperforming agencies or AI—and turning them into real apps.",
  "I partner with founders and early-stage startups as a full-time code owner to deliver 10x velocity without the technical debt of “vibe coding.”",
  "I deliver MVPs in under 3 months, and I’ve improved web performance by up to 90% and page speed by 60×.",
] as const
export const CONTACT_CTA = "Contact Me" as const

export type WorkExperience = {
  duration: string
  company: string
}

export const ARCHITECT_EVOLUTION: WorkExperience[] = [
  {
    duration: "2024–Present",
    company:
      "AI-Native Senior Full-Stack SWE · UI/UX Engineer · TypeScript Specialist",
  },
  {
    duration: "2019–2024",
    company:
      "Senior Full-Stack SWE · UI/UX Engineer | React, Next.js, TypeScript, Tailwind CSS",
  },
  {
    duration: "2009–2019",
    company: "Full-Stack Web Developer | HTML, CSS, JavaScript",
  },
  {
    duration: "2004–2009",
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
  totalPosts: 586,
  totalWordsK: 500,
  yearStarted: 2019,
  emailSubscribers: 749,
  mediumFollowers: 21936,
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
    id: "github",
    label: "GitHub",
    url: "https://github.com/DoctorDerek",
  },
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
    label: "Inquire",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/doctorderek",
  },
] as const

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "John Syme",
    title: "Venture Capitalist",
    image: johnImage,
    comment:
      "It is my pleasure to recommend Derek. He and I have worked together since he started at Primum, and I have always been impressed with his organization, communication, work product, and work ethic. As a co-founder of a startup, I have leaned on Derek’s strengths as an Engineering Manager, and I would like to highlight specific areas where Derek excels.\n\n1 – Derek possesses strong organizational skills. Not only is Derek adept at managing his own engineering tasks, but he frequently supports other Primum developers as they breakdown problems. His ability to organize how to tackle a problem has helped improve the output of the entire engineering team while allowing junior engineers to gain confidence. He thinks systematically, creating processes that ensure smooth workflows, and he has built a Primum engineering system that will continue to live on.\n\n2 – Derek’s strong communication skills are tied closely to his organized approach. He provides comprehensive information backed with research to help communicate points allowing the team to make good decisions more quickly. For example, when asked to present his thoughts on how the engineering team should grow, Derek laid out a clear, concise (yet comprehensive) presentation describing options and weighing pros / cons for each potential scenario. This presentation sped the time to decision which is critical in an early-stage startup. Derek demonstrates a strong ability to think through a problem or question deeply then communicate those points to others.\n\n3 – Derek’s ability to think through problems deeply and then deliver high-quality work product makes him an asset to engineering teams. He is adept at writing tickets, planning work, and having a vision for how features should be built for continued improvement of the product. Derek researches technologies and architectures to ensure Primum doesn’t make missteps as we continue to improve on the product which will pay future dividends for our team. Derek also created a thoughtful, structured approach to career development for our junior software engineers. His system of mentoring based on Accountability, Accuracy, and Acceleration is something that has helped me better understand the performance and growth of our engineering hires.\n\n4 – Derek can deliver high-quality work product because of his tremendous work ethic, and his commitment to accountability as a software engineer and manager. If he says that he will take on a piece of work, he takes it on and delivers a high-quality result. We asked Derek to step into the Engineer Manager role, and he grew into the role. He holds himself and his team accountable for product deliverables which means that Primum can deliver a high-quality tech product on a timely basis. As a leader, I can count on Derek to fully own the code development process, and I am impressed with his ability to put work down to jump on high-impact bugs solving them quickly with little interruption to our users.",
  },
  {
    id: 2,
    name: "Yosevu Kilonzo",
    title: "Senior Full-Stack Software Engineer",
    image: yosevuImage,
    comment:
      "I had the privilege of working with Derek for a year at Primum. He is one of the most dedicated and talented people I’ve worked with. He cares deeply about the projects he is a part of, as well as the success of the team and organization as whole. Derek’s commitment is reflected in his holistic approach to management and software development.\n\nHe instilled a high level of ownership and accountability at Primum, modeling high standards for those around him. His clear and direct verbal and written communication made it easier to know what was expected and helped to keep the team aligned and focused.\n\nOne of the things that sets Derek apart is his expertise as both a technical manager and a highly productive engineer with a strong product sense. He is thoughtful with software architecture, the development process, and staying up to date with technologies, patterns, and best practices with React, Next.js, and TypeScript. This combination ensured efficiency and quality throughout our work together at Primum, delivering our projects successfully and keeping our team performing at its best.\n\nIn addition to his technical skills, Derek is also a valuable mentor. He is always ready to share his extensive knowledge and experience in software and provide constructive feedback. He created opportunities for growth that helped level up the skills of myself and other team members at Primum, encouraging a culture of continuous improvement. Derek was an incredible asset at Primum and I would jump at the opportunity to work with him again in the future!",
  },
  {
    id: 3,
    name: "Tori Bonagura",
    title: "UI/UX Designer",
    image: toriImage,
    comment:
      "Derek is an extremely talented engineer and an advocate not just for product users, but also for the people building the product. During our time at Primum, Derek and I worked closely on a small team to build a flexible design system to power our new cross-functional web app.\n\nDerek consistently advocated for doing the upfront work to keep our team in a good position down the line. Additionally, as we started building the experience, Derek always advocated for the user, going beyond the basic flows to support fleshing out states, transitions, and moments of joy — often adding improvements and suggestions along the way. He has a keen attention to detail and truly brings a designer’s vision to life accurately and accessibly.\n\nDerek has a deep wealth of knowledge both in engineering and in life, and he has a knack for breaking down complex terms and concepts so our team could explore new workflows, improve skills, and find better ways of working. He led an internal recurring meeting on ways to practice positive psychology and is quick to practice what he teaches.\n\nHe consistently gives positive recognition to his team and was a big advocate for creating connection in a remote space — I’ll especially miss his movie recommendations each week! To sum it all up, Derek would be an ideal candidate for a company looking to get things done the right way.",
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
      "Dr. Derek Austin is an exceptional engineering manager who fosters a positive and growth-oriented environment for his team. I had the pleasure of working under his leadership for almost a year as a full-stack developer.\n\nDr. Austin’s guidance was instrumental in helping me develop my problem-solving skills. While working on the Primum cross-platform application, his insights always helped us overcome critical technical hurdles and ultimately deliver the features on time.\n\nDr. Austin is a highly skilled communicator who excels at delegating tasks and motivating his team members. I highly recommend Dr. Austin to anyone seeking a talented and inspiring engineering manager.",
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

export type PortfolioProject = {
  projectTitle: string
  summary: string
  details: string
  tech: string[]
  liveUrl: string
  sourceUrl: string
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    projectTitle: "What Are Your Values, Mapache?",
    summary:
      "A fast values game that turns 83 human values into 3,403 possible one-on-one decisions.",
    details:
      "One TypeScript monorepo supports iOS, Android, mobile web, and desktop web. XState actors keep matchups, input, queueing, XP awards, and offline saves deterministic across platforms.",
    tech: [
      "Next.js",
      "TypeScript",
      "XState",
      "Expo",
      "React Native",
      "Turborepo",
    ],
    liveUrl: "https://what-are-your-values-mapache.doctorderek.com/",
    sourceUrl: "https://github.com/DoctorDerek/what-are-your-values-mapache",
  },
  {
    projectTitle: "CRM",
    summary:
      "An offline-first contact manager with state-driven CRUD, age filtering, and no account required.",
    details:
      "XState owns create, update, delete, and reset transitions; local storage preserves contacts; React Hook Form and Headless UI drive responsive, accessible editing dialogs.",
    tech: ["Next.js", "TypeScript", "XState", "Tailwind CSS"],
    liveUrl: "https://portfolio-crm.doctorderek.com/",
    sourceUrl: "https://github.com/DoctorDerek/doctorderek-portfolio-crm",
  },
  {
    projectTitle: "Calendar",
    summary:
      "A responsive calendar for scheduling, color-coding, and reviewing time-ordered reminders.",
    details:
      "Redux Toolkit separates reminder, agenda, dialog, and display state while Material UI and Day.js power date-time entry, month navigation, daily agendas, and optional hour labels.",
    tech: ["Next.js", "TypeScript", "Redux Toolkit", "Material UI"],
    liveUrl: "https://portfolio-calendar.doctorderek.com/",
    sourceUrl: "https://github.com/DoctorDerek/doctorderek-portfolio-calendar",
  },
  {
    projectTitle: "Weather",
    summary:
      "An accessible city weather search with explicit loading, success, and failure states.",
    details:
      "The Next.js App Router keeps the OpenWeather API key server-side, validates untrusted responses, and turns missing cities or service failures into clear, screen-reader-friendly feedback.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "OpenWeather API"],
    liveUrl: "https://portfolio-weather.doctorderek.com/",
    sourceUrl: "https://github.com/DoctorDerek/doctorderek-portfolio-weather",
  },
  {
    projectTitle: "Pokédex",
    summary:
      "A statically generated field guide for browsing the original 151 Pokémon.",
    details:
      "Next.js prebuilds all 151 detail routes from typed GraphQL data, with ten-entry catalog pages and panels for classification, size, combat, weaknesses, and resistances.",
    tech: ["Next.js", "TypeScript", "GraphQL", "React Query"],
    liveUrl: "https://portfolio-pokedex.doctorderek.com/",
    sourceUrl: "https://github.com/DoctorDerek/doctorderek-portfolio-pokedex",
  },
  {
    projectTitle: "DoctorDerek.com",
    summary:
      "The site you’re using now: a cinematic portfolio built around motion, depth, and fast access to real work.",
    details:
      "XState coordinates global UI timing while fullPage.js, Motion, Rive, and Canvas render the visual system; the Next.js server reads and cleans the live Medium feed.",
    tech: ["Next.js", "TypeScript", "XState", "Motion", "Rive"],
    liveUrl: "https://www.doctorderek.com/",
    sourceUrl: "https://github.com/DoctorDerek/DoctorDerek.com",
  },
] as const
