export const DEPENDENCY_MERGE_REQUIRED_WORKFLOWS = [
  "ESLint, Vitest, and XState Pipeline",
  "Dependency Security Review",
  "Playwright E2E Tests",
] as const

export type DependabotMergeCandidate = {
  authorLogin: string
  baseBranch: string
  changedFiles: readonly string[]
  headBranch: string
  isDraft: boolean
  mergeableState: string
  pullRequestState: string
  successfulWorkflowNames: readonly string[]
}

export type DependabotMergeDecisionReason =
  | "eligible"
  | "draft-pull-request"
  | "missing-required-workflow"
  | "no-changed-files"
  | "non-dependabot-author"
  | "pull-request-not-clean"
  | "pull-request-not-open"
  | "unexpected-base-branch"
  | "unexpected-file-change"
  | "unsafe-dependabot-group"

const npmDependencyPaths = new Set([
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
])
const githubActionsWorkflowPattern = /^\.github\/workflows\/[^/]+\.ya?ml$/
const safeDependabotGroupPattern =
  /^dependabot\/(npm_and_yarn|github_actions)\/safe-(?:version|security)-updates(?:-[a-z0-9]+)?$/

const denyDependabotMerge = (
  reason: Exclude<DependabotMergeDecisionReason, "eligible">,
  details: readonly string[] = [],
) => ({ details, eligible: false as const, reason })

const getDependabotDependencySurface = (headBranch: string) => {
  const groupMatch = safeDependabotGroupPattern.exec(headBranch)

  if (!groupMatch) return undefined

  return groupMatch[1] === "npm_and_yarn" ? "npm" : "github-actions"
}

const getUnexpectedChangedFiles = (
  dependencySurface: "github-actions" | "npm",
  changedFiles: readonly string[],
) =>
  changedFiles.filter((changedFile) =>
    dependencySurface === "npm"
      ? !npmDependencyPaths.has(changedFile)
      : !githubActionsWorkflowPattern.test(changedFile),
  )

export const evaluateDependabotMergeCandidate = (
  candidate: DependabotMergeCandidate,
) => {
  if (candidate.authorLogin !== "dependabot[bot]")
    return denyDependabotMerge("non-dependabot-author", [candidate.authorLogin])

  if (candidate.pullRequestState !== "open")
    return denyDependabotMerge("pull-request-not-open", [
      candidate.pullRequestState,
    ])

  if (candidate.isDraft) return denyDependabotMerge("draft-pull-request")

  if (candidate.baseBranch !== "main")
    return denyDependabotMerge("unexpected-base-branch", [candidate.baseBranch])

  const dependencySurface = getDependabotDependencySurface(candidate.headBranch)

  if (!dependencySurface)
    return denyDependabotMerge("unsafe-dependabot-group", [
      candidate.headBranch,
    ])

  if (candidate.mergeableState !== "clean")
    return denyDependabotMerge("pull-request-not-clean", [
      candidate.mergeableState,
    ])

  if (candidate.changedFiles.length === 0)
    return denyDependabotMerge("no-changed-files")

  const unexpectedChangedFiles = getUnexpectedChangedFiles(
    dependencySurface,
    candidate.changedFiles,
  )

  if (unexpectedChangedFiles.length > 0)
    return denyDependabotMerge("unexpected-file-change", unexpectedChangedFiles)

  const successfulWorkflowNames = new Set(candidate.successfulWorkflowNames)
  const missingRequiredWorkflows = DEPENDENCY_MERGE_REQUIRED_WORKFLOWS.filter(
    (requiredWorkflow) => !successfulWorkflowNames.has(requiredWorkflow),
  )

  if (missingRequiredWorkflows.length > 0)
    return denyDependabotMerge(
      "missing-required-workflow",
      missingRequiredWorkflows,
    )

  return {
    details: [] as const,
    eligible: true as const,
    reason: "eligible" as const,
  }
}
