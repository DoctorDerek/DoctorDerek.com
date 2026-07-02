import { execSync } from "child_process"
import { existsSync, mkdirSync } from "fs"
import { join } from "path"
import { getErrorMessage } from "../utils/errors"

type GhostArchive = {
  name: string
  zipPath: string
  targetDir: string
  junkPaths: boolean
}

const ASSET_KEY = process.env.GHOST_ASSET_KEY_DOCTORDEREK_COM

const ARCHIVES: GhostArchive[] = [
  {
    name: "FullPage Extensions",
    zipPath: join(
      __dirname,
      "../ghost_assets/fullPage_js_extensions_bundle.zip",
    ),
    targetDir: join(__dirname, "../vendor"),
    /**
     * APPROVED EXCEPTION TO NO CODE COMMENT RULE:
     * Keeps internal folder structure (e.g., /cinematic/)
     */
    junkPaths: false,
  },
  {
    name: "Restora Fonts",
    zipPath: join(__dirname, "../ghost_assets/fonts.zip"),
    targetDir: join(__dirname, "../vendor/fonts"),
    /**
     * APPROVED EXCEPTION TO NO CODE COMMENT RULE:
     * Flattens directory structure so .otf files
     * land directly in vendor/fonts/
     */
    junkPaths: true,
  },
]

console.log("=========================================")
console.log("🦝 MAPACHITO GHOST PIPELINE INITIATED 🦝")
console.log("=========================================")

if (!ASSET_KEY) {
  console.log("⚠️  GHOST_ASSET_KEY_DOCTORDEREK_COM not found in environment.")
  console.log("⏩ Bypassing decryption (Open-source fallback mode active).")
  console.log("=========================================")
  process.exit(0)
}

console.log("🔑 Asset Key detected. Commencing decryption...")

try {
  for (const archive of ARCHIVES) {
    if (existsSync(archive.zipPath)) {
      if (!existsSync(archive.targetDir)) {
        console.log(`📁 Creating directory: ${archive.targetDir}`)
        mkdirSync(archive.targetDir, { recursive: true })
      }

      console.log(`📦 Unzipping payload: ${archive.name}`)
      const junkFlag = archive.junkPaths ? "-j " : ""
      execSync(
        `unzip -o -q ${junkFlag}-P "${ASSET_KEY}" "${archive.zipPath}" -d "${archive.targetDir}"`,
        { stdio: "inherit" },
      )
    } else {
      console.warn(`⚠️ Warning: Archive not found at ${archive.zipPath}`)
    }
  }

  console.log("✅ GHOST PIPELINE SUCCESS: Commercial assets injected.")
  console.log("[$̲̅(̲̅ιοο̲̅)̲̅$̲̅] Proceeding with Vercel build...")
  console.log("=========================================")
} catch (error) {
  const message = getErrorMessage(error)
  console.error("❌ FATAL ERROR: Decryption failed.")
  console.error(message)
  console.error(
    "Possible causes: Wrong GHOST_ASSET_KEY_DOCTORDEREK_COM or missing unzip utility.",
  )
  console.log("=========================================")
  process.exit(1)
}
