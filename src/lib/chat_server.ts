import { Server } from "socket.io";
import {
  joinRoom,
  namesUsed,
  nickNames,
  assignGuestName,
  handleRoomJoining,
  handleNameChangeAttempts,
  handleMessageBroadcasting,
  handleClientDisconnection,
} from "../helpers";

let guestNumber = 1;
export let io: Server;

export function chatServer(server: number) {
  io = new Server().listen(server);
  io.sockets.on("connection", (socket) => {
    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
    joinRoom(socket, "Lobby");
    handleMessageBroadcasting(socket);
    handleNameChangeAttempts(socket, nickNames, namesUsed);
    handleRoomJoining(socket);
    socket.on("rooms", () => {
      socket.emit("rooms", io.sockets.adapter.rooms);
    });
    handleClientDisconnection(socket);
  });
}
