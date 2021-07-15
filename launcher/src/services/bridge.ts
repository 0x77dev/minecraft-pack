import WebSocket from "ws";
import { Server, createServer } from "net"
import getPort from "get-port"

export class Bridge {
  private ws = new WebSocket("wss://minecraft-pack.herokuapp.com")
  private server: Server

  public async start(): Promise<number> {
    this.server = createServer((socket) => {
      this.ws.on("open", () => {
        socket.on("data", (data) => this.ws.send(data))
        this.ws.on("message", (data) => socket.write(data as Buffer))
        socket.on("close", () => this.ws.close())
      })

      this.ws.on("error", (err) => {
        console.error(err)
        this.ws.close()
        socket.destroy()
        process.exit(-228)
      })
    })

    const port = await getPort()

    this.server.listen(port, "127.0.0.1")

    return port
  }
}