import { spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import {
  TextReader,
  TextWriter,
  Uint8ArrayReader,
  Uint8ArrayWriter,
  ZipReader,
  ZipWriter,
} from "@zip.js/zip.js"
import { afterEach, describe, expect, it } from "vitest"

const temporaryDirectories: string[] = []
const fakeToken = "fake-preview.header.payload-signature"
const scriptPath = path.resolve("scripts/ci/protectPlaywrightEvidence.ps1")

const createFixture = () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "preview-evidence-"))
  temporaryDirectories.push(directory)
  fs.mkdirSync(path.join(directory, "playwright-report"))
  fs.mkdirSync(path.join(directory, "test-results"))
  return directory
}

const protect = (directory: string, token = fakeToken) =>
  spawnSync("pwsh", ["-NoProfile", "-File", scriptPath], {
    cwd: directory,
    encoding: "utf8",
    env: {
      ...process.env,
      PLAYWRIGHT_VERCEL_TRUSTED_OIDC_TOKEN: token,
      PLAYWRIGHT_OUTPUT_FILE: path.join(directory, "output.txt"),
    },
  })

const createArchive = async () => {
  const archive = new ZipWriter(new Uint8ArrayWriter())
  await archive.add(
    "trace.trace",
    new TextReader(
      JSON.stringify({
        headers: { "x-vercel-trusted-oidc-idp-token": fakeToken },
        useful: "retained diagnostic context",
      }),
    ),
  )
  await archive.add("resources/page.html", new TextReader("<p>Useful page</p>"))
  return archive.close()
}

const readArchive = async (bytes: Uint8Array) => {
  const archive = new ZipReader(new Uint8ArrayReader(bytes))
  try {
    const entries = await archive.getEntries()
    return await Promise.all(
      entries
        .filter((entry) => !entry.directory)
        .map(async (entry) => ({
          name: entry.filename,
          content: await entry.getData!(new TextWriter()),
        })),
    )
  } finally {
    await archive.close()
  }
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})

describe("protected Preview evidence", () => {
  it("redacts plain output, ZIP traces and embedded HTML archives without losing useful contents", async () => {
    const directory = createFixture()
    const archive = await createArchive()
    fs.writeFileSync(path.join(directory, "test-results/trace.zip"), archive)
    fs.writeFileSync(
      path.join(directory, "output.txt"),
      "failure " + fakeToken + " useful output",
    )
    fs.writeFileSync(
      path.join(directory, "playwright-report/index.html"),
      '<html>Useful report<script>"data:application/zip;base64,' +
        Buffer.from(archive).toString("base64") +
        '"</script></html>',
    )
    const result = protect(directory)
    expect(result.error).toBeUndefined()
    expect(result.status).toBe(0)
    expect(result.stdout + result.stderr).not.toContain(fakeToken)
    expect(fs.readFileSync(path.join(directory, "output.txt"), "utf8")).toBe(
      "failure [REDACTED] useful output",
    )
    const html = fs.readFileSync(
      path.join(directory, "playwright-report/index.html"),
      "utf8",
    )
    expect(html).toContain("Useful report")
    const embedded = Buffer.from(
      html.match(/data:application\/zip;base64,([A-Za-z0-9+/=]+)/)![1]!,
      "base64",
    )
    for (const bytes of [
      embedded,
      fs.readFileSync(path.join(directory, "test-results/trace.zip")),
    ]) {
      const entries = await readArchive(bytes)
      expect(JSON.stringify(entries)).not.toContain(fakeToken)
      expect(entries).toEqual([
        {
          name: "trace.trace",
          content: JSON.stringify({
            headers: { "x-vercel-trusted-oidc-idp-token": "[REDACTED]" },
            useful: "retained diagnostic context",
          }),
        },
        { name: "resources/page.html", content: "<p>Useful page</p>" },
      ])
    }
  }, 15_000)

  it("fails closed when evidence exists but its token is unavailable", () => {
    const directory = createFixture()
    fs.writeFileSync(path.join(directory, "output.txt"), "diagnostic output")
    expect(protect(directory, "").status).not.toBe(0)
  })

  it("fails closed for an unreadable trace archive", () => {
    const directory = createFixture()
    fs.writeFileSync(
      path.join(directory, "test-results/trace.zip"),
      "invalid ZIP",
    )
    expect(protect(directory).status).not.toBe(0)
  })

  it("allows unavailable evidence without manufacturing reports", () => {
    const directory = createFixture()
    expect(protect(directory, "").status).toBe(0)
    expect(fs.readdirSync(path.join(directory, "playwright-report"))).toEqual(
      [],
    )
  })
})
