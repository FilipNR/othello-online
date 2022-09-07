import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, _next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params
        })
        return
    } catch(e: any) {
        return res.status(400).send(e.errors)
    }
}

export default validate;