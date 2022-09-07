import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
declare const validate: (schema: AnyZodObject) => (req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default validate;
