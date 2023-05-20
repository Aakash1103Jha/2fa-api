export type HttpErrorType =
	| "GenericError"
	| "EmailAlreadyInUseError"
	| "WeakPasswordError"
	| "ConfirmationLinkExpiredError"
	| "MandatoryDataMissingError"
	| "EndpointNotFoundError";

export type ErrorType = { message: string; statusCode: number };

const ErrorMessageMap: { [key in HttpErrorType]: ErrorType } = {
	GenericError: {
		message: "Something went wrong. Please try again.",
		statusCode: 500,
	},
	ConfirmationLinkExpiredError: {
		message: "Account confirmation link has expired. Please sign up again.",
		statusCode: 401,
	},
	EmailAlreadyInUseError: {
		message: "Email already in use. Please try with another email.",
		statusCode: 400,
	},
	WeakPasswordError: {
		message: "Password does not meet the minimum complexity criteria. Please choose another password.",
		statusCode: 400,
	},
	MandatoryDataMissingError: {
		message: "Please make sure all required fields have been filled in.",
		statusCode: 400,
	},
	EndpointNotFoundError: {
		message: "API endpoint not found, or implemented",
		statusCode: 404,
	},
};

export default class HttpError extends Error {
	message: string;
	statusCode: number;

	constructor(errorType: HttpErrorType) {
		super();
		const { message, statusCode } = ErrorMessageMap[errorType];
		this.message = message;
		this.statusCode = statusCode;
	}
}

