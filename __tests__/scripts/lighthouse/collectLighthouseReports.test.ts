import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import { collectLighthouseReports } from "@/scripts/lighthouse/collectLighthouseReports"

const temporaryDirectories: string[] = []

const createTemporaryDirectory = () => {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "doctor-derek-lighthouse-collector-"),
  )
  temporaryDirectories.push(temporaryDirectory)
  return temporaryDirectory
}

describe("collectLighthouseReports", () => {
  afterEach(() => {
    for (const temporaryDirectory of temporaryDirectories.splice(0))
      fs.rmSync(temporaryDirectory, { force: true, recursive: true })
  })

  it("collects every mobile run and writes the report manifest", async () => {
    const outputDirectory = createTemporaryDirectory()
    const killChrome = vi.fn(async () => undefined)
    const launchChrome = vi.fn(async () => ({
      kill: killChrome,
      port: 9222,
    }))
    const runLighthouse = vi
      .fn()
      .mockResolvedValueOnce({
        lighthouseResult: { run: 1 },
        report: "first-report",
      })
      .mockResolvedValueOnce({
        lighthouseResult: { run: 2 },
        report: "second-report",
      })

    const manifest = await collectLighthouseReports(
      {
        extraHeaders: { "x-vercel-trusted-oidc-idp-token": "token" },
        numberOfRuns: 2,
        outputDirectory,
        targetUrl: "https://preview.example.com",
      },
      { launchChrome, runLighthouse },
    )

    expect(launchChrome).toHaveBeenCalledOnce()
    expect(launchChrome).toHaveBeenCalledWith(
      expect.stringContaining("doctor-derek-lighthouse-"),
    )
    expect(runLighthouse).toHaveBeenCalledTimes(2)
    expect(runLighthouse).toHaveBeenNthCalledWith(
      1,
      "https://preview.example.com",
      {
        extraHeaders: { "x-vercel-trusted-oidc-idp-token": "token" },
        formFactor: "mobile",
        logLevel: "info",
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
        output: "html",
        port: 9222,
      },
    )
    expect(killChrome).toHaveBeenCalledOnce()
    expect(manifest).toHaveLength(2)
    expect(
      JSON.parse(
        fs.readFileSync(path.join(outputDirectory, "manifest.json"), "utf8"),
      ),
    ).toEqual(manifest)
    expect(fs.readFileSync(manifest[1]?.htmlPath ?? "", "utf8")).toBe(
      "second-report",
    )
    expect(
      JSON.parse(fs.readFileSync(manifest[1]?.jsonPath ?? "", "utf8")),
    ).toEqual({ run: 2 })
  })

  it("always closes Chrome when a run fails", async () => {
    const killChrome = vi.fn(async () => undefined)

    await expect(
      collectLighthouseReports(
        {
          numberOfRuns: 1,
          outputDirectory: createTemporaryDirectory(),
          targetUrl: "https://www.doctorderek.com/",
        },
        {
          launchChrome: async () => ({ kill: killChrome, port: 9222 }),
          runLighthouse: async () => undefined,
        },
      ),
    ).rejects.toThrow("run 1 did not return a result")
    expect(killChrome).toHaveBeenCalledOnce()
  })

  it("preserves completed reports when Windows delays temporary cleanup", async () => {
    const cleanupError = Object.assign(new Error("Temporary directory busy"), {
      code: "EPERM",
      syscall: "rm",
    })
    const removeTemporaryDirectory = vi
      .spyOn(fs, "rmSync")
      .mockImplementationOnce(() => {
        throw cleanupError
      })
    const killChrome = vi.fn(async () => undefined)

    await expect(
      collectLighthouseReports(
        {
          numberOfRuns: 1,
          outputDirectory: createTemporaryDirectory(),
          targetUrl: "https://www.doctorderek.com/",
        },
        {
          launchChrome: async () => ({ kill: killChrome, port: 9222 }),
          runLighthouse: async () => ({
            lighthouseResult: { categories: {} },
            report: "completed-report",
          }),
        },
      ),
    ).resolves.toHaveLength(1)
    expect(killChrome).toHaveBeenCalledOnce()
    expect(removeTemporaryDirectory).toHaveBeenCalledOnce()
  })
})
