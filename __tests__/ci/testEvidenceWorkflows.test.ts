import fs from "node:fs"
import path from "node:path"
import vm from "node:vm"
import { describe, expect, it } from "vitest"

const workflowPaths = {
  vitest: ".github/workflows/eslint-vitest-xstate.yml",
  playwright: ".github/workflows/playwright.yml",
}

const readStep = (runner: keyof typeof workflowPaths, name: string) => {
  const workflow = fs
    .readFileSync(workflowPaths[runner], "utf8")
    .replaceAll("\r\n", "\n")
  const step = workflow
    .split("      - name: " + name + "\n")[1]
    ?.split("\n      - name:")[0]
    ?.split(/\n  [a-z][a-z0-9-]*:/)[0]
  if (!step) throw new Error("Missing workflow step: " + name)
  return step
}

const scriptFor = (runner: keyof typeof workflowPaths, name: string) =>
  readStep(runner, name)
    .split("          script: |\n")[1]!
    .split("\n")
    .map((line) => line.replace(/^            /, ""))
    .join("\n")

const inspectEvidence = async (files: Map<string, string>, exitCode = "0") => {
  const warnings: string[] = []
  const summaries: string[] = []
  const summary = {
    addHeading: () => summary,
    addRaw: (value: string) => {
      summaries.push(value)
      return summary
    },
    write: async () => undefined,
  }
  await vm.runInNewContext(
    "(async () => {" + scriptFor("vitest", "Inspect Vitest Evidence") + "})()",
    {
      require: (module: string) => {
        if (module === "node:path") return path.posix
        if (module === "node:fs")
          return {
            existsSync: (file: string) => files.has(file),
            statSync: (file: string) => ({ size: files.get(file)!.length }),
            readFileSync: (file: string) => files.get(file),
          }
        throw new Error("Unexpected module: " + module)
      },
      process: { env: { VITEST_EXIT_CODE: exitCode } },
      context: {
        payload: { pull_request: { head: { sha: "head-sha" } } },
        sha: "merge-sha",
      },
      exec: { getExecOutput: async () => ({ stdout: "checkout-sha\n" }) },
      core: { warning: (value: string) => warnings.push(value), summary },
    },
  )
  return { warnings, summary: summaries.join("") }
}

const coverageFiles = () =>
  new Map([
    ["coverage/lcov.info", "TN:\nSF:/repo/sample.ts\nDA:1,1\nend_of_record\n"],
    ["coverage/coverage-final.json", JSON.stringify({ "/repo/sample.ts": {} })],
    ["coverage/index.html", "<html>coverage</html>"],
    ["/repo/sample.ts", "export const sample = 1"],
  ])

describe("canonical Vitest evidence", () => {
  it.each(["0", "1"])(
    "retains available coverage and the original runner result %s",
    async (exitCode) => {
      const result = await inspectEvidence(coverageFiles(), exitCode)
      expect(result.warnings).toEqual([])
      expect(result.summary).toContain("Runner exit: " + exitCode)
      expect(result.summary).toContain("checkout-sha")
      expect(result.summary).toContain("head-sha")
      expect(result.summary).toContain(
        "Report presence is not proof of complete execution",
      )
    },
  )
  it.each([
    "coverage/lcov.info",
    "coverage/coverage-final.json",
    "coverage/index.html",
  ])("reports missing %s as unavailable rather than zero", async (missing) => {
    const files = coverageFiles()
    files.delete(missing)
    const result = await inspectEvidence(files, "1")
    expect(result.warnings.join("\n")).toContain(
      "Unavailable Vitest evidence: " + missing,
    )
    expect(result.summary).toContain("Missing: " + missing)
  })
  it("reports unresolved source mappings and partial contributions honestly", async () => {
    const files = coverageFiles()
    files.delete("/repo/sample.ts")
    files.set(
      "coverage/coverage-final.json",
      JSON.stringify({ "/repo/other.ts": {} }),
    )
    const result = await inspectEvidence(files)
    expect(result.warnings.join("\n")).toContain("reference missing files")
    expect(result.warnings.join("\n")).toContain("contributions differ")
  })
  it("retains available reports when JSON is unreadable", async () => {
    const files = coverageFiles()
    files.set("coverage/coverage-final.json", "not JSON")
    expect((await inspectEvidence(files)).warnings.join("\n")).toContain(
      "JSON coverage is unreadable",
    )
    expect(files.has("coverage/index.html")).toBe(true)
  })
  it("does not manufacture a runner result after setup failure", async () => {
    expect((await inspectEvidence(new Map(), "")).summary).toContain(
      "Available: none",
    )
  })
})

const resolvePreview = async (
  associated: { state: string; head: { sha: string }; number: number }[],
  fallback = associated,
  creator = "vercel[bot]",
  target = "https://preview.vercel.app",
) => {
  const outputs = new Map<string, string>()
  await vm.runInNewContext(
    "(async () => {" +
      scriptFor("playwright", "Resolve Preview Deployment and Pull Request") +
      "})()",
    {
      URL,
      context: {
        repo: { owner: "owner", repo: "repo" },
        payload: {
          deployment: {
            sha: "current-sha",
            ref: "feature",
            creator: { login: creator },
          },
          deployment_status: { target_url: target },
        },
      },
      github: {
        rest: {
          repos: {
            listPullRequestsAssociatedWithCommit: async () => ({
              data: associated,
            }),
          },
          pulls: { list: async () => ({ data: fallback }) },
        },
      },
      core: {
        warning: () => undefined,
        setOutput: (name: string, value: string) => outputs.set(name, value),
      },
    },
  )
  return outputs
}

describe("canonical Preview routing", () => {
  it("selects the current open PR for the exact deployment SHA", async () => {
    expect(
      (
        await resolvePreview([
          { state: "open", head: { sha: "current-sha" }, number: 7 },
        ])
      ).get("pull-request-number"),
    ).toBe("7")
  })
  it("retains exact-SHA matching for the branch fallback", async () => {
    expect(
      (
        await resolvePreview(
          [],
          [{ state: "open", head: { sha: "current-sha" }, number: 7 }],
        )
      ).get("pull-request-number"),
    ).toBe("7")
  })
  it.each(["open", "closed"])(
    "skips stale or closed %s PR associations",
    async (state) => {
      expect(
        (
          await resolvePreview([
            { state, head: { sha: "stale-sha" }, number: 7 },
          ])
        ).size,
      ).toBe(0)
    },
  )
  it("skips a closed PR even at the matching SHA", async () => {
    expect(
      (
        await resolvePreview([
          { state: "closed", head: { sha: "current-sha" }, number: 7 },
        ])
      ).size,
    ).toBe(0)
  })
  it("skips an event without an applicable PR", async () => {
    expect((await resolvePreview([])).size).toBe(0)
  })
  it.each([
    ["other-bot", "https://preview.vercel.app"],
    ["vercel[bot]", "https://untrusted.example.com"],
    ["vercel[bot]", "http://preview.vercel.app"],
  ])("rejects untrusted creator/origin %s %s", async (creator, target) => {
    await expect(resolvePreview([], [], creator, target)).rejects.toThrow(
      "Untrusted Preview",
    )
  })
})

describe("canonical failure and publication boundaries", () => {
  it.each(["vitest", "playwright"] as const)(
    "keeps %s failure authoritative after tee",
    (runner) => {
      const step = readStep(
        runner,
        runner === "vitest"
          ? "Run Vitest and Capture Summary"
          : "Run Playwright Tests and Capture Summary",
      )
      expect(step).toContain("EXIT_CODE=$" + "{PIPESTATUS[0]}")
      expect(step).toContain('exit "$' + runner.toUpperCase() + '_EXIT_CODE"')
      expect(step).not.toContain("continue-on-error")
      expect(
        readStep(
          runner,
          runner === "vitest"
            ? "Enforce Test and Tooling Results"
            : "Enforce Playwright Result",
        ),
      ).toContain("!cancelled()")
    },
  )
  it("runs types and tests only after dependencies and without overriding cancellation", () => {
    for (const name of [
      "Run Blocking TypeScript Typecheck",
      "Run Vitest and Capture Summary",
    ]) {
      expect(readStep("vitest", name)).toContain(
        "!cancelled() && steps.dependencies.outcome == 'success'",
      )
    }
  })
  it("gates both authenticated evidence outputs on successful protection", () => {
    for (const name of [
      "Upload Playwright Report",
      "Post Playwright PR Comment",
    ]) {
      expect(readStep("playwright", name)).toContain(
        "!cancelled() && steps.playwright-evidence.outcome == 'success'",
      )
    }
  })
  it("preserves the existing retention and report-presence upload conditions", () => {
    for (const [runner, name] of [
      ["vitest", "Upload Vitest Coverage Evidence"],
      ["playwright", "Upload Playwright Report"],
    ] as const) {
      expect(readStep(runner, name)).toContain("retention-days: 14")
      expect(readStep(runner, name)).toContain("hashFiles(")
    }
    expect(readStep("vitest", "Upload coverage to Codecov")).toContain(
      "hashFiles('coverage/lcov.info')",
    )
  })
  it("keeps visualization-only jobs advisory and cancellation respecting", () => {
    const workflow = fs.readFileSync(workflowPaths.vitest, "utf8")
    for (const job of ["xstate-analysis", "xstate-publish"]) {
      const section = workflow
        .split("  " + job + ":")[1]!
        .split("    steps:")[0]!
      expect(section).toContain("continue-on-error: true")
      expect(section).toContain("!cancelled()")
    }
  })
})
