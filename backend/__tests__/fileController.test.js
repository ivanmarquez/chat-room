const { uploadFile } = require("../controllers/fileController");

describe("File Controller", () => {
	let req, res;

	beforeEach(() => {
		req = {
			protocol: "http",
			get: jest.fn().mockReturnValue("localhost:3000"),
			file: {
				filename: "testfile.png",
			},
		};
		res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis(),
		};
		process.env.UPLOADS_STATIC_DIR = "/uploads";
	});

	test("should return 200 and file URL when a file is uploaded", () => {
		uploadFile(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith({
			fileUrl: "http://localhost:3000/uploads/testfile.png",
		});
	});

	test("should return 400 when no file is uploaded", () => {
		req.file = null;

		uploadFile(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.send).toHaveBeenCalledWith({ error: "No file uploaded" });
	});
});
