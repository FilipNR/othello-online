import React, { useEffect, useContext, useState } from 'react';
import { SocketContext } from '../context/socket';

const Create = () => {
  const socket = useContext(SocketContext);
  const [input, setInput] = useState<string>('');

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput(e.target.value);
    console.log(input)
  };

  const handleSubmit = (roomName: string) => {
    if (input === '') {
      window.alert('Room must have a name.')
    } else {
      const data = { roomName, userId: localStorage.userId }
      console.log(data)
      socket.emit('create room', data);
    }
  }

  return (
    <div className="createRoom">
      <p>Room name: 
        <input onChange={handleChange} value={input} type="text" />
        <button onClick={() => handleSubmit(input)}>Create room</button>
      </p>  
    </div>
  )
}

export default Create