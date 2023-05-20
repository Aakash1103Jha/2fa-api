import { JwtPayload } from "jsonwebtoken";

declare global {
	namespace Express {
		export interface Request {
			mailerConfig: {
				email: string;
				verificationToken: string | JwtPayload;
			};
		}
	}
}

