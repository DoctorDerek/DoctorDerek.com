import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

type PackageManifest = {
  devDependencies?: { [packageName: string]: string }
}

const packageManifest = JSON.parse(
  fs.readFileSync(path.resolve("package.json"), "utf8"),
) as PackageManifest
const workspaceConfiguration = fs.readFileSync(
  path.resolve("pnpm-workspace.yaml"),
  "utf8",
)

describe("Lighthouse dependency policy", () => {
  it("uses the supported direct Lighthouse runner dependencies", () => {
    expect(packageManifest.devDependencies?.lighthouse).toMatch(/^\^\d+$/)
    expect(packageManifest.devDependencies?.["chrome-launcher"]).toMatch(
      /^\^\d+$/,
    )
    expect(packageManifest.devDependencies).not.toHaveProperty("@lhci/cli")
  })

  it("does not restore the vulnerable fast-uri resolution pin", () => {
    expect(workspaceConfiguration).not.toContain("ajv>fast-uri")
  })
})
