"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var routes_1 = __importDefault(require("./routes"));
var othelloGame_1 = require("./othelloGame");
var nanoid_1 = require("nanoid");
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(server, { /* options */});
var port = config_1.default.get('port');
var sessionId = (0, nanoid_1.nanoid)();
console.log(sessionId);
console.log(sessionId);
io.of('/games').on("connection", function (socket) {
    socket.on('create room', function (room) {
        console.log(room);
        socket.join(sessionId);
    });
    socket.on('join room', function (room) {
        if (othelloGame_1.gameRooms[room]) {
            socket.join(room);
        }
        else {
            socket.emit('err', "Room ".concat(room, " doesn't exist anymore."));
        }
    });
});
server.listen(3001);
server.listen(port, function () {
    console.log("Server is listening on port ", port);
    (0, routes_1.default)(app);
});
