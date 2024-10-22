const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/authUtils");

jest.mock("jsonwebtoken");

describe("Auth Utils", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		process.env.JWT_SECRET = "testsecret";
		process.env.JWT_EXPIRES_IN = "1h";
	});

	test("should generate a token with a valid username", () => {
		const mockToken = "mockToken";
		jwt.sign.mockReturnValue(mockToken);

		const username = "testuser";
		const token = generateToken(username);

		expect(jwt.sign).toHaveBeenCalledWith(
			{ username },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRES_IN }
		);
		expect(token).toBe(mockToken);
	});
});
