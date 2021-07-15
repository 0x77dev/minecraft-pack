import { dialog } from 'electron'
import Store from "electron-store"
import prompt from "electron-prompt";

export const getNickname = async (store: Store): Promise<string> => {
  let nickname = store.get("nickname") as string | null

  if (!nickname) {
    const input = await prompt({ title: "Enter your nickname", label: "Nickname:" })

    if (!input.length) {
      dialog.showErrorBox("Invalid nickname", "nickname empty")

      return getNickname(store)
    }

    nickname = input

    store.set("nickname", nickname)
  }

  return nickname
}