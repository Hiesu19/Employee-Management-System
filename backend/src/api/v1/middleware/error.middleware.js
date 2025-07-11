const { ResponseError } = require('../error/ResponseError.error');
const { errorResponse } = require('../utils/response.utils');
const multer = require('multer');
// Error middleware
const errorMiddleware = (err, req, res, next) => {
    // Nếu lỗi là ResponseError thì trả về lỗi
    if (err instanceof ResponseError) {
        return errorResponse(res, err, err.status);
    }

    // Lỗi do trùng dữ liệu
    if (err.name === "SequelizeUniqueConstraintError") {
        return errorResponse(res, { message: err.errors[0].message || "Internal server error" }, 500);
    }

    // Lỗi do multer
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return errorResponse(res, { message: "File size exceeds the limit of 3MB" }, 400);
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return errorResponse(res, { message: "Only one file is allowed" }, 400);
        }

        return errorResponse(res, { message: err.message || "Internal server error" }, 500);
    }

    // Lỗi khác
    console.log(err);
    return errorResponse(res, { message: err.message || "Internal server error" }, 500);
}

module.exports = errorMiddleware;
