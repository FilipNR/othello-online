import { gameRooms } from "../othelloGame";
// import { Game } from "othello.js";
import { nanoid } from 'nanoid/non-secure';

// Object where key is a connected user, and value is the room that the user has joined.
const usersInRoom: { [key: string]: string } = {}; 

export async function socketioController(socket: any) {
    // Create a room and give it a unique identifier
    console.log(`Player (id: ${socket.id}) connected`)
    socket.on('create room', async (data: any) => {
      const { roomName, userId } = data;
      // Check if user is already in a room, if not create a new room and push the user to usersInRoom array
      if (Object.keys(usersInRoom).includes(userId) === false) {
        const sessionId: string = nanoid();
        socket.join(sessionId);
        gameRooms[sessionId] = {
          roomId: sessionId,
          roomName: roomName,
          gameStarted: false,
          black: userId
        };
        usersInRoom[userId] = sessionId;
      }
      // const sockets = await socket.in(sessionId).rooms;
      console.log(gameRooms)
  });

//   // Join a room
//   socket.on('join room', (roomId: any, userId: any) => {
// //   const sockets = await socket.
//   if (roomId.clients(roomId) === 2) {
//     socket.emit('room full', 'The room is full.');
//   }
//   // Join the room if a room exists and if the game didn't start
//   if (gameRooms[roomId] && gameRooms[roomId].gameStarted !== true) {
//       gameRooms[roomId].white = userId;
//       gameRooms[roomId].gameStarted = true;
//       gameRooms[roomId].blacksTurn = true;
//       gameRooms[roomId].game = new Game({ firstMove: 'black' });
//       socket.join(roomId);

//       const gameInstance = gameRooms[roomId].game;
//       gameInstance?.addListener("black", () => console.log("Black's turn"));
//       gameInstance?.addListener("white", () => console.log("White's turn"));
//       gameInstance?.addListener("finish", (result) => {
//           socket.to(roomId).emit('finish game', result, (res: string | undefined) => {
//           // Emit remove room from client side
//           console.log(res);
//           });
//   });
//   socket.to(roomId).emit("start game"); // Emit start game event
//   } 
//     // if (gameRooms[roomId].gameStarted) { // If the game has started
//     //     socket.emit('err', 'The room is full.')
//     // } else { // If the room wasn't found
//     //     socket.emit('err', `Room ${roomId} doesn't exist anymore.`)
//     // }
//   })

//     socket.on('make move', (socket: any) => {
//     const { roomId, userId, x, y, pass } = socket;
//     const gameInstance = gameRooms[roomId].game;
//     // Set currentPlayer equal to the user whose turn it is
//     const currentPlayer = gameRooms[roomId].blacksTurn ? gameRooms[roomId].black : gameRooms[roomId].white;
//     // Set currentColor equal to currentPlayer's color
//     const currentColor = currentPlayer === gameRooms[roomId].black ? "black" : "white";

//     // If it's the user's turn to play then make a move, else do nothing.
//     if (userId === currentPlayer) {
//       // If user made a move then move, else pass.
//       if (pass !== true) {
//         gameInstance?.put({
//           current: currentColor,
//           type: "put",
//           x: x,
//           y: y
//         });
//       }
//       gameInstance?.put({ 
//         type: "pass",
//         current: currentColor
//       });
      
//       const possibleMoves = gameInstance?.board.getAbleToPut(currentColor); // Get possible moves and emit it to the player
//       // Emit possible moves to the next player
//       socket.broadcast.to(roomId).emit('possible moves', possibleMoves, (res: string | undefined) => {
//         console.log(res);
//       });

//       // Update the board state
//       const getRow: any = gameInstance?.board.getRow;
//       let currentBoard = [ // Array of rows
//         getRow(0),
//         getRow(1),
//         getRow(2),
//         getRow(3),
//         getRow(4),
//         getRow(5),
//         getRow(6),
//         getRow(7),
//       ];
//       let stoneStatus = {
//         black: gameInstance?.board.getInfo('black'),
//         white: gameInstance?.board.getInfo('white')
//       }
//       let gameState = {
//         currentBoard,
//         score: stoneStatus
//       }
//       // Emit an object of rows and handle the updating on client side
//       socket.to(roomId).emit('update board', gameState, (res: string | undefined) => {
//         console.log(res);
//       });
//       // Give the turn to the next player
//       gameRooms[roomId].blacksTurn = !gameRooms[roomId].blacksTurn
//     }
//   });

  socket.on('disconnect', (socket: any) => {
    const { roomId, userId } = socket;
    console.log(userId)
    if (gameRooms[roomId]) {
      delete gameRooms[roomId];
    };
  })

  // setTimeout(() => socket.disconnect(true), 60000); // Disconnect if away for more than 60 seconds.
}

