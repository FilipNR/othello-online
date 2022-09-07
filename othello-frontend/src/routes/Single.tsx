import React, { useState } from 'react';
import { Game } from 'othello.js';
import Othelloboard from '../components/Othelloboard';

const Single = () => {
    interface IState {
      current: string,
      type: string,
      winner?: string,
      x?: number,
      y?: number,
      modified?: {
        type: string,
        x: number,
        y: number
      }
    }

    const [gameState, setGameState] = useState<IState>()
    const game = new Game({});
    game.addListener("black", () => console.log("Black's turn"));
    game.addListener("white", () => console.log("White's turn"));
    game.addListener("finish", (result) => {
        alert("Finish! Winner is " + result.winner);
        localStorage.removeItem('othello.session');
    });

    if (localStorage['othello.session']) {
        game.board.reset(JSON.parse(localStorage.session))
    }

  return (
    <div>
        <Othelloboard game={game} />
    </div>
  )
}

export default Single