import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  extractLighthouseScores,
  fetchPublishedLighthouseScores,
  formatFailedPreviewLighthouseComment,
  formatPreviewLighthouseComment,
  parseLighthouseScores,
  prepareLighthouseReports,
  redactSensitiveLighthouseArtifacts,
  selectMedianPerformanceRun,
} from "@/scripts/lighthouse/prepareLighthouseReports"

const temporaryDirectories: string[] = []

const createLighthouseResult = (
  performance: number,
  accessibility = 1,
  bestPractices = 1,
  seo = 1,
) => ({
  categories: {
    performance: { score: performance },
    accessibility: { score: accessibility },
    "best-practices": { score: bestPractices },
    seo: { score: seo },
  },
})

const createTemporaryDirectory = () => {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "doctor-derek-lighthouse-"),
  )
  temporaryDirectories.push(temporaryDirectory)
  return temporaryDirectory
}

describe("prepareLighthouseReports", () => {
  afterEach(() => {
    for (const temporaryDirectory of temporaryDirectories.splice(0))
      fs.rmSync(temporaryDirectory, { force: true, recursive: true })
  })

  it("selects the stable median performance run and publishes its reports", () => {
    const resultsDirectory = createTemporaryDirectory()
    const publishedDirectory = path.join(resultsDirectory, "published")
    const manifest = [0.91, 0.72, 0.83].map((performance, runIndex) => {
      const jsonPath = path.join(resultsDirectory, `run-${runIndex}.json`)
      const htmlPath = path.join(resultsDirectory, `run-${runIndex}.html`)
      fs.writeFileSync(
        jsonPath,
        JSON.stringify(createLighthouseResult(performance, 0.99, 0.98, 0.97)),
      )
      fs.writeFileSync(htmlPath, `report-${performance}`)
      return { htmlPath, jsonPath }
    })
    fs.writeFileSync(
      path.join(resultsDirectory, "manifest.json"),
      JSON.stringify(manifest),
    )

    const scores = prepareLighthouseReports({
      publishedDirectory,
      resultsDirectory,
    })

    expect(scores).toEqual({
      performance: 83,
      accessibility: 99,
      bestPractices: 98,
      seo: 97,
    })
    expect(
      fs.readFileSync(path.join(publishedDirectory, "index.html"), "utf8"),
    ).toBe("report-0.83")
    expect(
      JSON.parse(
        fs.readFileSync(
          path.join(publishedDirectory, "lighthouse-results.json"),
          "utf8",
        ),
      ),
    ).toEqual(scores)
    expect(
      JSON.parse(
        fs.readFileSync(
          path.join(resultsDirectory, "lighthouse-summary.json"),
          "utf8",
        ),
      ),
    ).toEqual(scores)
  })

  it("redacts trusted credentials from every report artifact", () => {
    const resultsDirectory = createTemporaryDirectory()
    const secret = "signed-preview-token"
    const jsonPath = path.join(resultsDirectory, "run.json")
    const htmlPath = path.join(resultsDirectory, "run.html")
    const unchangedPath = path.join(resultsDirectory, "unchanged.txt")
    fs.writeFileSync(
      jsonPath,
      JSON.stringify({ ...createLighthouseResult(0.9), secret }),
    )
    fs.writeFileSync(htmlPath, `<html>${secret}</html>`)
    fs.writeFileSync(unchangedPath, "public")
    fs.mkdirSync(path.join(resultsDirectory, "nested"))
    fs.writeFileSync(
      path.join(resultsDirectory, "manifest.json"),
      JSON.stringify([{ htmlPath, jsonPath }]),
    )

    prepareLighthouseReports({ resultsDirectory, sensitiveValue: secret })

    expect(fs.readFileSync(jsonPath, "utf8")).not.toContain(secret)
    expect(fs.readFileSync(htmlPath, "utf8")).not.toContain(secret)
    expect(fs.readFileSync(jsonPath, "utf8")).toContain("[REDACTED]")
    expect(fs.readFileSync(htmlPath, "utf8")).toContain("[REDACTED]")
    expect(fs.readFileSync(unchangedPath, "utf8")).toBe("public")
  })

  it("formats Preview and Production scores with signed deltas", () => {
    const comment = formatPreviewLighthouseComment({
      actionsRunUrl: "https://github.com/run/1",
      previewScores: {
        performance: 94,
        accessibility: 100,
        bestPractices: 99,
        seo: 100,
      },
      previewUrl: "https://preview.example.com",
      productionReportUrl: "https://reports.example.com",
      productionScores: {
        performance: 92,
        accessibility: 100,
        bestPractices: 100,
        seo: 99,
      },
    })

    expect(comment).toContain("| Performance | 94 | 92 | +2 |")
    expect(comment).toContain("| Accessibility | 100 | 100 | 0 |")
    expect(comment).toContain("| Best Practices | 99 | 100 | −1 |")
    expect(comment).toContain("Scores are advisory measurements")
    expect(comment).toContain("Preview median (3 runs)")
    expect(comment).toContain("Production median (5 runs)")
  })

  it("keeps a successful Preview measurement useful when Production is unavailable", () => {
    const comment = formatPreviewLighthouseComment({
      actionsRunUrl: "https://github.com/run/1",
      previewScores: {
        performance: 94,
        accessibility: 100,
        bestPractices: 99,
        seo: 100,
      },
      previewUrl: "https://preview.example.com",
      productionReportUrl: "https://reports.example.com",
    })

    expect(comment).toContain(
      "| Performance | 94 | Unavailable | Unavailable |",
    )
  })

  it("loads published Production scores without coupling Preview availability to the network", async () => {
    const scores = {
      performance: 92,
      accessibility: 100,
      bestPractices: 100,
      seo: 100,
    }
    const successfulFetch = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(scores), { status: 200 }),
    )
    const unavailableFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 503 }))
    const rejectedFetch = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new Error("network unavailable"))

    await expect(
      fetchPublishedLighthouseScores(
        "https://reports.example.com/results.json",
        successfulFetch,
      ),
    ).resolves.toEqual(scores)
    await expect(
      fetchPublishedLighthouseScores(
        "https://reports.example.com/results.json",
        unavailableFetch,
      ),
    ).resolves.toBeUndefined()
    await expect(
      fetchPublishedLighthouseScores(
        "https://reports.example.com/results.json",
        rejectedFetch,
      ),
    ).resolves.toBeUndefined()
  })

  it("reports measurement failures with bounded, ANSI-free output", () => {
    const comment = formatFailedPreviewLighthouseComment({
      actionsRunUrl: "https://github.com/run/1",
      previewUrl: "https://preview.example.com",
      runnerOutput: `\u001b[31m${"x".repeat(4_100)}\u001b[0m`,
    })

    expect(comment).toContain("could not obtain a measurement")
    expect(comment).not.toContain("\u001b[31m")
    expect(comment).not.toContain("x".repeat(4_001))

    expect(
      formatFailedPreviewLighthouseComment({
        actionsRunUrl: "https://github.com/run/1",
        previewUrl: "https://preview.example.com",
        runnerOutput: "",
      }),
    ).not.toContain("```text")
  })

  it("rejects malformed manifests, categories, scores, and empty runs", () => {
    const resultsDirectory = createTemporaryDirectory()
    fs.writeFileSync(path.join(resultsDirectory, "manifest.json"), "{}")
    expect(() => prepareLighthouseReports({ resultsDirectory })).toThrow(
      "manifest must contain an array",
    )

    fs.writeFileSync(
      path.join(resultsDirectory, "manifest.json"),
      JSON.stringify([null]),
    )
    expect(() => prepareLighthouseReports({ resultsDirectory })).toThrow(
      "manifest entry 0 is invalid",
    )

    fs.writeFileSync(
      path.join(resultsDirectory, "manifest.json"),
      JSON.stringify([{}]),
    )
    expect(() => prepareLighthouseReports({ resultsDirectory })).toThrow(
      "missing report paths",
    )

    expect(() => extractLighthouseScores(null)).toThrow("invalid result")
    expect(() => extractLighthouseScores({})).toThrow("missing categories")
    expect(() =>
      extractLighthouseScores({ categories: { performance: {} } }),
    ).toThrow("numeric performance score")
    expect(() => parseLighthouseScores({ performance: 90 })).toThrow(
      "scores are incomplete",
    )
    expect(() => parseLighthouseScores(null)).toThrow("scores are invalid")
    expect(() => selectMedianPerformanceRun([])).toThrow("completed runs")

    expect(
      parseLighthouseScores({
        performance: 92,
        accessibility: 100,
        bestPractices: 100,
        seo: 100,
      }),
    ).toEqual({
      performance: 92,
      accessibility: 100,
      bestPractices: 100,
      seo: 100,
    })
  })

  it("uses source order to break equal-performance median ties", () => {
    const selectedRun = selectMedianPerformanceRun([
      {
        lighthouseResult: {},
        manifestEntry: { htmlPath: "second", jsonPath: "second" },
        manifestIndex: 1,
        performanceScore: 0.9,
      },
      {
        lighthouseResult: {},
        manifestEntry: { htmlPath: "first", jsonPath: "first" },
        manifestIndex: 0,
        performanceScore: 0.9,
      },
      {
        lighthouseResult: {},
        manifestEntry: { htmlPath: "third", jsonPath: "third" },
        manifestIndex: 2,
        performanceScore: 0.9,
      },
    ])

    expect(selectedRun.manifestIndex).toBe(1)
  })

  it("does nothing when there is no sensitive artifact value", () => {
    const resultsDirectory = createTemporaryDirectory()
    fs.writeFileSync(path.join(resultsDirectory, "report.html"), "unchanged")

    redactSensitiveLighthouseArtifacts(resultsDirectory)

    expect(
      fs.readFileSync(path.join(resultsDirectory, "report.html"), "utf8"),
    ).toBe("unchanged")
  })
})
