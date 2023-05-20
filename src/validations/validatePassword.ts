const PATTERN = /^(?=.*[A-Z]).{8,}$/;

export default function validatePassword(password: string) {
	return PATTERN.test(password);
}

