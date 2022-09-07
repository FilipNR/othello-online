import { Game } from 'othello.js';
interface matchInstance {
    [id: string]: {
        id: string;
        playerOne: string;
        playerTwo?: string;
        game?: Game;
    };
}
export declare const gameRooms: matchInstance;
export {};
