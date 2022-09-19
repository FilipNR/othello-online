import { gameRooms } from "../othelloGame";
import { ICreateRoom, IJoinRoom, IMoveData, IPassData } from "./socketio.controller.interfaces";
import { Socket } from "socket.io";
import { handleLeave, clearLeaveTimeout, setLeaveTimeout, handleCreateRoom, handleJoinRoom, handleMakeMove, handleMakePass, handleLeaveRoom } from "./socketio.controller.utils";

// Object where key is a connected user, and value is the room that the user has joined.
export interface IUsersInRoom {
  [key: string]: string
};
const usersInRoom: IUsersInRoom = {};

export async function socketioController(socket: Socket) {
  clearLeaveTimeout(socket, usersInRoom);
  // Create a room and give it a unique identifier
  socket.on('create room', (data: ICreateRoom.data, callback: ICreateRoom.callback) => {
    handleCreateRoom(socket, gameRooms, data, usersInRoom, callback);
  });

  socket.on('join room', (data: IJoinRoom) => {
    handleJoinRoom(socket, gameRooms, data, usersInRoom, clearLeaveTimeout);
  });

  socket.on('make move', (data: IMoveData) => {
    handleMakeMove(socket, data);
  });

  socket.on('make pass', (data: IPassData) => {
    handleMakePass(socket, data);
  });

// On leave room delete the user from gameRooms and usersInRoom instances.
  socket.on('leave room', (roomId: string) => {
    handleLeaveRoom(socket, roomId, usersInRoom, gameRooms);
  });

  socket.on('give up', () => {
    handleLeave(socket, usersInRoom, gameRooms, 'User gave up');
  });

  socket.on('disconnect', () => {
    setLeaveTimeout(socket, usersInRoom, gameRooms);
  });
};

