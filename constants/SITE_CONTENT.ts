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
  subtext: "Also available: $5,000 USD anchor point for a custom GDD for AI Master Template.",
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