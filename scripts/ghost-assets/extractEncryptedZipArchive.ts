import { mkdir, readFile, writeFile } from "node:fs/promises"
import {
  basename,
  dirname,
  isAbsolute,
  relative,
  resolve,
  sep,
} from "node:path"
import {
  Uint8ArrayReader,
  Uint8ArrayWriter,
  ZipReader,
} from "@zip.js/zip.js/index-native.js"
import type { GhostArchive } from "./decryptGhostAssets"

const resolveArchiveEntryPath = (
  targetDirectory: string,
  entryName: string,
  junkPaths: boolean,
) => {
  const normalizedEntryName = entryName.replaceAll("\\", "/")
  const outputName = junkPaths
    ? basename(normalizedEntryName)
    : normalizedEntryName
  const resolvedTargetDirectory = resolve(targetDirectory)
  const resolvedOutputPath = resolve(
    resolvedTargetDirectory,
    ...outputName.split("/"),
  )
  const relativeOutputPath = relative(
    resolvedTargetDirectory,
    resolvedOutputPath,
  )

  if (
    isAbsolute(relativeOutputPath) ||
    relativeOutputPath === ".." ||
    relativeOutputPath.startsWith(`..${sep}`)
  )
    throw new Error("Archive entry resolves outside its destination.")

  return resolvedOutputPath
}

export const extractEncryptedZipArchive = async (
  archive: GhostArchive,
  assetKey: string,
) => {
  const archiveData = await readFile(archive.zipPath)
  const zipReader = new ZipReader(new Uint8ArrayReader(archiveData), {
    checkAmbiguity: true,
    useWebWorkers: false,
  })

  try {
    const entries = await zipReader.getEntries()

    for (const entry of entries) {
      if (entry.directory && archive.junkPaths) continue

      const outputPath = resolveArchiveEntryPath(
        archive.targetDir,
        entry.filename,
        archive.junkPaths,
      )

      if (entry.directory) {
        await mkdir(outputPath, { recursive: true })
        continue
      }

      const entryData = await entry.getData(new Uint8ArrayWriter(), {
        checkAmbiguity: true,
        password: assetKey,
        useWebWorkers: false,
      })

      await mkdir(dirname(outputPath), { recursive: true })
      await writeFile(outputPath, entryData)
    }
  } finally {
    await zipReader.close()
  }
}
