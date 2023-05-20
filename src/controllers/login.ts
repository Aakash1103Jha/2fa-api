import { Request, Response, NextFunction } from "express";
import { HttpError } from "../lib";

export default async function loginController(req: Request, res: Response, next: NextFunction) {
	if (!req.body) return next(new HttpError("MandatoryDataMissingError"));
	try {
	} catch (error) {
		console.error("loginController error: ", error);
		return next(new HttpError("GenericError"));
	}
}

