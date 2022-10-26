import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
	return next(createHttpError(404, 'Your request was not found'));
};

export default notFoundHandler;
