const multer = require("multer");
const path = require("path");

const tmpDir = path.resolve(__dirname, "../tmp");

const uploadConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpDir);
  },
  filename: function (req, file, cb) {
    cb(null, Math.random() + file.originalname);
  },
  limits: {
    fileSize: 2048,
  },
});

const upload = multer({ storage: uploadConfig });

module.exports = upload;
