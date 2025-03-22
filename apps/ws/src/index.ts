import { WebSocket, WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";

const wss: WebSocketServer = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  userId: string;
  room: string[];
}

const users: User[] = [];

function cheakUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

wss.on("connection", (ws: WebSocket, request) => {
  const url = request.url;

  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);

  const token = queryParams.get("token");

  const userId = token ? cheakUser(token) : null;

  if (userId == null) {
    ws.close();

    return null;
  }

  users.push({ ws, userId, room: [] });

  ws.on("message", (data) => {
    const pasrseData = JSON.parse(data as unknown as string);

    if(pasrseData.type === "join_room") {
      

      const user = users.find((user) => user.ws === ws);
      user?.room.push(pasrseData.room);
      
      
    }

  });
});
