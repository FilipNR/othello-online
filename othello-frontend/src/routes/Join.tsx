import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/socket';
import { Link, useNavigate } from 'react-router-dom';
import { handleJoin, fetchData, IData } from '../utils/joinUtils';

const Join = () => {
  const navigate = useNavigate();
  const url = `http://${process.env.REACT_APP_EXPRESS_URL}/find`;
  const [data, setData] = useState<IData>({});
  const socket = useContext(SocketContext);

  // Fetch active games, and refresh the list every 5 seconds.
  useEffect(() => {
    fetchData(url, setData)
    const intervalId = setInterval(() => {
      fetchData(url, setData)
    }, 5000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, []);

  if (JSON.stringify(data) !== '{}') {
    return (
    <div style={{ marginTop: '12em' }}>
      {Object.values(data).map((room: any) => {
        return (
        <div key={room.roomId} className="lobbyStart" style={{ marginTop: '2em' }}> {/* Overwrite marginTop style of lobbyStart class. */}
          <span>{room.roomName}
            <button className="join" onClick={() => handleJoin(socket, room.roomId, navigate)}>Join</button>
          </span>
        </div>
        );
      })}
    </div>
    )
  } else {
    return (
      <div className="lobbyStart">
        <h1>No matches found, you can <Link to="/create">create your own</Link></h1>
      </div>
    );
  };
};

export default Join;