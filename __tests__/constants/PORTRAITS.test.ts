import { describe, expect, it } from "vitest"
import {
  ABOUT_PORTRAITS,
  CONTACT_COLLAGE_PORTRAITS,
  CONTACT_PORTRAIT,
  DISPLAYED_PORTRAITS,
  FAVICON_PORTRAIT,
  PORTRAIT_LIBRARY,
  UNASSIGNED_PORTRAITS,
} from "@/constants/PORTRAITS"

const APPROVED_SOURCE_FILENAMES = [
  "Pixtore-03145.jpg",
  "Pixtore-03155.jpg",
  "Pixtore-03165.jpg",
  "Pixtore-03215.jpg",
  "Pixtore-03345.jpg",
  "Pixtore-03349.jpg",
  "Pixtore-03354.jpg",
  "Pixtore-03359.jpg",
  "Pixtore-03361.jpg",
  "Pixtore-03373.jpg",
  "Pixtore-03374.jpg",
] as const

const getSourceFilenames = (
  portraits: readonly { sourceFilename: string }[],
) => portraits.map(({ sourceFilename }) => sourceFilename)

describe("portrait catalog", () => {
  it("catalogs every approved source portrait once", () => {
    const sourceFilenames = getSourceFilenames(PORTRAIT_LIBRARY)

    expect(PORTRAIT_LIBRARY).toHaveLength(11)
    expect(new Set(sourceFilenames).size).toBe(11)
    expect(sourceFilenames.toSorted()).toEqual(APPROVED_SOURCE_FILENAMES)
  })

  it("assigns a unique portrait to every live image slot", () => {
    const displayedSourceFilenames = getSourceFilenames(DISPLAYED_PORTRAITS)

    expect(ABOUT_PORTRAITS).toHaveLength(4)
    expect(CONTACT_COLLAGE_PORTRAITS).toHaveLength(3)
    expect(DISPLAYED_PORTRAITS).toHaveLength(8)
    expect(new Set(displayedSourceFilenames).size).toBe(8)
    expect(displayedSourceFilenames).toContain(CONTACT_PORTRAIT.sourceFilename)
  })

  it("keeps the remaining portraits available without duplicating the catalog", () => {
    const displayedSourceFilenames = getSourceFilenames(DISPLAYED_PORTRAITS)
    const unassignedSourceFilenames = getSourceFilenames(UNASSIGNED_PORTRAITS)

    expect(UNASSIGNED_PORTRAITS).toHaveLength(3)
    expect(
      new Set([...displayedSourceFilenames, ...unassignedSourceFilenames]).size,
    ).toBe(PORTRAIT_LIBRARY.length)
  })

  it("defines the fixed one-over-two Contact mosaic", () => {
    expect(
      CONTACT_COLLAGE_PORTRAITS.map(({ layoutClassName }) => layoutClassName),
    ).toEqual(["col-span-2", "", ""])
  })

  it("deliberately reuses the strongest headshot for the favicon", () => {
    expect(FAVICON_PORTRAIT).toBe(ABOUT_PORTRAITS[0])
    expect(FAVICON_PORTRAIT.sourceFilename).toBe("Pixtore-03349.jpg")
  })
})
