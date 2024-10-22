exports.uploadFile = (req, res) => {
	if (!req.file) {
		return res.status(400).send({ error: "No file uploaded" });
	}

	const fileUrl = `${req.protocol}://${req.get("host")}${process.env.UPLOADS_STATIC_DIR}/${
		req.file.filename
	}`;
	res.status(200).send({ fileUrl });
};
