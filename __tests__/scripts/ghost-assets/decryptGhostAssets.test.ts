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

type EncryptedArchiveEntry = {
  content?: string
  directory?: boolean
  filename: string
}

const DEFAULT_ENCRYPTED_ARCHIVE_ENTRIES: readonly EncryptedArchiveEntry[] = [
  {
    directory: true,
    filename: "fullPage_js_extensions_bundle/",
  },
  {
    directory: true,
    filename: "fullPage_js_extensions_bundle/cinematic/",
  },
  {
    content: "cinematic",
    filename: "fullPage_js_extensions_bundle/cinematic/effect.js",
  },
  {
    directory: true,
    filename: "fullPage_js_extensions_bundle/cards/",
  },
  {
    content: "cards",
    filename: "fullPage_js_extensions_bundle/cards/card.js",
  },
]

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
  entries: readonly EncryptedArchiveEntry[] = DEFAULT_ENCRYPTED_ARCHIVE_ENTRIES,
) => {
  const archiveWriter = new ZipWriter(new Uint8ArrayWriter(), {
    password,
    useWebWorkers: false,
    zipCrypto: true,
  })

  for (const entry of entries)
    await archiveWriter.add(
      entry.filename,
      entry.content === undefined ? undefined : new TextReader(entry.content),
      { directory: entry.directory },
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

  it("warns for a missing archive while extracting available archives", async () => {
    const logger = createLogger()
    const extractArchive = vi.fn()
    const missingArchive = GHOST_ARCHIVES[0]
    const availableArchive = GHOST_ARCHIVES[1]

    const exitCode = await runGhostAssetDecryption({
      archives: [missingArchive, availableArchive],
      assetKey: "test-password",
      dependencies: {
        archiveExists: (archivePath) =>
          archivePath === availableArchive.zipPath,
        directoryExists: () => true,
        extractArchive,
        logger,
      },
    })

    expect(exitCode).toBe(0)
    expect(logger.warn).toHaveBeenCalledExactlyOnceWith(
      `⚠️ Warning: Archive not found at ${missingArchive.zipPath}`,
    )
    expect(extractArchive).toHaveBeenCalledExactlyOnceWith(
      availableArchive,
      "test-password",
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

  it("handles shell-sensitive passwords as literal archive data", async () => {
    const temporaryDirectory = createTemporaryDirectory()
    const archivePath = path.join(temporaryDirectory, "literal-password.zip")
    const targetDirectory = path.join(temporaryDirectory, "extracted")
    const shellSensitivePassword =
      "literal \"quotes\" 'apostrophes' $HOME $(touch owned) `ticks` ; & | < > %PATH% !"

    await createEncryptedArchive(archivePath, shellSensitivePassword)
    await extractEncryptedZipArchive(
      {
        name: "Literal password",
        zipPath: archivePath,
        targetDir: targetDirectory,
        junkPaths: true,
      },
      shellSensitivePassword,
    )

    expect(
      fs.readFileSync(path.join(targetDirectory, "effect.js"), "utf8"),
    ).toBe("cinematic")
  })

  it("rejects archive entries that resolve outside the destination", async () => {
    const temporaryDirectory = createTemporaryDirectory()
    const archivePath = path.join(temporaryDirectory, "unsafe-path.zip")
    const targetDirectory = path.join(temporaryDirectory, "extracted")
    const escapedPath = path.join(temporaryDirectory, "escaped.txt")

    await createEncryptedArchive(archivePath, "test-password", [
      { content: "unsafe", filename: "..\\escaped.txt" },
    ])

    await expect(
      extractEncryptedZipArchive(
        {
          name: "Unsafe path",
          zipPath: archivePath,
          targetDir: targetDirectory,
          junkPaths: false,
        },
        "test-password",
      ),
    ).rejects.toThrow("Archive entry resolves outside its destination.")
    expect(fs.existsSync(escapedPath)).toBe(false)
  })

  it("redacts extraction errors and returns a deterministic failure", async () => {
    const secret = 'never expose $(this) ; & | "secret"'
    const logger = createLogger()
    const archive = {
      name: "Failing archive",
      zipPath: "failing.zip",
      targetDir: "destination",
      junkPaths: false,
    }

    const exitCode = await runGhostAssetDecryption({
      archives: [archive],
      assetKey: secret,
      dependencies: {
        archiveExists: () => true,
        directoryExists: () => true,
        extractArchive: () => {
          throw new Error(`Library failure included ${secret}`)
        },
        logger,
      },
    })
    const emittedMessages = [
      ...logger.error.mock.calls,
      ...logger.log.mock.calls,
      ...logger.warn.mock.calls,
    ]
      .map(([message]) => String(message))
      .join("\n")

    expect(exitCode).toBe(1)
    expect(logger.error.mock.calls).toEqual([
      ["❌ FATAL ERROR: Decryption failed."],
      [
        "Possible causes: Wrong GHOST_ASSET_KEY_DOCTORDEREK_COM or invalid encrypted archive.",
      ],
    ])
    expect(emittedMessages).not.toContain(secret)
    expect(emittedMessages).not.toContain("Library failure included")
  })

  it("converts a wrong archive password into the same fixed failure", async () => {
    const temporaryDirectory = createTemporaryDirectory()
    const archivePath = path.join(temporaryDirectory, "wrong-password.zip")
    const targetDirectory = path.join(temporaryDirectory, "extracted")
    const logger = createLogger()

    await createEncryptedArchive(archivePath, "correct-password")

    const exitCode = await runGhostAssetDecryption({
      archives: [
        {
          name: "Wrong password",
          zipPath: archivePath,
          targetDir: targetDirectory,
          junkPaths: true,
        },
      ],
      assetKey: "wrong-password",
      dependencies: { logger },
    })

    expect(exitCode).toBe(1)
    expect(logger.error.mock.calls).toEqual([
      ["❌ FATAL ERROR: Decryption failed."],
      [
        "Possible causes: Wrong GHOST_ASSET_KEY_DOCTORDEREK_COM or invalid encrypted archive.",
      ],
    ])
    expect(fs.existsSync(path.join(targetDirectory, "effect.js"))).toBe(false)
  })
})
