import { NextFunction, Request, Response } from "express";
import { ErrorType, HttpError } from "../lib";

export default async function errorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
	const { message, statusCode } = err;
	res.status(statusCode).json({ message, statusCode } satisfies ErrorType);
	return next();
}

