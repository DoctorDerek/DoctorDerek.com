import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import {
  TextReader,
  Uint8ArrayWriter,
  ZipWriter,
} from "@zip.js/zip.js/index-native.js"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  GHOST_ARCHIVES,
  runGhostAssetDecryption,
} from "@/scripts/ghost-assets/decryptGhostAssets"
import { extractEncryptedZipArchive } from "@/scripts/ghost-assets/extractEncryptedZipArchive"

const temporaryDirectories: string[] = []

const createTemporaryDirectory = () => {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "doctor-derek-ghost-assets-"),
  )
  temporaryDirectories.push(temporaryDirectory)
  return temporaryDirectory
}

const createEncryptedArchive = async (
  archivePath: string,
  password: string,
) => {
  const archiveWriter = new ZipWriter(new Uint8ArrayWriter(), {
    password,
    useWebWorkers: false,
    zipCrypto: true,
  })

  await archiveWriter.add(
    "fullPage_js_extensions_bundle/cinematic/effect.js",
    new TextReader("cinematic"),
  )
  await archiveWriter.add(
    "fullPage_js_extensions_bundle/cards/card.js",
    new TextReader("cards"),
  )

  fs.writeFileSync(archivePath, await archiveWriter.close())
}

const createLogger = () => ({
  error: vi.fn(),
  log: vi.fn(),
  warn: vi.fn(),
})

describe("ghost asset decryption", () => {
  afterEach(() => {
    for (const temporaryDirectory of temporaryDirectories.splice(0))
      fs.rmSync(temporaryDirectory, { force: true, recursive: true })
  })

  it("preserves the canonical archive routing configuration", () => {
    expect(GHOST_ARCHIVES).toEqual([
      {
        name: "FullPage Extensions",
        zipPath: path.join(
          process.cwd(),
          "ghost_assets/fullPage_js_extensions_bundle.zip",
        ),
        targetDir: path.join(process.cwd(), "vendor"),
        junkPaths: false,
      },
      {
        name: "Restora Fonts",
        zipPath: path.join(process.cwd(), "ghost_assets/fonts.zip"),
        targetDir: path.join(process.cwd(), "vendor/fonts"),
        junkPaths: true,
      },
    ])
  })

  it("bypasses all archive work when the environment secret is absent", async () => {
    const archiveExists = vi.fn()
    const createDirectory = vi.fn()
    const directoryExists = vi.fn()
    const extractArchive = vi.fn()

    const exitCode = await runGhostAssetDecryption({
      assetKey: "",
      dependencies: {
        archiveExists,
        createDirectory,
        directoryExists,
        extractArchive,
        logger: createLogger(),
      },
    })

    expect(exitCode).toBe(0)
    expect(archiveExists).not.toHaveBeenCalled()
    expect(directoryExists).not.toHaveBeenCalled()
    expect(createDirectory).not.toHaveBeenCalled()
    expect(extractArchive).not.toHaveBeenCalled()
  })

  it("routes both archives to extraction in deterministic order", async () => {
    const createDirectory = vi.fn()
    const extractArchive = vi.fn()

    const exitCode = await runGhostAssetDecryption({
      assetKey: "test-password",
      dependencies: {
        archiveExists: () => true,
        createDirectory,
        directoryExists: () => false,
        extractArchive,
        logger: createLogger(),
      },
    })

    expect(exitCode).toBe(0)
    expect(createDirectory.mock.calls).toEqual(
      GHOST_ARCHIVES.map(({ targetDir }) => [targetDir]),
    )
    expect(extractArchive.mock.calls).toEqual(
      GHOST_ARCHIVES.map((archive) => [archive, "test-password"]),
    )
  })

  it("preserves or flattens paths according to each archive contract", async () => {
    const temporaryDirectory = createTemporaryDirectory()
    const archivePath = path.join(temporaryDirectory, "assets.zip")
    const preservedTarget = path.join(temporaryDirectory, "preserved")
    const flattenedTarget = path.join(temporaryDirectory, "flattened")

    await createEncryptedArchive(archivePath, "test-password")
    await extractEncryptedZipArchive(
      {
        name: "Preserved paths",
        zipPath: archivePath,
        targetDir: preservedTarget,
        junkPaths: false,
      },
      "test-password",
    )
    await extractEncryptedZipArchive(
      {
        name: "Flattened paths",
        zipPath: archivePath,
        targetDir: flattenedTarget,
        junkPaths: true,
      },
      "test-password",
    )

    expect(
      fs.readFileSync(
        path.join(
          preservedTarget,
          "fullPage_js_extensions_bundle/cinematic/effect.js",
        ),
        "utf8",
      ),
    ).toBe("cinematic")
    expect(
      fs.readFileSync(
        path.join(
          preservedTarget,
          "fullPage_js_extensions_bundle/cards/card.js",
        ),
        "utf8",
      ),
    ).toBe("cards")
    expect(
      fs.readFileSync(path.join(flattenedTarget, "effect.js"), "utf8"),
    ).toBe("cinematic")
    expect(fs.readFileSync(path.join(flattenedTarget, "card.js"), "utf8")).toBe(
      "cards",
    )
  })
})
