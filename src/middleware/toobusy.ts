import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import toobusy_js from 'toobusy-js';

const toobusy = (_req: Request, _res: Response, next: NextFunction) => {
	if (toobusy_js())
		return next(createHttpError(503, 'Server is too busy now'));

	return next();
};

export default toobusy;
