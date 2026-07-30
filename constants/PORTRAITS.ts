import type { StaticImageData } from "next/image"
import redPoloStandingImage from "@/images/portraits/derek-austin-03145-red-polo-standing.webp"
import redPoloLeaningImage from "@/images/portraits/derek-austin-03155-red-polo-leaning.webp"
import redPoloRelaxedImage from "@/images/portraits/derek-austin-03165-red-polo-relaxed.webp"
import yellowPoloSeatedImage from "@/images/portraits/derek-austin-03215-yellow-polo-seated.webp"
import purplePoloSmileImage from "@/images/portraits/derek-austin-03345-purple-polo-smile.webp"
import purplePoloHeadshotImage from "@/images/portraits/derek-austin-03349-purple-polo-headshot.webp"
import purplePoloThoughtfulImage from "@/images/portraits/derek-austin-03354-purple-polo-thoughtful.webp"
import purplePoloStandingImage from "@/images/portraits/derek-austin-03359-purple-polo-standing.webp"
import purplePoloCelebratingImage from "@/images/portraits/derek-austin-03361-purple-polo-celebrating.webp"
import purplePoloProfileImage from "@/images/portraits/derek-austin-03373-purple-polo-profile.webp"
import purplePoloAlternateProfileImage from "@/images/portraits/derek-austin-03374-purple-polo-profile.webp"

type Portrait = {
  alt: string
  objectPosition: string
  sourceFilename: string
  src: StaticImageData
}

type ContactCollagePortrait = Portrait & {
  layoutClassName: string
  sizes: string
}

export const PORTRAIT_CONTROL_ACCESSIBLE_NAMES = {
  about: "Show next portrait of Dr. Derek Austin",
  contact: "Flip portrait of Dr. Derek Austin",
} as const

export const PORTRAIT_IMAGE_SIZES = {
  about: "(max-width: 767px) 52vw, (max-width: 1023px) 45vw, 40.5vw",
  contactFull: "(max-width: 767px) 43vw, 488px",
  contactHalf: "(max-width: 767px) 22vw, 244px",
} as const

const redPoloStandingPortrait = {
  alt: "Dr. Derek Austin standing by the ocean in a red polo",
  objectPosition: "63% 50%",
  sourceFilename: "Pixtore-03145.jpg",
  src: redPoloStandingImage,
} satisfies Portrait

const redPoloLeaningPortrait = {
  alt: "Dr. Derek Austin leaning against a wooden post in a red polo",
  objectPosition: "58% 48%",
  sourceFilename: "Pixtore-03155.jpg",
  src: redPoloLeaningImage,
} satisfies Portrait

const redPoloRelaxedPortrait = {
  alt: "Dr. Derek Austin smiling by the ocean in a red polo",
  objectPosition: "62% 52%",
  sourceFilename: "Pixtore-03165.jpg",
  src: redPoloRelaxedImage,
} satisfies Portrait

const yellowPoloSeatedPortrait = {
  alt: "Dr. Derek Austin smiling beside the water in a yellow polo",
  layoutClassName: "",
  objectPosition: "67% 50%",
  sizes: PORTRAIT_IMAGE_SIZES.contactHalf,
  sourceFilename: "Pixtore-03215.jpg",
  src: yellowPoloSeatedImage,
} satisfies ContactCollagePortrait

const purplePoloSmilePortrait = {
  alt: "Dr. Derek Austin smiling by the ocean in a purple polo",
  objectPosition: "55% 50%",
  sourceFilename: "Pixtore-03345.jpg",
  src: purplePoloSmileImage,
} satisfies Portrait

const purplePoloHeadshotPortrait = {
  alt: "Dr. Derek Austin smiling in a purple polo",
  objectPosition: "50% 45%",
  sourceFilename: "Pixtore-03349.jpg",
  src: purplePoloHeadshotImage,
} satisfies Portrait

const purplePoloThoughtfulPortrait = {
  alt: "Dr. Derek Austin posing thoughtfully in a purple polo",
  objectPosition: "50% 45%",
  sourceFilename: "Pixtore-03354.jpg",
  src: purplePoloThoughtfulImage,
} satisfies Portrait

const purplePoloStandingPortrait = {
  alt: "Dr. Derek Austin standing by the ocean in a purple polo",
  objectPosition: "65% 50%",
  sourceFilename: "Pixtore-03359.jpg",
  src: purplePoloStandingImage,
} satisfies Portrait

const purplePoloCelebratingPortrait = {
  alt: "Dr. Derek Austin celebrating by the ocean in a purple polo",
  layoutClassName: "col-span-2",
  objectPosition: "55% 49%",
  sizes: PORTRAIT_IMAGE_SIZES.contactFull,
  sourceFilename: "Pixtore-03361.jpg",
  src: purplePoloCelebratingImage,
} satisfies ContactCollagePortrait

const purplePoloProfilePortrait = {
  alt: "Dr. Derek Austin in a thoughtful three-quarter portrait",
  layoutClassName: "",
  objectPosition: "50% 60%",
  sizes: PORTRAIT_IMAGE_SIZES.contactHalf,
  sourceFilename: "Pixtore-03373.jpg",
  src: purplePoloProfileImage,
} satisfies ContactCollagePortrait

const purplePoloAlternateProfilePortrait = {
  alt: "Dr. Derek Austin in a confident three-quarter portrait",
  objectPosition: "50% 57%",
  sourceFilename: "Pixtore-03374.jpg",
  src: purplePoloAlternateProfileImage,
} satisfies Portrait

export const ABOUT_PORTRAITS = [
  purplePoloHeadshotPortrait,
  purplePoloThoughtfulPortrait,
  purplePoloStandingPortrait,
  purplePoloAlternateProfilePortrait,
] as const

export const CONTACT_PORTRAIT = purplePoloSmilePortrait

export const CONTACT_COLLAGE_PORTRAITS = [
  purplePoloCelebratingPortrait,
  purplePoloProfilePortrait,
  yellowPoloSeatedPortrait,
] as const

export const DISPLAYED_PORTRAITS = [
  ...ABOUT_PORTRAITS,
  CONTACT_PORTRAIT,
  ...CONTACT_COLLAGE_PORTRAITS,
] as const

export const UNASSIGNED_PORTRAITS = [
  redPoloStandingPortrait,
  redPoloLeaningPortrait,
  redPoloRelaxedPortrait,
] as const

export const PORTRAIT_LIBRARY = [
  ...DISPLAYED_PORTRAITS,
  ...UNASSIGNED_PORTRAITS,
] as const

export const FAVICON_PORTRAIT = purplePoloHeadshotPortrait
