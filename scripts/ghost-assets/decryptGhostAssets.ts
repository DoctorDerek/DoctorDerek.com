import { existsSync, mkdirSync } from "node:fs"
import { join } from "node:path"
import { extractEncryptedZipArchive } from "./extractEncryptedZipArchive"

export type GhostArchive = {
  name: string
  zipPath: string
  targetDir: string
  junkPaths: boolean
}

type GhostAssetLogger = Pick<Console, "error" | "log" | "warn">

type GhostAssetPipelineDependencies = {
  archiveExists: (path: string) => boolean
  createDirectory: (path: string) => void
  directoryExists: (path: string) => boolean
  extractArchive: (
    archive: GhostArchive,
    assetKey: string,
  ) => Promise<void> | void
  logger: GhostAssetLogger
}

type RunGhostAssetDecryptionOptions = {
  archives?: readonly GhostArchive[]
  assetKey?: string
  dependencies?: Partial<GhostAssetPipelineDependencies>
}

const REPOSITORY_ROOT = join(__dirname, "../..")

export const GHOST_ARCHIVES: readonly GhostArchive[] = [
  {
    name: "FullPage Extensions",
    zipPath: join(
      REPOSITORY_ROOT,
      "ghost_assets/fullPage_js_extensions_bundle.zip",
    ),
    targetDir: join(REPOSITORY_ROOT, "vendor"),
    /**
     * APPROVED EXCEPTION TO NO CODE COMMENT RULE:
     * Keeps internal folder structure (e.g., /cinematic/)
     */
    junkPaths: false,
  },
  {
    name: "Restora Fonts",
    zipPath: join(REPOSITORY_ROOT, "ghost_assets/fonts.zip"),
    targetDir: join(REPOSITORY_ROOT, "vendor/fonts"),
    /**
     * APPROVED EXCEPTION TO NO CODE COMMENT RULE:
     * Flattens directory structure so webfont files
     * land directly in vendor/fonts/
     */
    junkPaths: true,
  },
]

const defaultDependencies: GhostAssetPipelineDependencies = {
  archiveExists: existsSync,
  createDirectory: (path) => mkdirSync(path, { recursive: true }),
  directoryExists: existsSync,
  extractArchive: extractEncryptedZipArchive,
  logger: console,
}

export const runGhostAssetDecryption = async ({
  archives = GHOST_ARCHIVES,
  assetKey = process.env.GHOST_ASSET_KEY_DOCTORDEREK_COM,
  dependencies: dependencyOverrides = {},
}: RunGhostAssetDecryptionOptions = {}) => {
  const dependencies = { ...defaultDependencies, ...dependencyOverrides }

  dependencies.logger.log("=========================================")
  dependencies.logger.log("🦝 MAPACHITO GHOST PIPELINE INITIATED 🦝")
  dependencies.logger.log("=========================================")

  if (!assetKey) {
    dependencies.logger.log(
      "⚠️  GHOST_ASSET_KEY_DOCTORDEREK_COM not found in environment.",
    )
    dependencies.logger.log(
      "⏩ Bypassing decryption (Open-source fallback mode active).",
    )
    dependencies.logger.log("=========================================")
    return 0
  }

  dependencies.logger.log("🔑 Asset Key detected. Commencing decryption...")

  try {
    for (const archive of archives) {
      if (dependencies.archiveExists(archive.zipPath)) {
        if (!dependencies.directoryExists(archive.targetDir)) {
          dependencies.logger.log(`📁 Creating directory: ${archive.targetDir}`)
          dependencies.createDirectory(archive.targetDir)
        }

        dependencies.logger.log(`📦 Unzipping payload: ${archive.name}`)
        await dependencies.extractArchive(archive, assetKey)
      } else {
        dependencies.logger.warn(
          `⚠️ Warning: Archive not found at ${archive.zipPath}`,
        )
      }
    }

    dependencies.logger.log(
      "✅ GHOST PIPELINE SUCCESS: Commercial assets injected.",
    )
    dependencies.logger.log("[$̲̅(̲̅ιοο̲̅)̲̅$̲̅] Proceeding with Vercel build...")
    dependencies.logger.log("=========================================")
    return 0
  } catch {
    dependencies.logger.error("❌ FATAL ERROR: Decryption failed.")
    dependencies.logger.error(
      "Possible causes: Wrong GHOST_ASSET_KEY_DOCTORDEREK_COM or invalid encrypted archive.",
    )
    dependencies.logger.log("=========================================")
    return 1
  }
}
