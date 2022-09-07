import { Game } from 'othello.js';

interface matchInstance {
    [id: string]: {
        roomName: string,
        roomId: string,
        gameStarted: boolean,
        black: string,
        white?: string,
        blacksTurn?: boolean,
        game?: Game
    }
}

export const gameRooms : matchInstance = {} // Array of game objects