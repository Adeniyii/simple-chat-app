import { Socket } from "node:dgram";

class Chat {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  sendMessage(room: string, text: string): void {
    let message = {
      room,
      text,
    };
    this.socket.emit("message", message);
  }

  changeRoom(room: string) {
    this.socket.emit("join", {
      newRoom: room,
    });
  }
}
