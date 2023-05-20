import express, { NextFunction, Request, Response, json, urlencoded } from "express";
import cors from "cors";

import { errorHandler } from "../middlewares";
import HttpError from "./HttpError";
import { AuthRoute } from "../routes";

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/api/auth", AuthRoute);

app.get("/api", async (_: Request, res: Response) => {
	res.status(200).json({ data: "Root endpoint for service" });
});

app.use("*", async (req: Request, _: Response, next: NextFunction) => {
	const { hostname, baseUrl, method } = req;
	console.error("ERROR :: Someone tried to access a non-existing endpoint");
	console.table({ hostname, baseUrl, method });
	return next(new HttpError("EndpointNotFoundError"));
});

app.use(errorHandler);

export default app;

