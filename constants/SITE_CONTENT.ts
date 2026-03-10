export const INTRO_BIO_SHORT =
  "Indie Game Dev · AI Context Engineer · I teach LLMs to think · Full-Stack SWE since 2005 · BS & MS in Bioinformatics at age 19 · Doctor of Physical Therapy" as const

export const ABOUT_BIO_LONG: string[] = [
  "I’m Dr. Derek Austin, an indie game dev and AI context engineer who uses LLMs all day every day to build video games. To work faster, I teach large language models how to think, which is what I blog about here on Medium.",
  "Like everyone, my interactions with LLMs have been frustrating. With their tiny system prompts and content filters, they’re just gaslighting text generators useful primarily to spammers and idiots.",
  "But I’m too stubborn to just accept a tool’s limitations, so I engineered the solution.",
  "After more than 2,000 hours of obsessive work—exchanging over 15-20+ million tokens with these reasoning models—I invented a new discipline: Context Engineering to architect Human-AI Cognitive Systems.",
  "It’s the practice of architecting the deep context and cognitive frameworks that guide an AI beyond simple pattern-matching into genuine, high-level reasoning.",
  "This work isn’t magic or BS. It’s the frontier of human-AI interaction.",
  "My journey started in 2005 as a Full-Stack Software Engineer, and now I’ve spent more than two decades learning to build and deconstruct complex systems from the ground up.",
  "That engineering experience is informed by a Bachelor’s and Master’s in Science in Bioinformatics with a Computer Science concentration, which taught me to find clear signals in the noise of massive datasets.",
  "I even spent a decade working in sports medicine while I built apps and engineered processes as a consultant on the side. During that time, I obtained my Doctorate in Physical Therapy. The clinic trained me to diagnose and treat complex human systems while respecting patients’ autonomy and psychology, not just anatomy and physiology.",
  "Each discipline gave me a piece of the puzzle for how to teach AI to think.",
  "Today, I no longer work for others. Instead, I’ve built a life of autonomy and deep work in Puebla, Mexico, with my amazing wife, Abby. ❤️",
  "At the end of the day, architecting AI cognition systems is just a means to an end for me, since my real full-time “job” is as a solo indie game dev.",
  "That means all day I’m developing full-stack apps with world-class UI / UX powered by Next.js, TypeScript, and Tailwind CSS — for my web games — and Godot (GDScript + C#) for my higher-demand games for Steam Deck.",
  "Meanwhile, my two cats, Louie and Yuma, lick each other.",
  "I write about my entire journey right here on Medium, along with my best systems insights for success as a remote software or AI engineer. Thank you for reading!",
] as const

export type AiConsultancyPitch = {
  header: string
  body: string
  ctaButtonText: string
  subtext: string
  emailSubject: string
}

export const AI_CONSULTANCY_PITCH: AiConsultancyPitch = {
  header: "AI Evaluation Service",
  body: "I offer a max-autonomy, lowest-friction, most-info-dense, most-useful genius service where I help people create “Constitutions” and “GDDs” for their AI agents. I provide elite prompt, context, persona, and cognitive engineering of LLMs for your specific tasks.",
  ctaButtonText: "Book a 20-Minute Async AI Audit - $500 USD",
  subtext:
    "Also available: $5,000 USD anchor point for a custom GDD for AI Master Template.",
  emailSubject: "AI Evaluation Consultancy",
} as const

export type WorkExperience = {
  duration: string
  position: string
  company: string
}

export const ARCHITECT_EVOLUTION: WorkExperience[] = [
  {
    duration: "2025–2026 (Today)",
    position: "Godot C# & GDScript",
    company: "AI Context Engineer (15-20+ Million Tokens Exchanged)",
  },
  {
    duration: "2020–2026",
    position: "React / Next.js + TypeScript + Tailwind CSS",
    company: "Lead Frontend SWE",
  },
  {
    duration: "2019–2020",
    position: "React, JavaScript, CSS",
    company: "React SWE",
  },
  {
    duration: "2009–2019",
    position: "HTML, CSS, JS",
    company: "Web Developer",
  },
  {
    duration: "2005–2009",
    position: "C++, PHP, HTML, CSS, Ruby on Rails",
    company: "Full-Stack SWE",
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

export type LegalDisclaimer = {
  aiDisclosure: string[]
  websiteDisclaimer: string[]
}

export const LEGAL_DISCLAIMER: LegalDisclaimer = {
  aiDisclosure: [
    "Hello fellow human! I’m Dr. Derek Austin. This website is NOT AI-generated slop.",
    "Voice/Writing: 100% Human (Me!). No AI dubbing or AI-generated text content.",
    "Visuals: Real photos (Unsplash, Unsplash+, and public domain) & LLM-assisted Python data visualizations. No AI images. No AI video.",
    "Script: 100% human-verified & edited. I use LLMs for polyglot research, data visualization, research synthesis, drafting assistance, fact-checking, pronunciation help, and proofreading.",
    "Please support real, human creators by liking & subscribing!",
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

export type LinkedInRecommendationTestimonial = {
  id: number
  name: string
  position: string
  comment: string
}

export const TESTIMONIALS: LinkedInRecommendationTestimonial[] = [
  {
    id: 1,
    name: "John Syme",
    position: "VC @ 53 Stations",
    comment:
      "It is my pleasure to recommend Derek. He and I have worked together since he started at [JOB], and I have always been impressed with his organization, communication, work product, and work ethic. As a co-founder of a startup, I have leaned on Derek’s strengths as an Engineering Manager, and I would like to highlight specific areas where Derek excels. 1 – Derek possesses strong organizational skills. Not only is Derek adept at managing his own engineering tasks, but he frequently supports other [JOB] developers as they breakdown problems. His ability to organize how to tackle a problem has helped improve the output of the entire engineering team while allowing junior engineers to gain confidence. He thinks systematically, creating processes that ensure smooth workflows, and he has built a [JOB] engineering system that will continue to live on. 2 – Derek’s strong communication skills are tied closely to his organized approach. He provides comprehensive information backed with research to help communicate points allowing the team to make good decisions more quickly. For example, when asked to present his thoughts on how the engineering team should grow, Derek laid out a clear, concise (yet comprehensive) presentation describing options and weighing pros / cons for each potential scenario. This presentation sped the time to decision which is critical in an early-stage startup. Derek demonstrates a strong ability to think through a problem or question deeply then communicate those points to others. 3 – Derek’s ability to think through problems deeply and then deliver high-quality work product makes him an asset to engineering teams. He is adept at writing tickets, planning work, and having a vision for how features should be built for continued improvement of the product. Derek researches technologies and architectures to ensure [JOB] doesn’t make missteps as we continue to improve on the product which will pay future dividends for our team. Derek also created a thoughtful, structured approach to career development for our junior software engineers. His system of mentoring based on Accountability, Accuracy, and Acceleration is something that has helped me better understand the performance and growth of our engineering hires. 4 – Derek can deliver high-quality work product because of his tremendous work ethic, and his commitment to accountability as a software engineer and manager. If he says that he will take on a piece of work, he takes it on and delivers a high-quality result. We asked Derek to step into the Engineer Manager role, and he grew into the role. He holds himself and his team accountable for product deliverables which means that [JOB] can deliver a high-quality tech product on a timely basis. As a leader, I can count on Derek to fully own the code development process, and I am impressed with his ability to put work down to jump on high-impact bugs solving them quickly with little interruption to our users.",
  },
  {
    id: 2,
    name: "Yosevu Kilonzo",
    position: "Senior Engineer – Full Stack Web and Mobile",
    comment:
      "I had the privilege of working with Derek for a year at [JOB]. He is one of the most dedicated and talented people I’ve worked with. He cares deeply about the projects he is a part of, as well as the success of the team and organization as whole. Derek’s commitment is reflected in his holistic approach to management and software development. He instilled a high level of ownership and accountability at [JOB], modeling high standards for those around him. His clear and direct verbal and written communication made it easier to know what was expected and helped to keep the team aligned and focused. One of the things that sets Derek apart is his expertise as both a technical manager and a highly productive engineer with a strong product sense. He is thoughtful with software architecture, the development process, and staying up to date with technologies, patterns, and best practices with React, Next.js, and TypeScript. This combination ensured efficiency and quality throughout our work together at [JOB], delivering our projects successfully and keeping our team performing at its best. In addition to his technical skills, Derek is also a valuable mentor. He is always ready to share his extensive knowledge and experience in software and provide constructive feedback. He created opportunities for growth that helped level up the skills of myself and other team members at [JOB], encouraging a culture of continuous improvement. Derek was an incredible asset at [JOB] and I would jump at the opportunity to work with him again in the future!",
  },
  {
    id: 3,
    name: "Tori Bonagura",
    position: "Design at Fay",
    comment:
      "Derek is an extremely talented engineer and an advocate not just for product users, but also for the people building the product. During our time at [JOB], Derek and I worked closely on a small team to build a flexible design system to power our new cross-functional web app. Derek consistently advocated for doing the upfront work to keep our team in a good position down the line. Additionally, as we started building the experience, Derek always advocated for the user, going beyond the basic flows to support fleshing out states, transitions, and moments of joy — often adding improvements and suggestions along the way. He has a keen attention to detail and truly brings a designer’s vision to life accurately and accessibly. Derek has a deep wealth of knowledge both in engineering and in life, and he has a knack for breaking down complex terms and concepts so our team could explore new workflows, improve skills, and find better ways of working. He led an internal recurring meeting on ways to practice positive psychology and is quick to practice what he teaches. He consistently gives positive recognition to his team and was a big advocate for creating connection in a remote space — I’ll especially miss his movie recommendations each week! To sum it all up, Derek would be an ideal candidate for a company looking to get things done the right way.",
  },
  {
    id: 4,
    name: "Pranjal Jain",
    position: "Full Stack Developer at [JOB]",
    comment:
      "Dr. Derek Austin is an exceptional engineering manager who fosters a positive and growth-oriented environment for his team. I had the pleasure of working under his leadership for almost a year as a full-stack developer. Dr. Austin’s guidance was instrumental in helping me develop my problem-solving skills. While working on the [JOB] cross-platform application, his insights always helped us overcome critical technical hurdles and ultimately deliver the features on time. Dr. Austin is a highly skilled communicator who excels at delegating tasks and motivating his team members. I highly recommend Dr. Austin to anyone seeking a talented and inspiring engineering manager.",
  },
  {
    id: 5,
    name: "Dan Haas, MS",
    position: "Software Engineer @ PayPal | Javascript, React, & Node.js",
    comment:
      "As a graduate of Nucamp Web Development Bootcamp who was in the process of finishing my second Bachelor’s, I knew I was right on the cusp of getting a great position as a front-end engineer. I asked for resume feedback in the Nucamp Slack community, and Dr. Derek Austin volunteered to provide me detailed notes on my resume and portfolio. His helpful attitude and enthusiasm impressed me, as I hadn’t been one of his students, so his mentoring really went above & beyond. His knowledge of both software engineering and personal marketing made an impact right away. After a few weeks of collaboration, I could better communicate my personal brand, and suddenly I was having much better results from my job hunt. Now that I’m working as a front end developer, I’ve had the chance to “pay it forward” and help other engineers with their own job hunts. I’d recommend Dr. Derek Austin for anyone needing a front-end developer, mentor, technical writer, or entrepreneur.",
  },
  {
    id: 6,
    name: "Steven Terner, PhD, CAMS",
    position:
      "Geopolitical Consultant | Middle East and Political Economics Analyst",
    comment:
      "Professional: Derek designed, built, and copy wrote two of my websites, including my new one. I had originally suggested a WordPress.com blog, which Derek designed and built out to my specifications. However, we agreed that my blog could reach a larger audience at Medium, so Derek redesigned and rebuilt the WordPress website. He came up with an impressive, original web design while significantly improving the website’s performance and mobile design. The WordPress site took over 12 seconds to load, but the new site loads in under 3 seconds. He even added a dark mode, which was a great touch. Derek remained enthusiastic about the project throughout, and went the extra mile to make sure the site was written with high-quality code and would rank well for SEO. His exceptional writing and ability to organize information really put my site over the top. I’ve already referred Derek to a colleague looking for a new website because I absolutely trust his problem solving and communication skills. I would genuinely recommend him to anyone looking for a web developer who’s also a great communicator. Personal: Derek and I have been friends since freshman year of high school, when he was 11. Even then, one of his biggest strengths was his ability to explain complex topics in simple terms. He’s not didactic or trying to teach, he’s just a natural educator. He’s also adventurous, creative, and always meticulously working on something cool and new. Ask him about his travels, his charity project, gaming, programming, web development, genetics, physical therapy, etc. He’s a fun dude who isn’t afraid to seize the day.",
  },
  {
    id: 7,
    name: "Anangsha Alammyan",
    position: "I Help AI Founders Hit $ goals with SEO & Content",
    comment:
      "I came across Dr. Derek’s articles on Medium and was always fascinated by how detailed and well-presented they were. He has fantastic writing skills that make it hard for a reader to stop reading once they started. I attended his talk at Momentum 2021, and even though I’m not an SEO geek, I found his talk incredibly valuable. It gave me a lot of things to think about when I write, and some important information about how to structure a headline that gives you clicks. Dr. Derek is also a fantastic editor. He edited an article that took me the longest time to write, and with his inputs, it became even better. If you’re ever looking for a technical writer, an editor, or an SEO specialist, I can’t recommend Dr. Derek enough.",
  },
]
