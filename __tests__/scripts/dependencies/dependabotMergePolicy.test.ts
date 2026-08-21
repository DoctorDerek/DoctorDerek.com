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
  hasSafeUpdateLabel: true,
  headBranch: "dependabot/npm_and_yarn/safe-version-updates-a1b2c3d4",
  isDraft: false,
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
        hasSafeUpdateLabel: false,
        headBranch: "dependabot/npm_and_yarn/major-version-updates-a1b2c3d4",
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
