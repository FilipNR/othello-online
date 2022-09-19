import { NavigateFunction } from "react-router-dom";
import { Socket } from "socket.io-client";

export function handleCopyUrl(gameLink: string) {
    navigator.clipboard.writeText(gameLink);
    alert('Copied link!');
};

export function handleLeaveButton(socket: Socket, navigate: NavigateFunction) {
    socket.emit('leave room', localStorage['roomId']);
    localStorage.removeItem('roomId');
    navigate('/');
};