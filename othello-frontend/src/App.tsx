import './App.css';
import { useEffect } from 'react';
import { SocketContext, socket } from './context/socket';
import { Link, useNavigate } from "react-router-dom";
import { handleDisconnect, handleLeave } from './utils/rootSocketHandlers';

function App() {
  const navigate = useNavigate();
  
  useEffect(() => {
    socket.on('disconnect', () => handleDisconnect(navigate));

    socket.on('leave room', () => handleLeave(navigate));

    return () => {
      socket.off('disconnect');
      socket.off('leave room');
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (localStorage.roomId) {
      navigate(`/room/${localStorage.roomId}`);
    }
    // eslint-disable-next-line
  }, [localStorage.roomId])

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
    </SocketContext.Provider>  
  );
}

export default App;
