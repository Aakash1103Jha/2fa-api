import { Request, Response, NextFunction } from "express";
import { HttpError, prisma } from "../lib";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export default async function loginController(req: Request, res: Response, next: NextFunction) {
	if (!req.body) return next(new HttpError("MandatoryDataMissingError"));
	const { email, password } = req.body;
	try {
		const _user = await prisma.user.findUnique({ where: { email } });
		if (!_user) return next(new HttpError("UserNotFoundError"));
		const isCorrectPassword = await compare(password, _user.password);
		if (!isCorrectPassword) return next(new HttpError("IncorrectPasswordError"));
		const TOKEN = sign({ id: _user.id, email: _user.email }, process.env.AUTH_TOKEN_SECRET as string, {
			expiresIn: "1h",
			noTimestamp: false,
			issuer: "auth-service-module",
		});
		return res.status(200).json(TOKEN);
	} catch (error) {
		console.error("loginController error: ", error);
		return next(new HttpError("GenericError"));
	}
}

