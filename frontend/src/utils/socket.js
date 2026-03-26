import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

// 🔥 Get token from localStorage
const token = localStorage.getItem("token");

export const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"],
  auth: {
    token: token, // 🔥 Send token via auth option
  },
  // OR use query parameter (if auth doesn't work with your backend)
  // query: {
  //   token: token
  // }
});