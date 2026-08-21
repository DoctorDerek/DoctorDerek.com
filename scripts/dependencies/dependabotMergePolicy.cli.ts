import fs from "node:fs"
import {
  evaluateDependabotMergeCandidate,
  type DependabotMergeCandidate,
} from "@/scripts/dependencies/dependabotMergePolicy"

const getRequiredEnvironmentVariable = (name: string) => {
  const value = process.env[name]

  if (!value) throw new Error(`${name} is required.`)

  return value
}

const parseBooleanEnvironmentVariable = (name: string) => {
  const value = getRequiredEnvironmentVariable(name)

  if (value !== "true" && value !== "false")
    throw new Error(`${name} must be true or false.`)

  return value === "true"
}

const parseStringArrayEnvironmentVariable = (name: string) => {
  const parsedValue: unknown = JSON.parse(getRequiredEnvironmentVariable(name))

  if (!Array.isArray(parsedValue))
    throw new Error(`${name} must be a JSON string array.`)

  return parsedValue.map((value: unknown) => {
    if (typeof value !== "string")
      throw new Error(`${name} must be a JSON string array.`)

    return value
  })
}

const candidate: DependabotMergeCandidate = {
  authorLogin: getRequiredEnvironmentVariable("DEPENDABOT_AUTHOR_LOGIN"),
  baseBranch: getRequiredEnvironmentVariable("DEPENDABOT_BASE_BRANCH"),
  changedFiles: parseStringArrayEnvironmentVariable(
    "DEPENDABOT_CHANGED_FILES_JSON",
  ),
  headBranch: getRequiredEnvironmentVariable("DEPENDABOT_HEAD_BRANCH"),
  isDraft: parseBooleanEnvironmentVariable("DEPENDABOT_IS_DRAFT"),
  mergeableState: getRequiredEnvironmentVariable("DEPENDABOT_MERGEABLE_STATE"),
  pullRequestState: getRequiredEnvironmentVariable(
    "DEPENDABOT_PULL_REQUEST_STATE",
  ),
  successfulWorkflowNames: parseStringArrayEnvironmentVariable(
    "DEPENDABOT_SUCCESSFUL_WORKFLOWS_JSON",
  ),
}
const decision = evaluateDependabotMergeCandidate(candidate)
const githubOutputPath = getRequiredEnvironmentVariable("GITHUB_OUTPUT")
const githubStepSummaryPath = getRequiredEnvironmentVariable(
  "GITHUB_STEP_SUMMARY",
)

fs.appendFileSync(
  githubOutputPath,
  `eligible=${decision.eligible}\nreason=${decision.reason}\ndetails=${JSON.stringify(decision.details)}\n`,
)
fs.appendFileSync(
  githubStepSummaryPath,
  `### Dependabot Safe Update Merge\n\n- Eligible: ${decision.eligible}\n- Decision: ${decision.reason}\n- Details: ${decision.details.join(", ") || "None"}\n`,
)
