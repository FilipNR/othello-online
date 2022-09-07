import { Express, Request, Response } from 'express';
import { gameRooms } from './othelloGame';

function routes(app: Express):void {
app.get('/find', (_req:Request, res:Response) => {
    // List all games
    res.json(gameRooms).status(200);
});

app.post('/createUser', (req:Request, _res:Response) => {
    // Request to make a user | For guest user give him randomly generated identifier on client side, and store it in local storage.
    req.body('Hi')
})
}

export default routes;