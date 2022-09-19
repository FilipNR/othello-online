export namespace ICreateRoom {
    export interface data {
        roomName: string,
        userId: string
    }
    export interface callback {
        (sessionId: string): void
    }
};

export interface IJoinRoom {
    roomId: string,
    userId: string
};

export interface IMoveData {
    roomId: string,
    color: string,
    x: number,
    y: number
};

export interface IPassData {
    roomId: string,
    color: string
};

export interface IGiveUpData {
    roomId: string,
    color: string
};