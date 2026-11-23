import { ESLint } from "eslint"
import { describe, expect, it } from "vitest"
import siteLintConfig from "@/eslint.config"

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: siteLintConfig,
})
const fullPageExtensionPath =
  "@/vendor/fullPage_js_extensions_bundle/cinematic/fullpage.cinematic.core.min.js"

describe("TypeScript lint configuration", () => {
  it("reports explicit any as a warning in application code", async () => {
    const [result] = await eslint.lintText("export type UnsafeValue = any", {
      filePath: "app/page.tsx",
    })

    expect(result.messages).toEqual([
      expect.objectContaining({
        ruleId: "@typescript-eslint/no-explicit-any",
        severity: 1,
      }),
    ])
  })

  it("keeps fatal parsing failures as errors", async () => {
    const [result] = await eslint.lintText("export const value =", {
      filePath: "constants/STARTUP_TIMING.ts",
    })

    expect(result.messages).toEqual([
      expect.objectContaining({ fatal: true, severity: 2 }),
    ])
  })
})

describe("fullPage extension initialization exception", () => {
  it.each([
    fullPageExtensionPath,
    "@/vendor/fullPage_js_extensions_bundle/cinematic/effects/burn.min.js",
  ])(
    "allows synchronous initialization of %s in ClientShell",
    async (extensionPath) => {
      const [result] = await eslint.lintText(
        `export const initialize = () => { require("${extensionPath}") }`,
        { filePath: "components/ClientShell.tsx" },
      )

      expect(result.messages).toEqual([])
    },
  )

  it.each([
    ["components/ui/Logo.tsx", fullPageExtensionPath],
    ["components/ClientShell.tsx", "react"],
    [
      "components/ClientShell.tsx",
      "@/vendor/fullPage_js_extensions_bundle/cinematic/fullpage.js",
    ],
    [
      "components/ClientShell.tsx",
      "@/vendor/fullPage_js_extensions_bundle/../other-package/index.min.js",
    ],
  ])("rejects require in %s for %s", async (filePath, importPath) => {
    const [result] = await eslint.lintText(
      `export const initialize = () => { require("${importPath}") }`,
      { filePath },
    )

    expect(result.messages).toEqual([
      expect.objectContaining({
        ruleId: "@typescript-eslint/no-require-imports",
      }),
    ])
  })
})

describe("lint scope boundaries", () => {
  it.each([".next/types/fixture.ts", "repomix-temp.private.ts"])(
    "keeps generated or private file %s ignored",
    async (filePath) => {
      expect(await eslint.isPathIgnored(filePath)).toBe(true)
    },
  )

  it("does not apply TypeScript import rules to JavaScript tooling", async () => {
    const [result] = await eslint.lintText('require("node:fs")', {
      filePath: "scripts/lintProbe.cjs",
    })

    expect(result.messages).toEqual([])
  })
})

describe("image mock prop omission exception", () => {
  it("permits omitted Next Image props inside a designated image mock", async () => {
    const [result] = await eslint.lintText(
      "export function omitFill({ fill, ...imageProps }: { fill: boolean; src: string }) { return imageProps }",
      { filePath: "__tests__/components/AboutSection.test.tsx" },
    )

    expect(result.messages).toEqual([])
  })

  it("does not extend rest-sibling exceptions to production code", async () => {
    const [result] = await eslint.lintText(
      "export function omitFill({ fill, ...imageProps }: { fill: boolean; src: string }) { return imageProps }",
      { filePath: "components/AboutSection.tsx" },
    )

    expect(result.messages).toEqual([
      expect.objectContaining({ ruleId: "@typescript-eslint/no-unused-vars" }),
    ])
  })

  it("still reports an unused import inside a designated image mock", async () => {
    const [result] = await eslint.lintText(
      'import { useRef } from "react"\nexport const value = 1',
      { filePath: "__tests__/components/AboutSection.test.tsx" },
    )

    expect(result.messages).toEqual([
      expect.objectContaining({ ruleId: "@typescript-eslint/no-unused-vars" }),
    ])
  })
})

describe("Tailwind component styling", () => {
  const filePath = "components/ui/ThemeToggle.tsx"

  it("reports a component styling library, a CSS Module and inline layout", async () => {
    const [result] = await eslint.lintText(
      `import "@mui/material/Button"
import "./panel.module.css"
export const panel = <div style={{ padding: 4 }} />`,
      { filePath },
    )

    expect(result.messages.map(({ ruleId }) => ruleId)).toEqual([
      "no-restricted-imports",
      "no-restricted-imports",
      "no-restricted-syntax",
    ])
  })

  it("accepts the Tailwind entry point and a runtime custom property", async () => {
    const [result] = await eslint.lintText(
      `import "@/styles/globals.css"
import type { CSSProperties } from "react"
export const Meter = ({ width }: { width: string }) => <div className="w-(--meter-width)" style={{ "--meter-width": width } as CSSProperties} />`,
      { filePath },
    )

    expect(result.messages).toEqual([])
  })
})
