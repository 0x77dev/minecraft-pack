import { exec } from "child_process"
import { dialog } from 'electron'

export const isJavaInstalled = (): Promise<void> => new Promise((res) => {
  const java = exec('java -version');

  java.on("error", async () => {
    await dialog.showMessageBox({
      title: "Java error",
      message: "no java installed, install java, (on macOS JDK), and try again"
    })

    process.exit(-1)
  })

  java.on("close", res)
})
