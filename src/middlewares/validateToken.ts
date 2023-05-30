import { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib";
import { verify } from "jsonwebtoken";

export default async function validateToken(req: Request, res: Response, next: NextFunction) {
	try {
		const _token = req.headers.authorization?.split(" ")[1];
		if (!_token) return next(new HttpError("AuthenticationTokenExpiredError"));
		const isValidUser = verify(_token, process.env.AUTH_TOKEN_SECRET as string, {
			complete: true,
		});
		if (!isValidUser) return next(new HttpError("AuthenticationTokenExpiredError"));
		req.user = isValidUser;
		next();
	} catch (error) {
		console.error(error);
		return next(new HttpError("GenericError"));
	}
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NzU5ZDA3ZGYzNjJhMDZjZDQ4M2Q4MCIsImVtYWlsIjoiYWFrYXNoLmpoYTExMDNAZ21haWwuY29tIiwiaWF0IjoxNjg1NDMwMDQwLCJleHAiOjE2ODU0MzM2NDAsImlzcyI6ImF1dGgtc2VydmljZS1tb2R1bGUifQ.3QKGaQIxc0bofPFxfbiuKkx01jWlBdZhDWvHk1-Hixs

