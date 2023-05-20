import sendgrid from "@sendgrid/mail";
import { Request, Response, NextFunction } from "express";

import { HttpError } from "../lib";

if (!process.env.SENDGRID_API_KEY) throw new Error("Sendgrid API key missing");
if (!process.env.ADMIN_EMAIL) throw new Error("Sendgrid admin email missing");

const { ADMIN_EMAIL, SENDGRID_API_KEY } = process.env;

sendgrid.setApiKey(SENDGRID_API_KEY);

export default async function mailer(req: Request, res: Response, next: NextFunction) {
	const { email, verificationToken } = req.mailerConfig;
	const LINK = `http://localhost:4000/api/auth/verify?token=${verificationToken}`;
	try {
		console.info(`Sending mail to ${email}`);
		sendgrid
			.send({
				to: email,
				from: ADMIN_EMAIL,
				subject: `Verify Email || Registration Confirmation`,
				html: `<div><a href=${LINK}>Click here</a> to complete your registration</div>`,
			})
			.then((_) => {
				console.info(`Mail sent to ${email}`);
				return res.status(200).json("Mail sent.");
			})
			.catch((err) => {
				console.error("mailer error: ", err);
				return next(new HttpError("GenericError"));
			});
	} catch (error) {
		console.error("mailer error: ", error);
		return next(new HttpError("GenericError"));
	}
}

