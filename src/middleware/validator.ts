import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { AnyZodObject, ZodError } from "zod";

export const Validator = (schema: AnyZodObject) => async (req: Request, _res: Response, next: NextFunction) => {
    try{
        await schema.parseAsync({
            body: req.body,
            params: req.params,
            query: req.query
        })
        return next()
    } catch(err) {
        if(err instanceof ZodError) {
            const message = err.issues.map(obj => obj.message)[0];

            return next(createHttpError(422, message))
        }
    }
}