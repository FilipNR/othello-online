import { Socket } from "socket.io";
import { nanoid } from "nanoid/non-secure";
import { IJoinRoom, IMoveData, IPassData } from "./socketio.controller.interfaces";
import { IUsersInRoom } from "./socketio.controller";

export function handleLeave(socket: Socket, usersInRoom: any, gameRooms: any, message: string): void {
  const userId: any = socket.handshake.query.user; // Get user id from disconnected user.
  let roomId: string = usersInRoom[userId]; // Match the id with the room he is in.
  if (gameRooms[roomId]) {
    socket.to(roomId).emit('user left', message); // Emit user disconnected event, alert on client side.
    socket.leave(usersInRoom[userId]); // Leave socket room.
    delete gameRooms[roomId]; // Delete room instance from the gameRooms object.
    delete usersInRoom[userId]; // Delete user from the usersInRoom object.
  };
};

let callTimeout: NodeJS.Timeout; // Timeout to wait for the socket before disconnecting.

export function clearLeaveTimeout(socket: Socket, usersInRoom: IUsersInRoom) {
  let userId = socket.handshake.query.user;
  if (userId) {
    // @ts-ignore
    if (usersInRoom[userId]) {
      clearTimeout(callTimeout);
      // @ts-ignore
      socket.join(usersInRoom[userId]);
    };
  }
};

export function setLeaveTimeout(socket: Socket, usersInRoom: IUsersInRoom, gameRooms: any) {
  callTimeout = setTimeout(() => {
    handleLeave(socket, usersInRoom, gameRooms, 'User disconnected');
    socket.emit('leave room'); // Emit this event in case someone joined the game while the user was disconnecting.
  }, 5000);
};

function handleCreate(socket: Socket, gameRooms: any, roomName: string, userId: string, usersInRoom: IUsersInRoom, callback: any) {
  const sessionId: string = nanoid(); // Generate room id.
  socket.join(sessionId); // Join socket to the room.
  gameRooms[sessionId] = {
    roomId: sessionId,
    roomName: roomName,
    white: userId,
    gameStarted: false
  };
  usersInRoom[userId] = sessionId;
  callback(sessionId); // Send room id to the client.
  socket.emit('room created', sessionId);
};

export function handleCreateRoom(socket: Socket, gameRooms: any, data: any, usersInRoom: IUsersInRoom, callback: any) {
  const { roomName, userId } = data;
    if (userId === null) {
      socket.emit('room full', 'Refresh the page');
    } else {
      // Check if user is already in a room, if not create a new room and push the user to usersInRoom array
      if (Object.keys(usersInRoom).includes(userId) === false) {
        handleCreate(socket, gameRooms, roomName, userId, usersInRoom, callback);
      } else {
        delete usersInRoom[userId];
        handleCreate(socket, gameRooms, roomName, userId, usersInRoom, callback);
      };
    };
};

export function handleJoinRoom
(socket: Socket, gameRooms: any, 
data: IJoinRoom,
usersInRoom: IUsersInRoom,
clearLeaveTimeout: any) {
  clearLeaveTimeout(socket, gameRooms); // Clear timer in case the user joins from a url.
    const { roomId, userId } = data;
    if (userId === null) {
      socket.emit('room full', 'Refresh the page');
    }
    if (gameRooms[roomId]) {
      // If join room event came from any other socket than the players emit 'room full'.
      if (gameRooms[roomId].gameStarted === true && (userId !== gameRooms[roomId].black || gameRooms[roomId].white)) {
        socket.emit('room full', 'The room is full.');
      } 
      if (gameRooms[roomId].white === userId) {
        socket.emit('room full', 'Haha');
      } else {
          usersInRoom[userId] = roomId;
          gameRooms[roomId].gameStarted = true;
          gameRooms[roomId].black = userId;
          socket.join(roomId); // Join socket to the room.
          socket.to(roomId).emit("start game"); // Emit start game event to user in the created room.
          socket.emit('start game', roomId); // Emit start game event to sender.
      };
    };
};

export function handleMakeMove(socket: Socket, data: IMoveData) {
  const { roomId, color, x, y } = data;
  const move = { color, x, y };
  socket.to(roomId).emit('move made', move);
};

export function handleMakePass(socket: Socket, data: IPassData) {
  const { roomId, color } = data;
  socket.to(roomId).emit('pass made', color);
};

export function handleLeaveRoom(socket: Socket, roomId: string, usersInRoom: IUsersInRoom, gameRooms: any) {
  let userId: any = socket.handshake.query.user;
  socket.leave(usersInRoom[userId]); // Leave socket room.
  delete gameRooms[roomId];
  delete usersInRoom[userId];
};