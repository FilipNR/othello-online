import { nanoid } from "nanoid/non-secure";
import { Location, NavigateFunction, Params } from "react-router-dom";
import { Socket } from "socket.io-client";

const url = `http://${process.env.REACT_APP_EXPRESS_URL}/find`;

export async function checkRoomExistence(navigate: NavigateFunction) {
    const res = await fetch(url); // Fetch all rooms.
    const resJson = await res.json();
    let room = localStorage.getItem('roomId');
    if (room !== null) {
        // Compare searched roomId with fetched rooms, and if the room doesn't exist redirect to home page.
        if (!resJson[room]) {
            alert('Room doesn\'t exist, redirecting...');
            localStorage.removeItem('roomId');
            localStorage.removeItem('othello.session');
            navigate('/');
        };
    };
};

export function handleLeave(msg: string, navigate: NavigateFunction) {
    localStorage.clear();
    alert(msg);
    navigate('/');
    window.location.reload();
};

export function handleUserLeft(message: string, navigate: NavigateFunction) {
    localStorage.clear();
      alert(message);
      navigate('/');
      window.location.reload();
};

export function handleGameInitialization
(
location: Location,
setColor: React.Dispatch<React.SetStateAction<string | undefined>>,
setStart: React.Dispatch<React.SetStateAction<boolean>>
) {
        if (location.state !== null) {
        // @ts-ignore
        let loc: any = location.state.started | 'started';
        // @ts-ignore
        let col = location.state.color;
        setColor(col);
        let locStart = localStorage.getItem('start');
        !locStart ? setStart(loc) : setStart(true);
    };
};

export function handleUrlJoin
(
params: Readonly<Params<string>>, 
setColor: React.Dispatch<React.SetStateAction<string | undefined>>, 
color: string | undefined, 
socket: Socket,
navigate: NavigateFunction
) {
    let userId; // Define userId, if there is userId in storage use that, if not generate a new one.
    localStorage.getItem('userId') ? userId = localStorage.getItem('userId') : userId = nanoid();
    const roomId = params.roomId;
    let room = localStorage.getItem('roomId');
    const data = { roomId, userId };
    if (!room) {
        // @ts-ignore
        localStorage.setItem('roomId', roomId);
        setColor('black');
        socket.emit('join room', data)

        // On event room full alert that the room is full and do nothing else.
        socket.on('room full', (data) => {
            alert(data);
            localStorage.removeItem('roomId');
            navigate('/');
            window.location.reload();
        });

        return () => {
        socket.off('room full');
        };
    };
};

export function handleStart(setStart: React.Dispatch<React.SetStateAction<boolean>>) {
    localStorage.setItem('start', 'true'); // Remember that the game has started.
    localStorage.removeItem('othello.session'); // Remove othello session in case user was playing singleplayer.
    setStart(true);
};

export function handleDisconnect(navigate: NavigateFunction) {
    localStorage.removeItem('roomId'); // Clean up roomId to prepare for a new game.
    localStorage.removeItem('start'); // Clean up start.
    alert('The opponent has disconnected, you will be redirected to main page.');
    navigate('/');
};