import { WebSocket, WebSocketServer } from "ws";

const wss: WebSocketServer = new WebSocketServer({ port: 8000 });

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (data) => {
    ws.send("something");
  });
});
