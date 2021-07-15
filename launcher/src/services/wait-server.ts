import got from "got"

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const waitServer = async (): Promise<void> => {
  await got("https://minecraft-pack.herokuapp.com")
  await delay(10000)
}