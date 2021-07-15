import WebSocket from "ws";
import { Server, createServer } from "net"
import getPort from "get-port"

export class Bridge {
  private server: Server

  public async start(): Promise<number> {
    this.server = createServer((socket) => {
      const ws = new WebSocket("wss://minecraft-pack.herokuapp.com")

      ws.on("open", () => {
        socket.on("data", (data) => ws.send(data))
        ws.on("message", (data) => socket.write(data as Buffer))
        socket.on("close", () => ws.close())
      })

      ws.on("error", (err) => {
        console.error(err)
        ws.close()
        socket.destroy()
        process.exit(-228)
      })
    })

    const port = await getPort()

    this.server.listen(port, "127.0.0.1")

    return port
  }
}