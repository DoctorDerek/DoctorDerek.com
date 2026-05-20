// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require("child_process")
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs")
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path")

const ASSET_KEY = process.env.GHOST_ASSET_KEY_DOCTORDEREK_COM

const ARCHIVES = [
  {
    name: "FullPage Extensions",
    zipPath: path.join(__dirname, "../ghost_assets/fullPage_js_extensions_bundle.zip"),
    targetDir: path.join(__dirname, "../vendor"),
    junkPaths: false // Keeps internal folder structure (e.g., /cinematic/)
  },
  {
    name: "Restora Fonts",
    zipPath: path.join(__dirname, "../ghost_assets/fonts.zip"),
    targetDir: path.join(__dirname, "../vendor/fonts"),
    junkPaths: true // Flattens directory structure so .otf files land directly in vendor/fonts/
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
    if (fs.existsSync(archive.zipPath)) {
      if (!fs.existsSync(archive.targetDir)) {
        console.log(`📁 Creating directory: ${archive.targetDir}`)
        fs.mkdirSync(archive.targetDir, { recursive: true })
      }
      
      console.log(`📦 Unzipping payload: ${archive.name}`)
      // -j flag ignores zip folder structure and puts files directly in targetDir
      const junkFlag = archive.junkPaths ? "-j " : ""
      execSync(`unzip -o -q ${junkFlag}-P "${ASSET_KEY}" "${archive.zipPath}" -d "${archive.targetDir}"`, {
        stdio: "inherit",
      })
    } else {
      console.warn(`⚠️ Warning: Archive not found at ${archive.zipPath}`)
    }
  }

  console.log("✅ GHOST PIPELINE SUCCESS: Commercial assets injected.")
  console.log("[$̲̅(̲̅ιοο̲̅)̲̅$̲̅] Proceeding with Vercel build...")
  console.log("=========================================")
// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
  console.error("❌ FATAL ERROR: Decryption failed.")
  console.error("Possible causes: Wrong GHOST_ASSET_KEY_DOCTORDEREK_COM or missing unzip utility.")
  console.log("=========================================")
  process.exit(1)
}
