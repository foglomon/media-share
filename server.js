const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

let ext;
let randomName;
let fullPath;

const storage = multer.diskStorage({
	destination: "public/media/",
	filename: function (req, file, cb) {
		ext = path.extname(file.originalname);
		do {
			randomName = Math.random().toString(16).substring(2, 10);
			fullPath = `public/media/${randomName}${ext}`;
		} while (fs.existsSync(fullPath));
		cb(null, `${randomName}${ext}`);
		app.get("/media/" + randomName + ext, (req, res) => {
			res.sendFile(`${__dirname}/media/${randomName}${ext}`);
		});
	},
});
const upload = multer({storage: storage});

app.post("/upload", upload.single("file"), (req, res) => {
	console.log(req.file);
	res.send(`media/${randomName}${ext}`);
});
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile("index.html");
});

app.listen(port, console.log(`Listening on port ${port}...`));
