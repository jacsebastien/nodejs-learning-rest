const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // store images in /images folder
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4()); // create a uuid to store the name
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (allowedMimeTypes.indexOf(file.mimetype) !== -1) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// get the 'image' field and store the file from it
module.exports = multer({ storage: fileStorage, fileFilter }).single("image");
