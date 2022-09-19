import { NavigateFunction } from "react-router-dom";
import { Socket } from "socket.io-client";

export interface IData {
    [id: string]: {
        roomName: string,
        roomId: string,
    }
};

async function handleStartGame(roomId: string, navigate: NavigateFunction, id: string) {
    localStorage.removeItem('othello.session') // Clear othello session.
    localStorage.setItem('roomId', roomId);
    navigate(`/room/${id}`, { state: { started: true, color: 'black' } });
};

export const handleJoin = async (socket: Socket, id: string, navigate: NavigateFunction) => {
    let userId = localStorage.getItem('userId');
    const data = { roomId: id, userId };
    socket.emit('join room', data);
    // On event start game join redirect to the room and start.
    socket.on('start game', (roomId: string) => handleStartGame(roomId, navigate, id));
    // On event room full alert that the room is full and do nothing else.
    socket.on('room full', (data) => {
      alert(data);
    });

    return () => {
      socket.off('start game');
      socket.off('room full');
    };
};

export const fetchData = async (url: string, setData: React.Dispatch<React.SetStateAction<IData>>) => {
    const res = await fetch(url);
    const resJson = await res.json();
    setData(resJson);
};