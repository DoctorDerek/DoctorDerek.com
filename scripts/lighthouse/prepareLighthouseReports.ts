import fs from "node:fs"
import path from "node:path"

export type LighthouseScores = {
  performance: number
  accessibility: number
  bestPractices: number
  seo: number
}

type LighthouseManifestEntry = {
  htmlPath: string
  jsonPath: string
}

type LighthouseRun = {
  lighthouseResult: unknown
  manifestEntry: LighthouseManifestEntry
  manifestIndex: number
  performanceScore: number
}

type PrepareLighthouseReportsOptions = {
  publishedDirectory?: string
  resultsDirectory: string
  sensitiveValue?: string
}

type PreviewLighthouseCommentOptions = {
  actionsRunUrl: string
  previewScores: LighthouseScores
  previewUrl: string
  productionReportUrl: string
  productionScores?: LighthouseScores
}

type FailedPreviewLighthouseCommentOptions = {
  actionsRunUrl: string
  previewUrl: string
  runnerOutput: string
  sensitiveValue?: string
}

const LIGHTHOUSE_CATEGORIES = [
  {
    categoryId: "performance",
    label: "Performance",
    scoreName: "performance",
  },
  {
    categoryId: "accessibility",
    label: "Accessibility",
    scoreName: "accessibility",
  },
  {
    categoryId: "best-practices",
    label: "Best Practices",
    scoreName: "bestPractices",
  },
  { categoryId: "seo", label: "SEO", scoreName: "seo" },
] as const

const PREVIEW_LIGHTHOUSE_HEADER = "### 🔦 Mobile Web Lighthouse Measurements"
const PREVIEW_LIGHTHOUSE_QUALITY_POSITION = "**Quality check 4 of 4**"
const MAXIMUM_RUNNER_OUTPUT_CHARACTERS = 4_000
const LIGHTHOUSE_BADGE_BASE_URL = "https://img.shields.io/badge"
const LIGHTHOUSE_BADGE_QUERY = "logo=lighthouse&logoColor=white"

const isUnknownRecord = (
  value: unknown,
): value is { [propertyName: string]: unknown } =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const readJsonFile = (filePath: string): unknown =>
  JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown

const parseManifestEntry = (
  value: unknown,
  manifestIndex: number,
): LighthouseManifestEntry => {
  if (!isUnknownRecord(value))
    throw new Error(`Lighthouse manifest entry ${manifestIndex} is invalid.`)

  const { htmlPath, jsonPath } = value

  if (typeof htmlPath !== "string" || typeof jsonPath !== "string")
    throw new Error(
      `Lighthouse manifest entry ${manifestIndex} is missing report paths.`,
    )

  return { htmlPath, jsonPath }
}

const readLighthouseManifest = (
  resultsDirectory: string,
): LighthouseManifestEntry[] => {
  const manifest = readJsonFile(path.join(resultsDirectory, "manifest.json"))

  if (!Array.isArray(manifest))
    throw new Error("Lighthouse manifest must contain an array of runs.")

  return manifest.map(parseManifestEntry)
}

const getNumericCategoryScore = (
  lighthouseResult: unknown,
  categoryId: string,
) => {
  if (!isUnknownRecord(lighthouseResult))
    throw new Error("Lighthouse returned an invalid result.")

  const { categories } = lighthouseResult

  if (!isUnknownRecord(categories))
    throw new Error("Lighthouse result is missing categories.")

  const category = categories[categoryId]

  if (!isUnknownRecord(category) || typeof category.score !== "number")
    throw new Error(`Lighthouse did not return a numeric ${categoryId} score.`)

  return category.score
}

const replaceSensitiveValue = (filePath: string, sensitiveValue: string) => {
  const originalContents = fs.readFileSync(filePath, "utf8")

  if (!originalContents.includes(sensitiveValue)) return

  fs.writeFileSync(
    filePath,
    originalContents.replaceAll(sensitiveValue, "[REDACTED]"),
  )
}

export const redactSensitiveLighthouseArtifacts = (
  resultsDirectory: string,
  sensitiveValue?: string,
) => {
  if (!sensitiveValue || !fs.existsSync(resultsDirectory)) return

  for (const directoryEntry of fs.readdirSync(resultsDirectory, {
    withFileTypes: true,
  })) {
    if (!directoryEntry.isFile()) continue

    replaceSensitiveValue(
      path.join(resultsDirectory, directoryEntry.name),
      sensitiveValue,
    )
  }
}

export const selectMedianPerformanceRun = (lighthouseRuns: LighthouseRun[]) => {
  const sortedRuns = [...lighthouseRuns].sort(
    (leftRun, rightRun) =>
      leftRun.performanceScore - rightRun.performanceScore ||
      leftRun.manifestIndex - rightRun.manifestIndex,
  )
  const medianRun = sortedRuns[Math.floor(sortedRuns.length / 2)]

  if (!medianRun)
    throw new Error("Lighthouse did not return any completed runs.")

  return medianRun
}

export const extractLighthouseScores = (
  lighthouseResult: unknown,
): LighthouseScores =>
  Object.fromEntries(
    LIGHTHOUSE_CATEGORIES.map(({ categoryId, scoreName }) => [
      scoreName,
      Math.round(getNumericCategoryScore(lighthouseResult, categoryId) * 100),
    ]),
  ) as LighthouseScores

export const parseLighthouseScores = (value: unknown): LighthouseScores => {
  if (!isUnknownRecord(value))
    throw new Error("Published Lighthouse scores are invalid.")

  const scores = LIGHTHOUSE_CATEGORIES.map(({ scoreName }) => value[scoreName])

  if (scores.some((score) => typeof score !== "number"))
    throw new Error("Published Lighthouse scores are incomplete.")

  return {
    performance: value.performance as number,
    accessibility: value.accessibility as number,
    bestPractices: value.bestPractices as number,
    seo: value.seo as number,
  }
}

export const fetchPublishedLighthouseScores = async (
  scoresUrl: string,
  fetchScores: typeof fetch = fetch,
) => {
  try {
    const response = await fetchScores(scoresUrl)

    if (!response.ok) return undefined

    return parseLighthouseScores((await response.json()) as unknown)
  } catch {
    return undefined
  }
}

export const prepareLighthouseReports = ({
  publishedDirectory,
  resultsDirectory,
  sensitiveValue,
}: PrepareLighthouseReportsOptions) => {
  redactSensitiveLighthouseArtifacts(resultsDirectory, sensitiveValue)

  const lighthouseRuns = readLighthouseManifest(resultsDirectory).map(
    (manifestEntry, manifestIndex): LighthouseRun => {
      const lighthouseResult = readJsonFile(manifestEntry.jsonPath)

      return {
        lighthouseResult,
        manifestEntry,
        manifestIndex,
        performanceScore: getNumericCategoryScore(
          lighthouseResult,
          "performance",
        ),
      }
    },
  )
  const medianRun = selectMedianPerformanceRun(lighthouseRuns)
  const scores = extractLighthouseScores(medianRun.lighthouseResult)
  const serializedScores = `${JSON.stringify(scores, null, 2)}\n`

  fs.writeFileSync(
    path.join(resultsDirectory, "lighthouse-summary.json"),
    serializedScores,
  )

  if (publishedDirectory) {
    fs.mkdirSync(publishedDirectory, { recursive: true })
    fs.copyFileSync(
      medianRun.manifestEntry.htmlPath,
      path.join(publishedDirectory, "index.html"),
    )
    fs.writeFileSync(
      path.join(publishedDirectory, "lighthouse-results.json"),
      serializedScores,
    )
  }

  return scores
}

const formatScoreDelta = (previewScore: number, productionScore: number) => {
  const difference = previewScore - productionScore

  if (difference > 0) return `+${difference}`
  if (difference < 0) return `−${Math.abs(difference)}`
  return "0"
}

const encodeShieldsPathSegment = (value: string) =>
  encodeURIComponent(value.replaceAll("_", "__").replaceAll("-", "--"))

const formatScoreBadge = (
  environment: "Preview" | "Production",
  label: string,
  reportUrl: string,
  score?: number,
) => {
  const badgeMessage = score === undefined ? "unavailable" : `${score}/100`
  const badgeColor = score === undefined ? "lightgrey" : "informational"
  const badgeUrl = `${LIGHTHOUSE_BADGE_BASE_URL}/${encodeShieldsPathSegment(label)}-${encodeShieldsPathSegment(badgeMessage)}-${badgeColor}?${LIGHTHOUSE_BADGE_QUERY}`
  const alternativeText =
    score === undefined
      ? `${environment} ${label}: unavailable`
      : `${environment} ${label}: ${score} out of 100`

  return `[![${alternativeText}](${badgeUrl})](${reportUrl})`
}

const formatScoreBadges = (
  environment: "Preview" | "Production",
  reportUrl: string,
  scores?: LighthouseScores,
) =>
  LIGHTHOUSE_CATEGORIES.map(({ label, scoreName }) =>
    formatScoreBadge(environment, label, reportUrl, scores?.[scoreName]),
  ).join(" ")

const formatScoreDeltas = (
  previewScores: LighthouseScores,
  productionScores?: LighthouseScores,
) =>
  LIGHTHOUSE_CATEGORIES.map(({ label, scoreName }) => {
    const productionScore = productionScores?.[scoreName]

    return productionScore === undefined
      ? `${label} unavailable`
      : `${label} ${formatScoreDelta(previewScores[scoreName], productionScore)}`
  }).join(" · ")

export const formatPreviewLighthouseComment = ({
  actionsRunUrl,
  previewScores,
  previewUrl,
  productionReportUrl,
  productionScores,
}: PreviewLighthouseCommentOptions) => `${PREVIEW_LIGHTHOUSE_HEADER}

${PREVIEW_LIGHTHOUSE_QUALITY_POSITION}

✅ **Mobile Web Lighthouse completed successfully.**

**Preview — median of 3 runs**

${formatScoreBadges("Preview", `${actionsRunUrl}#artifacts`, previewScores)}

**Production baseline — median of 5 runs**

${formatScoreBadges("Production", productionReportUrl, productionScores)}

**Preview − Production:** ${formatScoreDeltas(previewScores, productionScores)}

Scores are advisory measurements, not merge thresholds.

[Open preview deployment](${previewUrl}) · [Download complete Preview reports](${actionsRunUrl}#artifacts) · [Open latest Production report](${productionReportUrl})`

export const formatFailedPreviewLighthouseComment = ({
  actionsRunUrl,
  previewUrl,
  runnerOutput,
  sensitiveValue,
}: FailedPreviewLighthouseCommentOptions) => {
  const redactedRunnerOutput = sensitiveValue
    ? runnerOutput.replaceAll(sensitiveValue, "[REDACTED]")
    : runnerOutput
  const cleanRunnerOutput = redactedRunnerOutput
    .replace(/\u001b\[[0-9;]*m/g, "")
    .trim()
    .slice(-MAXIMUM_RUNNER_OUTPUT_CHARACTERS)
  const outputBlock = cleanRunnerOutput
    ? `\n\n\`\`\`text\n${cleanRunnerOutput}\n\`\`\``
    : ""

  return `${PREVIEW_LIGHTHOUSE_HEADER}

${PREVIEW_LIGHTHOUSE_QUALITY_POSITION}

❌ **Mobile Web Lighthouse could not obtain a measurement.**${outputBlock}

[Open preview deployment](${previewUrl}) · [Inspect workflow run](${actionsRunUrl})`
}
