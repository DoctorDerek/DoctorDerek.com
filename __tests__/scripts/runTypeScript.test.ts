import { spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"

const temporaryDirectories: string[] = []

const createTemporaryDirectory = () => {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "doctor-derek-typescript-runner-"),
  )
  temporaryDirectories.push(temporaryDirectory)
  return temporaryDirectory
}

describe("runTypeScript", () => {
  afterEach(() => {
    for (const temporaryDirectory of temporaryDirectories.splice(0))
      fs.rmSync(temporaryDirectory, { force: true, recursive: true })
  })

  it("runs a repository TypeScript CLI with tsconfig path aliases", () => {
    const resultsDirectory = createTemporaryDirectory()
    const publishedDirectory = path.join(resultsDirectory, "published")
    const jsonPath = path.join(resultsDirectory, "run.json")
    const htmlPath = path.join(resultsDirectory, "run.html")
    fs.writeFileSync(
      jsonPath,
      JSON.stringify({
        categories: {
          performance: { score: 0.92 },
          accessibility: { score: 1 },
          "best-practices": { score: 1 },
          seo: { score: 1 },
        },
      }),
    )
    fs.writeFileSync(htmlPath, "report")
    fs.writeFileSync(
      path.join(resultsDirectory, "manifest.json"),
      JSON.stringify([{ htmlPath, jsonPath }]),
    )

    const result = spawnSync(
      process.execPath,
      [
        "scripts/runTypeScript.mjs",
        "scripts/lighthouse/prepareLighthouseReports.cli.ts",
      ],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        env: {
          ...process.env,
          LIGHTHOUSE_RESULTS_DIRECTORY: resultsDirectory,
          LIGHTHOUSE_PUBLISHED_DIRECTORY: publishedDirectory,
        },
      },
    )

    expect(result.stderr).toBe("")
    expect(result.status).toBe(0)
    expect(
      JSON.parse(
        fs.readFileSync(
          path.join(publishedDirectory, "lighthouse-results.json"),
          "utf8",
        ),
      ),
    ).toEqual({
      performance: 92,
      accessibility: 100,
      bestPractices: 100,
      seo: 100,
    })
  })

  it("rejects TypeScript entries outside the repository", () => {
    const result = spawnSync(
      process.execPath,
      ["scripts/runTypeScript.mjs", "../outside.ts"],
      { cwd: process.cwd(), encoding: "utf8" },
    )

    expect(result.status).not.toBe(0)
    expect(result.stderr).toContain(
      "A repository-local TypeScript entry file is required.",
    )
  })
})
