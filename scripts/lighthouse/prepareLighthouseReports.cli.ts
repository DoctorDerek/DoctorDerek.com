import fs from "node:fs"
import path from "node:path"
import {
  fetchPublishedLighthouseScores,
  formatFailedPreviewLighthouseComment,
  formatPreviewLighthouseComment,
  prepareLighthouseReports,
  redactSensitiveLighthouseArtifacts,
} from "@/scripts/lighthouse/prepareLighthouseReports"

const resultsDirectory = path.resolve(
  process.env.LIGHTHOUSE_RESULTS_DIRECTORY ?? "lighthouse-results",
)
const publishedDirectory = process.env.LIGHTHOUSE_PUBLISHED_DIRECTORY
  ? path.resolve(process.env.LIGHTHOUSE_PUBLISHED_DIRECTORY)
  : undefined
const commentFile = process.env.LIGHTHOUSE_COMMENT_FILE
const previewUrl = process.env.LIGHTHOUSE_TARGET_URL
const actionsRunUrl = process.env.LIGHTHOUSE_ACTIONS_RUN_URL
const lighthouseExitCode = Number.parseInt(
  process.env.LIGHTHOUSE_EXIT_CODE ?? "0",
  10,
)

const readRunnerOutput = () => {
  const runnerOutputPath = process.env.LIGHTHOUSE_OUTPUT_FILE

  return runnerOutputPath && fs.existsSync(runnerOutputPath)
    ? fs.readFileSync(runnerOutputPath, "utf8")
    : ""
}

const writeFailedPreviewComment = (runnerOutput: string) => {
  if (!commentFile || !previewUrl || !actionsRunUrl) return

  fs.writeFileSync(
    commentFile,
    formatFailedPreviewLighthouseComment({
      actionsRunUrl,
      previewUrl,
      runnerOutput,
    }),
  )
}

const redactPreviewArtifacts = () =>
  redactSensitiveLighthouseArtifacts(
    resultsDirectory,
    process.env.LIGHTHOUSE_VERCEL_TRUSTED_OIDC_TOKEN,
  )

try {
  if (commentFile && previewUrl && actionsRunUrl && lighthouseExitCode !== 0) {
    redactPreviewArtifacts()
    writeFailedPreviewComment(readRunnerOutput())
  } else {
    const previewScores = prepareLighthouseReports({
      publishedDirectory,
      resultsDirectory,
      sensitiveValue: process.env.LIGHTHOUSE_VERCEL_TRUSTED_OIDC_TOKEN,
    })

    if (commentFile && previewUrl && actionsRunUrl) {
      const productionScoresUrl = process.env.LIGHTHOUSE_PRODUCTION_SCORES_URL
      const productionReportUrl = process.env.LIGHTHOUSE_PRODUCTION_REPORT_URL
      const productionScores = productionScoresUrl
        ? await fetchPublishedLighthouseScores(productionScoresUrl)
        : undefined

      fs.writeFileSync(
        commentFile,
        formatPreviewLighthouseComment({
          actionsRunUrl,
          previewScores,
          previewUrl,
          productionReportUrl:
            productionReportUrl ?? productionScoresUrl ?? actionsRunUrl,
          productionScores,
        }),
      )
    }
  }
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const runnerOutput = [readRunnerOutput(), errorMessage]
    .filter(Boolean)
    .join("\n")

  redactPreviewArtifacts()
  writeFailedPreviewComment(runnerOutput)
  process.stderr.write(`${errorMessage}\n`)
  process.exitCode = 1
}
