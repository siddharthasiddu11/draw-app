import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  userId: string,
  rooms: string[]
}

const users: User[] = [];  // stores all the users who are connected to the server acts as a in-memory database(like state in react) or recoil state management

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
  return null;
}

wss.on('connection', function connection(ws, request) {
  const url = request.url; // ws://localhost:3000?token=123123

  if(!url) {
    return;
  }
  

  const queryParams = new URLSearchParams(url.split('?')[1]); // ["ws://localhost:3000", "token=123123"] this splits into a array
  const token = queryParams.get('token') ?? "";
  const userId = checkUser(token);

  if(!userId) {
    ws.close();
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  });

  ws.on('message', async function message(data) {
    let parsedData;
    if(typeof data !== "string") {
      parsedData = JSON.parse(data.toString()); 
    } else {
       parsedData = JSON.parse(data); 
    }

    // { type: "join-room", roomId: 123 }
    if(parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws); // find the user who sent the message
      if(user) {
        user.rooms.push(parsedData.roomId); // add the room to the user's rooms
      }
    }

    if(parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws); // find the user who sent the message
      if(user) {
        user.rooms = user?.rooms.filter(x => x !== parsedData.room); // remove the room from the user's rooms   [10, 20, 123, 50] 10  !== 123 ? ✅ Yes, keep it  123 !== 123 ? ❌ No,  throw it away
      }
    }

    if(parsedData.type === "chat") {
      const roomId = parsedData.roomId; // 123
      const message = parsedData.message; // "hello"
      
      await prismaClient.chat.create({
        data: {
          roomId: Number(roomId),
          message,
          userId
        }
      })
      users.forEach(user => {
        if(user.rooms.includes(roomId)) { // check if the user is in the same room
          user.ws.send(JSON.stringify({ type: "chat", roomId, message: message })); // send the message to all the users who are in the same room
        }
      })
      
    }
  });

  
});
