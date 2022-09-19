import config from 'config';
import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import routes from './routes';
import cors from 'cors';
import { socketioController } from './controller/socketio.controller';

const app = express();
const server = createServer(app);

app.use(cors());
const origin_url = config.get<string>('cors_origin');

const io = new Server(server, { 
  cors: {
    origin: origin_url,
    methods: ["GET", "POST"]
  }
});

const express_port = config.get<number>('express_port');
const socket_port = config.get<number>('socket_port');

server.listen(socket_port, () => {
  console.log('Listening on port', socket_port);
});

app.listen(express_port, () => {
  console.log("Server is listening on port ", express_port);
  routes(app)
});

io.of('/games').on("connection", (socket) => {
  socketioController(socket);
});