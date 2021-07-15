import net from "net"
import WebSocket from "ws"

const server = net.createServer((socket) => {
  const wsc = new WebSocket("wss://minecraft-pack.herokuapp.com/")

  wsc.on("open", () => {
    socket.on("data", (data) => wsc.send(data))
    wsc.on("message", (data) => socket.write(data as Buffer))
    socket.on("close", () => wsc.close())
  })

  wsc.on("error", (err) => {
    console.error(err)
    wsc.close()
    socket.destroy()
  })
})

server.listen(25567, '127.0.0.1');
