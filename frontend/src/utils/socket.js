import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

export const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: false, // important
  transports: ["websocket"],
});