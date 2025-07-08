const { ResponseError } = require('../error/ResponseError.error');
const { errorResponse } = require('../utils/response.utils');

const errorMiddleware = (err, req, res, next) => {
    if (err instanceof ResponseError) {
        return errorResponse(res, err, err.status);
    }
    if (err.name === "SequelizeUniqueConstraintError") {
        return errorResponse(res, { message: err.errors[0].message || "Internal server error" }, 500);
    }

    console.log(err);
    return errorResponse(res, { message: err.message || "Internal server error" }, 500);
}

module.exports = errorMiddleware;
