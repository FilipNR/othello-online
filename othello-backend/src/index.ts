import config from 'config';
import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import routes from './routes';
import cors from 'cors';
// import socket from './socket';
import { socketioController } from './controller/socketio.controller';

const app = express();
const server = createServer(app);

app.use(cors());

const io = new Server(server, { 
        cors: {
            origin: "*"
        },
    });

const port = config.get<number>('port')

server.listen(3002, () => {
  console.log('Listening on port', 3001)
});

app.listen(port, () => {
  console.log("Server is listening on port ", port);

  routes(app)
});

io.of('/games').on("connection", (socket) => {
  socketioController(socket);
});