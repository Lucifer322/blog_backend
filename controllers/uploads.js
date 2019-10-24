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

const uploadArray = upload.array("pics", 10);

const uploadFiles = async (req, res, next) => {
  //   for (const file of req.files) {
  //     file.src = await uploadFile(file.path);
  //   }
  const promises = []; // то же что и выше только загружает паралельно
  for (const file of req.files) {
    const promise = (async () => (file.src = await uploadFile(file.path)))();
    promises.push(promise);
  }
  await Promise.all(promises);
  next();
};

module.exports = {
  uploadArray,
  uploadFiles
};
