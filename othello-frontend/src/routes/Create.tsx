import React, { useEffect, useContext, useState, useCallback } from 'react';
import { SocketContext } from '../context/socket';
import { useNavigate } from 'react-router-dom';
import { handleLeave } from '../utils/roomUtils';

const Create = () => {
  const socket = useContext(SocketContext);
  const [input, setInput] = useState<string>('');
  const [roomId, setRoomId] = useState<string>();
  const navigate = useNavigate();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput(e.target.value);
  };

  const handleCreate = useCallback(() => {
    navigate(`/room/${roomId}`, { state: {started: false, color: 'white'} }); // Don't join the game instantly -> setStart = false.
    localStorage.removeItem('othello.session'); // Clear othello session.
  }, [roomId, navigate]);

  const handleSubmit = (roomName: string) => {
    if (input === '') {
      window.alert('Room must have a name.');
    } else {
      const userId: any = localStorage.getItem('userId');
      const data = { roomName, userId };
      socket.emit('create room', data, (roomId: string) => {
        setRoomId(roomId); // Callback on server sends the id of the room.
        localStorage.removeItem('start');
        localStorage.setItem('roomId', roomId);
      });
    };
  };

  useEffect(() => {
    socket.on('room created', handleCreate);
    socket.on('room full', (msg) => handleLeave(msg, navigate));

    return () => { socket.off('room created') }
  }, [socket, handleCreate, navigate]);

  return (
    <div className="lobbyStart">
      <div>Room name: 
        <input onChange={handleChange} value={input} type="text" />
        <button className="join" onClick={() => handleSubmit(input)}>Create room</button>
      </div>  
    </div>
  );
};

export default Create;