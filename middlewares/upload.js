const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const FILES_TMP = path.resolve("./tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILES_TMP);
  },
  filename: (req, file, cb) => {
    const [_, ext] = file.originalname.split(".");
    cb(null, `${uuidv4()}.${ext}`);
  },
});

module.exports = { storage };
