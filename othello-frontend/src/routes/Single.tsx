import { useEffect, useState } from 'react';
import { Game } from 'othello.js';
import Othelloboard from '../components/Othelloboard';

const Single = () => {
  const [render, setRender] = useState(0);
  const game = new Game({});
  const [current, setCurrent] = useState<string>('white');
  useEffect(() => {
    setRender(render + 1);
    setCurrent(game.board.nextStone);
    // eslint-disable-next-line
  }, [game.board.nextStone]);

  game.addListener("finish", (result) => {
      alert("Finish! Winner is " + result.winner);
      localStorage.removeItem('othello.session');
      game.board.reset([]);
      setRender(render + 1); // Re-render board after finish
  });

    
  if (localStorage['othello.session']) {
    game.board.reset(JSON.parse(localStorage['othello.session']))
  };

  return (
    <Othelloboard game={game} current={current} />
  );
};

export default Single;