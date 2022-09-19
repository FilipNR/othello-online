import { createContext } from "react";
import { io } from 'socket.io-client';
import { nanoid } from "nanoid";

const userId = nanoid();
if (!localStorage.userId) {
    localStorage.userId = userId; // Generate a unique userId and push it to localStorage
}

const user = localStorage.userId;

export const socket = io(`ws://${process.env.REACT_APP_SOCKET_URL}/games`, {
    query: { user }
});
export const SocketContext = createContext(socket);