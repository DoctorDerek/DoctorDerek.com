import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import {
  DEPENDENCY_MERGE_REQUIRED_CHECKS,
  evaluateDependabotMergeCandidate,
  type DependabotMergeCandidate,
} from "@/scripts/dependencies/dependabotMergePolicy"

const defaultCandidate = {
  authorLogin: "dependabot[bot]",
  baseBranch: "main",
  changedFiles: ["package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml"],
  headBranch: "dependabot/npm_and_yarn/safe-version-updates-a1b2c3d4",
  isDraft: false,
  isSafeUpdate: true,
  mergeableState: "clean",
  pullRequestState: "open",
  successfulCheckNames: [...DEPENDENCY_MERGE_REQUIRED_CHECKS],
} satisfies DependabotMergeCandidate

const createCandidate = (
  overrides: Partial<DependabotMergeCandidate> = {},
): DependabotMergeCandidate => ({
  ...defaultCandidate,
  ...overrides,
})

describe("evaluateDependabotMergeCandidate", () => {
  it("allows a verified npm minor or patch group", () => {
    expect(evaluateDependabotMergeCandidate(createCandidate())).toEqual({
      details: [],
      eligible: true,
      reason: "eligible",
    })
  })

  it("allows a verified GitHub Actions security group", () => {
    const candidate = createCandidate({
      changedFiles: [
        ".github/workflows/dependency-review.yaml",
        ".github/workflows/playwright.yml",
      ],
      headBranch: "dependabot/github_actions/safe-security-updates",
    })

    expect(evaluateDependabotMergeCandidate(candidate)).toMatchObject({
      eligible: true,
      reason: "eligible",
    })
  })

  it("allows a verified individual pinned GitHub Action update", () => {
    const candidate = createCandidate({
      changedFiles: [".github/workflows/test-and-lint.yml"],
      headBranch:
        "dependabot/github_actions/actions/github-script-3a2844b7e9c422d3c10d287c895573f7108da1b3",
    })

    expect(evaluateDependabotMergeCandidate(candidate)).toMatchObject({
      eligible: true,
      reason: "eligible",
    })
  })

  it.each([
    {
      expectedDetails: ["DoctorDerek"],
      expectedReason: "non-dependabot-author",
      overrides: { authorLogin: "DoctorDerek" },
    },
    {
      expectedDetails: ["closed"],
      expectedReason: "pull-request-not-open",
      overrides: { pullRequestState: "closed" },
    },
    {
      expectedDetails: [],
      expectedReason: "draft-pull-request",
      overrides: { isDraft: true },
    },
    {
      expectedDetails: ["release"],
      expectedReason: "unexpected-base-branch",
      overrides: { baseBranch: "release" },
    },
    {
      expectedDetails: [
        "dependabot/npm_and_yarn/major-version-updates-a1b2c3d4",
      ],
      expectedReason: "unsafe-dependabot-update",
      overrides: {
        headBranch: "dependabot/npm_and_yarn/major-version-updates-a1b2c3d4",
        isSafeUpdate: false,
      },
    },
    {
      expectedDetails: ["dependabot/pip/requests-3.0.0"],
      expectedReason: "unsafe-dependabot-group",
      overrides: {
        headBranch: "dependabot/pip/requests-3.0.0",
      },
    },
    {
      expectedDetails: ["behind"],
      expectedReason: "pull-request-not-clean",
      overrides: { mergeableState: "behind" },
    },
    {
      expectedDetails: [],
      expectedReason: "no-changed-files",
      overrides: { changedFiles: [] },
    },
    {
      expectedDetails: ["app/page.tsx"],
      expectedReason: "unexpected-file-change",
      overrides: { changedFiles: ["pnpm-lock.yaml", "app/page.tsx"] },
    },
    {
      expectedDetails: [
        "Reject Newly Vulnerable Dependencies",
        "Playwright E2E Tests",
      ],
      expectedReason: "missing-required-check",
      overrides: {
        successfulCheckNames: ["Lint & Annotate PR"],
      },
    },
  ] as const)(
    "denies $expectedReason candidates",
    ({ expectedDetails, expectedReason, overrides }) => {
      expect(
        evaluateDependabotMergeCandidate(createCandidate(overrides)),
      ).toEqual({
        details: expectedDetails,
        eligible: false,
        reason: expectedReason,
      })
    },
  )

  it("rejects a non-workflow file in a GitHub Actions group", () => {
    const candidate = createCandidate({
      changedFiles: [".github/dependabot.yml"],
      headBranch: "dependabot/github_actions/safe-version-updates-a1b2c3d4",
    })

    expect(evaluateDependabotMergeCandidate(candidate)).toMatchObject({
      details: [".github/dependabot.yml"],
      eligible: false,
      reason: "unexpected-file-change",
    })
  })
})

describe("Dependabot Safe Update Merge workflow", () => {
  const workflow = fs.readFileSync(
    path.resolve(".github/workflows/dependabot-auto-merge.yml"),
    "utf8",
  )

  it("evaluates updates from a quiet trusted default-branch schedule", () => {
    expect(workflow).toContain('    - cron: "37 2 * * *"')
    expect(workflow).toContain('      timezone: "America/Los_Angeles"')
    expect(workflow).toContain("  workflow_dispatch:")
    expect(workflow).not.toContain("  workflow_run:")
    expect(workflow).not.toContain("  pull_request_target:")
    expect(workflow).not.toContain("      issues: write")
    expect(workflow).not.toContain("dependencies:safe-to-auto-merge")
    expect(workflow).toContain(
      ".filter(pullRequest => pullRequest.user?.login === 'dependabot[bot]')",
    )
    expect(workflow).toContain(
      "          ref: ${{ github.event.repository.default_branch }}",
    )
  })

  it("serializes candidates behind the complete verified merge policy", () => {
    expect(workflow).toContain("      max-parallel: 1")
    expect(workflow).toContain("          DEPENDABOT_IS_SAFE_UPDATE:")
    expect(workflow).not.toContain("DEPENDABOT_HAS_SAFE_UPDATE_LABEL")
    expect(workflow).toContain(
      "            if (pullRequest.head.sha !== expectedHeadSha) {",
    )
    expect(workflow).toContain(
      "            if (pullRequest.base.sha !== expectedBaseSha) {",
    )
    expect(workflow).toContain("              merge_method: 'merge',")

    for (const requiredCheck of DEPENDENCY_MERGE_REQUIRED_CHECKS) {
      expect(workflow).toContain(requiredCheck)
    }
  })

  it("dispatches the complete main workflow handoff after a verified merge", () => {
    const mergeCallIndex = workflow.indexOf(
      "const { data: mergeResult } = await github.rest.pulls.merge",
    )
    const mergeRejectionIndex = workflow.indexOf("if (!mergeResult.merged)")
    const workflowDispatchIndex = workflow.indexOf(
      "await github.rest.actions.createWorkflowDispatch",
    )

    expect(workflow).toContain("      actions: write")
    expect(workflow).toContain("              'test-and-lint.yml',")
    expect(workflow).toContain("              'lighthouse.yml',")
    expect(workflow).toContain(
      "                ref: context.payload.repository.default_branch,",
    )
    expect(mergeCallIndex).toBeGreaterThan(-1)
    expect(mergeRejectionIndex).toBeGreaterThan(mergeCallIndex)
    expect(workflowDispatchIndex).toBeGreaterThan(mergeRejectionIndex)
  })

  it.each(["test-and-lint.yml", "lighthouse.yml"])(
    "keeps %s available to push and explicit dispatch",
    (workflowFileName) => {
      const downstreamWorkflow = fs.readFileSync(
        path.resolve(".github/workflows", workflowFileName),
        "utf8",
      )

      expect(downstreamWorkflow).toContain("  push:")
      expect(downstreamWorkflow).toContain("  workflow_dispatch:")
    },
  )
})

describe("Dependabot update campaign schedule", () => {
  it("opens npm and GitHub Actions campaigns quarterly at 2:37 AM Pacific", () => {
    const dependabotConfiguration = fs.readFileSync(
      path.resolve(".github/dependabot.yml"),
      "utf8",
    )
    const quarterlyCronOccurrences = dependabotConfiguration.match(
      /cronjob: "37 2 23 1,4,7,10 \*"/g,
    )
    const pacificTimezoneOccurrences = dependabotConfiguration.match(
      /timezone: "America\/Los_Angeles"/g,
    )

    expect(quarterlyCronOccurrences).toHaveLength(2)
    expect(pacificTimezoneOccurrences).toHaveLength(2)
  })
})
