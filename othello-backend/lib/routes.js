"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function routes(app) {
    app.get('/find', function (_req, res) {
        // List all games
        res.sendStatus(200);
        res.json("Helllo world");
    });
    app.get('/start/:sessionId', function (_req, res) {
        // Board opens up on both screens CREATED WEB SOCKET HERE OR UNDER SOCKET.IO
        res.status(200);
    });
    app.get('/fetchInput/:sessionId', function (_req, res) {
        // Send a response after a player makes a move (fetch new state of the board)
        // CREATE WEB SOCKET HERE OR ABOVE
        res.status(200);
    });
    app.post('/join/:sessionId', function (req, _res) {
        // Request to join a game
        req.body("Hello");
    });
    app.post('/handleInput/:sessionId', function (req, _res) {
        // Handles user input (move and surrender)
        req.body();
    });
    app.post('/createGame', function (req, _res) {
        // Generates a game session with a unique id property and pushes it to Games object.
        req.body();
    });
    app.post('/createUser', function (req, _res) {
        // Request to make a user | For guest user give him randomly generated identifier on client side, and store it in local storage.
        req.body('Hi');
    });
}
exports.default = routes;
