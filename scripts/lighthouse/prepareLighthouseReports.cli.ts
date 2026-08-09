import fs from "node:fs"
import path from "node:path"
import {
  fetchPublishedLighthouseScores,
  formatFailedPreviewLighthouseComment,
  formatPreviewLighthouseComment,
  prepareLighthouseReports,
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

if (commentFile && previewUrl && actionsRunUrl && lighthouseExitCode !== 0) {
  const runnerOutputPath = process.env.LIGHTHOUSE_OUTPUT_FILE
  const runnerOutput = runnerOutputPath
    ? fs.readFileSync(runnerOutputPath, "utf8")
    : ""

  fs.writeFileSync(
    commentFile,
    formatFailedPreviewLighthouseComment({
      actionsRunUrl,
      previewUrl,
      runnerOutput,
    }),
  )
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
