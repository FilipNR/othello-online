import './App.css';
import { useState, useEffect, useRef } from 'react';
import { SocketContext, socket } from './context/socket';
import {  Link } from "react-router-dom";
import { nanoid } from 'nanoid';
import Othelloboard from './components/Othelloboard';

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [inRoom, setInRoom] = useState<boolean>(false);
  const [move, setMove] = useState<object>({})
  const [lastPong, setLastPong] = useState(null);
  const client = useRef<any>();
  
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    client.current = socket;

    return () => {
      socket.off('connect');
      socket.off('disconnect')
    }
  }, []);

  const userId = nanoid();
  localStorage.roomName = 'room 1'
  if (!localStorage.userId) {
    localStorage.userId = userId; // Generate a unique userId and push it to localStorage
  }
  
  const createRoom = () => {
    socket.emit('create room', localStorage);
  }

  return (
    <SocketContext.Provider value={socket} >
      <div className="App">
        <h1>Othello</h1>
        <div className="lobbyStart">
          <div><Link to="/single"> Play offline</Link></div>
          <div><Link to="/join">Join game</Link></div>
          <div><Link to="/create">Create game</Link></div>
        </div>
      </div>
      {/* <Outlet /> */}
    </SocketContext.Provider>  
  );
  // return (
  //   <div className="App">
  //     <h1>Othello</h1>
  //     <div className='lobbyStart'>
  //       <div>Join game</div>
  //       <div>Create game</div>
  //       <div>Rules</div>
  //     </div>
  //   </div>
  // );
  // <div>
  //       <p onClick={() => console.log(client)}>Connected: {'' + isConnected}</p>
  //       <button onClick={createRoom}>AAA</button>
  //     </div>
  //     <Othelloboard setMove={setMove} />
}

export default App;
