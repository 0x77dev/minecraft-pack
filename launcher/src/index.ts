import { app } from 'electron';
import ProgressBar from "electron-progressbar"
import Store from "electron-store"
import { getDataDir } from './services/datadir';
import { Authenticator, Client } from 'minecraft-launcher-core'
import { totalmem } from "os"
import { getNickname } from './services/nickname';
import { isJavaInstalled } from './services/java';
import { waitServer } from './services/wait-server';
import { Bridge } from './services/bridge';

const store = new Store()
const launcher = new Client()

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

app.on("ready", async () => {
  const dataDir = await getDataDir(store)
  const nickname = await getNickname(store)
  const mem = totalmem()
  const bridge = new Bridge()

  await isJavaInstalled()

  const progress = new ProgressBar({
    title: 'Minecraft Pack',
    text: 'Starting...',
    detail: 'Wait...',
    indeterminate: true,
  });

  progress.text = "Starting bridge and waiting for server"
  progress.detail = "triggering server"

  await waitServer()
  progress.detail = "starting bridge"
  const port = await bridge.start()
  progress.text = "Starting minecraft"

  launcher.on("progress", ({ type, task, total }) => progress.detail = `Processing: ${type} ${task}/${total}`)
  launcher.on("debug", (data) => console.debug(data))
  launcher.once("data", () => progress.text = 'Running')
  launcher.on("data", (data) => progress.detail = data)
  launcher.on("close", () => process.exit())

  await launcher.launch({
    root: dataDir,
    authorization: Authenticator.getAuth(nickname),
    memory: {
      max: Math.round(mem / 1024 / 1024 / 2),
      min: Math.round(mem / 1024 / 1024 / 2 / 2)
    },
    server: {
      host: "127.0.0.1",
      port: port.toString()
    },
    version: {
      number: "1.12.2",
      type: "release"
    }
  })
})