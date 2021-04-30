import * as fs from "fs/promises";
import * as mime from "mime";
import * as http from "http";
import * as path from "path";
import { Socket } from "socket.io";
import { io } from "./lib/chat_server";

type Rooms = NickNames;
export interface Map {
  [key: string]: Buffer;
}
interface NickNames {
  [key: string]: string;
}

interface Message {
  text: string;
  room?: string;
}

let currentRooms: Rooms = {};
export let namesUsed: string[];
export let nickNames: NickNames = {};

export async function serveStatic(
  response: http.ServerResponse,
  cache: Map,
  absPath: string
) {
  try {
    if (cache[absPath]) {
      sendFile(response, absPath, cache[absPath]);
    } else {
      await fs.access(absPath);
      const data = await fs.readFile(absPath);
      cache[absPath] = data;
      sendFile(response, absPath, data);
    }
  } catch (error) {
    send404(response, error.message);
  }
}

function sendFile(
  response: http.ServerResponse,
  filePath: string,
  fileContent: Buffer
) {
  response.writeHead(200, {
    "Content-Type": mime.getType(path.basename(filePath)) as string,
  });
  response.end(fileContent);
}

function send404(response: http.ServerResponse, message: string) {
  response.writeHead(404, { "Content-Type": "text/plain" });
  response.write(message.split(",")[0]);
  response.end();
}

export function assignGuestName(
  socket: Socket,
  guestNumber: number,
  nickNames: NickNames,
  namesUsed: string[]
): number {
  let name = "Guest" + guestNumber;
  nickNames[socket.id] = name;
  socket.emit("nameResult", {
    name,
    success: true,
  });
  namesUsed.push(name);
  return guestNumber + 1;
}

export async function joinRoom(socket: Socket, room: string) {
  socket.join(room);
  currentRooms[socket.id] = room;
  socket.emit("joinResult", { room });
  socket.broadcast.to(room).emit("message", {
    text: `${nickNames[socket.id]} has joined ${room}.`,
  });
  let usersInRoom = await io.in(room).fetchSockets();
  if (usersInRoom.length <= 1) {
  }
  let usersInRoomSummary = `Users currently in ${room}: `;

  usersInRoom.forEach((user, index) => {
    if (user.id !== socket.id) {
      if (index > 0) {
        usersInRoomSummary += ", ";
      }
      usersInRoomSummary += nickNames[user.id];
    }
  });
  usersInRoomSummary += ".";
  socket.emit("messsage", { text: usersInRoomSummary });
}

export function handleNameChangeAttempts(
  socket: Socket,
  nickNames: NickNames,
  namesUsed: string[]
) {
  socket.on("nameAttempt", (newName: string) => {
    if (newName.startsWith("Guest")) {
      socket.emit("nameResult", {
        success: false,
        message: `Names cannot begin with "Guest".`,
      });
    } else {
      if (namesUsed.includes(newName)) {
        socket.emit("nameResult", {
          success: false,
          message: `That name is already in use.`,
        });
      } else {
        let prevName = nickNames[socket.id];
        // Refactor Here
        namesUsed = namesUsed.map((name) => {
          if (name === prevName) {
            return newName;
          }
          return name;
        });
        socket.emit("nameResult", {
          success: true,
          name: newName,
        });
        socket.broadcast.to(currentRooms[socket.id]).emit("message", {
          text: `${prevName} is now known as ${newName}.`,
        });
      }
    }
  });
}

export function handleMessageBroadcasting(socket: Socket) {
  socket.on("message", (message: Message) => {
    socket.broadcast.to(message.room!).emit("message", {
      text: `${nickNames[socket.id]}: ${message.text}`,
    });
  });
}

export function handleRoomJoining(socket: Socket) {
  socket.on("join", (room) => {
    socket.leave(currentRooms[socket.id]);
    joinRoom(socket, room.newRoom);
  });
}

export function handleClientDisconnection(socket: Socket) {
  socket.on("disconnect", () => {
    let nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
}
