import { ErrorRequestHandler } from 'express';
const ErrorHandler = ((err, _req, res, _next) => {
	const status = err.status || 500;
	const message = err.message || 'Internal Server Error';
	return res.status(status).json({ status, message });
}) as ErrorRequestHandler;

export default ErrorHandler;
