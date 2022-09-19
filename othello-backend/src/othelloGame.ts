interface matchInstance {
    [id: string]: {
        roomName: string,
        roomId: string,
        white: string,
        gameStarted: boolean,
        black?: string,
    }
}

export const gameRooms : matchInstance = {} // Array of game objects