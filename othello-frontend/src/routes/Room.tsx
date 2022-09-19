import { useState, useEffect, useContext } from 'react';
import Othelloboard from '../components/Othelloboard';
import { Game } from 'othello.js';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/socket'; // Root socket context.
import { checkRoomExistence, handleLeave, handleStart, handleDisconnect, handleUserLeft, handleGameInitialization, handleUrlJoin } from '../utils/roomUtils'; // Import room handlers.
import { handleCopyUrl, handleLeaveButton } from '../utils/roomButtonUtils'; // Button handlers.

const Room = () => {
  const socket = useContext(SocketContext);
  const params = useParams();
  const location = useLocation(); // Get state from re-directed user.
  const navigate = useNavigate();
  const [start, setStart] = useState<boolean>(false);
  const [color, setColor] = useState<string>();
  const game = new Game({});
  const gameLink = `${process.env.REACT_APP_LOCAL_URL}/room/${localStorage.roomId}`; // Invitation link.

  game.addListener("finish", (result) => {
    // Timeout so that there is time to emit the last move.
    setTimeout(() => {
      alert("Finish! Winner is " + result.winner);
      localStorage.removeItem('othello.session');
      localStorage.removeItem('start');
      localStorage.removeItem('roomId');
      game.board.reset([]);
      navigate('/');
    }, 1000);
  });

  // Handle player color and initialization of the game.
  useEffect(() => {
    handleGameInitialization(location, setColor, setStart);
  }, [location]);
  
  // Handles the user that joined from a url.
  useEffect(() => {
    handleUrlJoin(params, setColor, color, socket, navigate);
    // eslint-disable-next-line
  }, [params, socket]);
  
  // Handle socket events.
  useEffect(() => {
    socket.on('start game', () => handleStart(setStart));
    socket.on('user disconnected', () => handleDisconnect(navigate));
    socket.on('user left', (message: string) => handleUserLeft(message, navigate));
    socket.on('leave room', () => handleLeave('User left the room.', navigate));
    socket.on('disconnect', () => handleLeave('Lost connection...', navigate));
    
    return () => { 
      socket.off('start game');
      socket.off('user disconnected');
      socket.off('user left');
      socket.off('join room');
      socket.off('leave room');
      socket.off('disconnect');
    }
  }, [socket, navigate])

  // Check if the room still exists on the server, if not remove roomId and othello.session from localStorage and redirect to '/'.
  useEffect(() => {
    checkRoomExistence(navigate);
  }, [navigate]);
  
  if (start) {
    if (localStorage['othello.session']) {
      game.board.reset(JSON.parse(localStorage['othello.session']))
    }
    return (
    <div>
      <Othelloboard game={game} current={color} />
    </div>
  );
  } else {
    return (
      <div className="lobbyStart">
        <h1>Send your friend this link: {gameLink}</h1>
        <button className="join" onClick={() => handleCopyUrl(gameLink)}>Copy URL</button>
        <h2>or wait for someone to join.</h2>
        <button className="join" onClick={() => handleLeaveButton(socket, navigate)}>Leave room</button>
      </div> 
    );
  };
};

export default Room;