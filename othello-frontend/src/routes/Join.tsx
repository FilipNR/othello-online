import React, { useState, useEffect, useContext, useCallback } from 'react';
import { SocketContext } from '../context/socket';
import { Link } from 'react-router-dom';

const Join = () => {
  interface IData {
    [id: string]: {
        roomName: string,
        roomId: string,
        gameStarted: boolean,
        black: string,
    }
  };
  const url = "http://localhost:3003/find";
  const [data, setData] = useState<IData>({});
  const socket = useContext(SocketContext)

  const handleJoin = useCallback(() => {
    socket.emit('join room')
  }, []);

  const fetchData = async (url: string) => {
    const res = await fetch(url);
    const resJson = await res.json();
    console.log('fetch called')
    setData(resJson);
  }

  useEffect(() => {
    fetchData(url)
  }, [])
  console.log(data)

  if (data === {}) {return (
    <div>
      {Object.values(data).map((room: any) => {
        return (
        <div key={room.roomId}>
          <span>{room.roomName}
            <button className="join" onClick={handleJoin}>Join</button>
          </span>
        </div>
        );
      })}
    </div>
  )
  }
  return <div>No matches found, you can <Link to="/create">create your own</Link></div>
}

export default Join