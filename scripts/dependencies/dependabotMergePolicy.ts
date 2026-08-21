export const DEPENDENCY_MERGE_REQUIRED_CHECKS = [
  "Lint & Annotate PR",
  "Reject Newly Vulnerable Dependencies",
  "Playwright E2E Tests",
] as const

export type DependabotMergeCandidate = {
  authorLogin: string
  baseBranch: string
  changedFiles: readonly string[]
  hasSafeUpdateLabel: boolean
  headBranch: string
  isDraft: boolean
  mergeableState: string
  pullRequestState: string
  successfulCheckNames: readonly string[]
}

export type DependabotMergeDecisionReason =
  | "eligible"
  | "draft-pull-request"
  | "missing-required-check"
  | "no-changed-files"
  | "non-dependabot-author"
  | "pull-request-not-clean"
  | "pull-request-not-open"
  | "unexpected-base-branch"
  | "unexpected-file-change"
  | "unsafe-dependabot-group"
  | "unsafe-dependabot-update"

const npmDependencyPaths = new Set([
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
])
const githubActionsWorkflowPattern = /^\.github\/workflows\/[^/]+\.ya?ml$/
const dependabotBranchPattern = /^dependabot\/(npm_and_yarn|github_actions)\//

const denyDependabotMerge = (
  reason: Exclude<DependabotMergeDecisionReason, "eligible">,
  details: readonly string[] = [],
) => ({ details, eligible: false as const, reason })

const getDependabotDependencySurface = (headBranch: string) => {
  const branchMatch = dependabotBranchPattern.exec(headBranch)

  if (!branchMatch) return undefined

  return branchMatch[1] === "npm_and_yarn" ? "npm" : "github-actions"
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

  if (!candidate.hasSafeUpdateLabel)
    return denyDependabotMerge("unsafe-dependabot-update", [
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

  const successfulCheckNames = new Set(candidate.successfulCheckNames)
  const missingRequiredChecks = DEPENDENCY_MERGE_REQUIRED_CHECKS.filter(
    (requiredCheck) => !successfulCheckNames.has(requiredCheck),
  )

  if (missingRequiredChecks.length > 0)
    return denyDependabotMerge("missing-required-check", missingRequiredChecks)

  return {
    details: [] as const,
    eligible: true as const,
    reason: "eligible" as const,
  }
}
