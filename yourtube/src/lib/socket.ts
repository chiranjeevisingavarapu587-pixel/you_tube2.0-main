import { io } from "socket.io-client";
console.log("Socket file loaded");
export const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: true,
});