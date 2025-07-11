const multer = require('multer');
const path = require('path');
const { ResponseError } = require('../error/ResponseError.error');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new ResponseError(400, 'Only image files are allowed!'));
  }
};


const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter
});

module.exports = upload;
