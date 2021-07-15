import { dialog } from 'electron'
import { mkdirSync, existsSync } from "fs"
import { join } from "path"
import { homedir } from "os"
import Store from "electron-store"


export const getDataDir = async (store: Store): Promise<string> => {
  let dataDir = store.get("dataDir") as string | null

  if (!dataDir) {
    const select = await dialog.showOpenDialog({
      title: "Select directory to create data directory",
      properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
      defaultPath: homedir()
    })

    if (!select.filePaths.length) {
      dialog.showErrorBox("Invalid selection", "No directory selected")

      return getDataDir(store)
    }

    if (select.filePaths.length > 1) {
      dialog.showErrorBox("Invalid selection", "Please select one folder")

      return getDataDir(store)
    }

    dataDir = join(select.filePaths[0], "minecraft-pack-data")

    if (!existsSync(dataDir)) {
      mkdirSync(dataDir)
    }

    store.set("dataDir", dataDir)
  }

  return dataDir
}