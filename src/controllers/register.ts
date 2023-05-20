import { NextFunction, Request, Response } from "express";
import { Prisma, User } from "@prisma/client";
import { genSalt, hash } from "bcrypt";
import { JwtPayload, sign, verify } from "jsonwebtoken";

import { HttpError, prisma } from "../lib";
import { validatePassword } from "../validations";

if (!process.env.REGISTER_VERIFICATION_TOKEN_SECRET) throw new Error("REGISTER_VERIFICATION_TOKEN_SECRET missing");
const { REGISTER_VERIFICATION_TOKEN_SECRET } = process.env;

export type FindUser = Prisma.PromiseReturnType<typeof findUser>;
export async function findUser(email: string) {
	return await prisma.user.findUnique({ where: { email } });
}

export default async function registerController(req: Request, res: Response, next: NextFunction) {
	if (!req.body) return next(new HttpError("MandatoryDataMissingError"));
	const { email, password, firstName, lastName } = req.body;
	try {
		const _user = await findUser(email);
		if (_user) return next(new HttpError("EmailAlreadyInUseError"));
		const isPasswordStrong = validatePassword(password);
		if (!isPasswordStrong) return next(new HttpError("WeakPasswordError"));
		const hashPassword = await hash(password, await genSalt(10));
		const VERIFICATION_TOKEN = sign({ email, hashPassword, firstName, lastName }, REGISTER_VERIFICATION_TOKEN_SECRET, {
			expiresIn: 300,
			algorithm: "HS512",
			noTimestamp: false,
		});
		req.mailerConfig = {
			email,
			verificationToken: VERIFICATION_TOKEN,
		};
		return next();
	} catch (error) {
		console.error("registerController error: ", error);
		return next(new HttpError("GenericError"));
	}
}

export async function verifyRegisteredUserController(req: Request, res: Response, next: NextFunction) {
	const { token } = req.query as { token: string };
	if (!token) return next(new HttpError("MandatoryDataMissingError"));
	try {
		verify(token, REGISTER_VERIFICATION_TOKEN_SECRET, { complete: true }, async (err, data) => {
			if (err) return next(new HttpError("ConfirmationLinkExpiredError"));
			if (!data || !data.payload) return next(new HttpError("GenericError"));
			const { firstName, lastName, email, hashPassword } = data.payload as {
				email: string;
				hashPassword: string;
				firstName: string;
				lastName: string;
			};
			const _user = await prisma.user.create({
				data: { email, password: hashPassword, profile: { create: { firstName, lastName } } },
				select: { email: true, id: true, profile: true },
			});
			return res.status(200).json(_user);
		});
	} catch (error) {
		console.error("verifyRegisteredUserController error: ", error);
		return next(new HttpError("GenericError"));
	}
}

