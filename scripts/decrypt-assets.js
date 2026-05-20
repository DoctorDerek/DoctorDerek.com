// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require("child_process")
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs")
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path")

const ASSET_KEY = process.env.FULLPAGE_ASSET_KEY
const TARGET_DIR = path.join(__dirname, "../vendor")
const ZIP_PATH = path.join(
  __dirname,
  "../ghost_assets/fullPage_js_extensions_bundle.zip"
)

console.log("=========================================")
console.log("🦝 MAPACHITO GHOST PIPELINE INITIATED 🦝")
console.log("=========================================")

if (!ASSET_KEY) {
  console.log("⚠️  FULLPAGE_ASSET_KEY not found in environment.")
  console.log("⏩ Bypassing decryption (Open-source fallback mode active).")
  console.log("=========================================")
  process.exit(0)
}

console.log("🔑 Asset Key detected. Commencing decryption...")

try {
  if (!fs.existsSync(TARGET_DIR)) {
    console.log(`📁 Creating target directory: ${TARGET_DIR}`)
    fs.mkdirSync(TARGET_DIR, { recursive: true })
  }

  if (fs.existsSync(ZIP_PATH)) {
    console.log(`📦 Found encrypted archive: ${ZIP_PATH}`)
    console.log("🔓 Unzipping payload...")
    execSync(`unzip -o -q -P "${ASSET_KEY}" "${ZIP_PATH}" -d "${TARGET_DIR}"`, {
      stdio: "inherit",
    })
    console.log("✅ GHOST PIPELINE SUCCESS: Commercial assets injected.")
    console.log("[$̲̅(̲̅ιοο̲̅)̲̅$̲̅] Proceeding with Vercel build...")
  } else {
    console.error(`❌ ERROR: Archive not found at ${ZIP_PATH}`)
    process.exit(1)
  }
  console.log("=========================================")
// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
  console.error("❌ FATAL ERROR: Decryption failed.")
  console.error("Possible causes: Wrong FULLPAGE_ASSET_KEY or missing unzip utility.")
  console.log("=========================================")
  process.exit(1)
}
