import { io } from "socket.io-client";

const host =
  typeof window !== "undefined"
    ? window.location.hostname
    : "localhost";

export const socket = io(`http://${host}:5000`, {
  transports: ["websocket"],
  autoConnect: true,
});