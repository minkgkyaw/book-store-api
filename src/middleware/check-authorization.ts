import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET as string;

const CheckAuth = expressAsyncHandler(
	async (req: Request, _res: Response, next: NextFunction) => {
		try {
			const token = req.header('Authorization')?.replace('Bearer ', '');

			if (!token) return next(createHttpError(401));

			const payload = jwt.verify(token, secret);

			req.user = payload;

			return next();
		} catch (err: any) {
			err.status = 401;
			return next(err);
		}
	},
);

export default CheckAuth;
