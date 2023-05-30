import { Request, Response, NextFunction } from "express";
import { HttpError } from "../lib";

export default async function validateController(req: Request, res: Response, next: NextFunction) {
	if (!req.user) return next(new HttpError("MandatoryDataMissingError"));
	try {
		return res.status(200).json(true);
	} catch (error) {
		console.error("validateController error: ", error);
		return next(new HttpError("GenericError"));
	}
}

