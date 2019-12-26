const { uploadFile } = require("../storage/s3");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./tmp/my-uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else cb(null, false);
};
const limits = { fileSize: 5200000 };
const upload = multer({ storage, limits, fileFilter });

const uploadArray = upload.single("pics");

const uploadFiles = async (req, res, next) => {
  if (!req.file) {
    let error = new Error("Incoming data is not a file");
    error.name = "ValidationError";
    throw error;
  }
  req.file.src = await uploadFile(req.file.path);
  next();
};

module.exports = {
  uploadArray,
  uploadFiles
};
