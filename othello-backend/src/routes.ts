import { Express, Request, Response } from 'express';
import { gameRooms } from './othelloGame';

function routes(app: Express):void {
app.get('/find', (_req:Request, res:Response) => {
    // List all games
    res.json(gameRooms).status(200);
});
};

export default routes;