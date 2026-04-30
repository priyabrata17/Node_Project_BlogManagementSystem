const multer = require("multer");
const { storage } = require("../config/cloudinaryConfig");

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only images (jpg, jpeg, png) and pdf files are allowed"),
      false,
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1mb
    files: 1,
  },
  fileFilter,
});

module.exports = upload;
