import net from "net"
import http from "http"
import WebSocket from "ws"
import Express from "express"
import morgan from "morgan"
import { spawn } from "child_process"

const app = Express()
app.use(morgan("combined"))

const server = http.createServer(app);
const wss = new WebSocket.Server({ server })

app.get("/", (_, res) => res.send())

const mcs = spawn("/start")

mcs.stdout.on('data', (data) => console.log(data.toString()));

mcs.stderr.on('data', (data) => console.error(data.toString()));

wss.on("listening", () => {
	console.info("ready to accept connections")
})

wss.on('connection', (ws, req) => {
	console.log("new connection", req.headers)

	const minecraft = net.createConnection({
		host: 'localhost',
		port: 25565
	})

	ws.on("close", () => minecraft.destroy())

	minecraft.on("data", (data) => ws.send(data))
	ws.on("message", (data) => minecraft.write(data as Buffer))
});

server.listen(process.env.PORT ? parseInt(process.env.PORT) : 1337)

