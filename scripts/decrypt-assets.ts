import { runGhostAssetDecryption } from "./ghost-assets/decryptGhostAssets"

process.exitCode = await runGhostAssetDecryption()
