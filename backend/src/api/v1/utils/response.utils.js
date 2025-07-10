// Cấu trúc gửi về client thành công
exports.successResponse = (res, data, message = "OK") => {
    return res.status(200).json({
        success: "success",
        message,
        data
    })
}

// Cấu trúc gửi về client lỗi
exports.errorResponse = (res, error, statusCode = 400) => {
    const finalStatusCode = error.status || statusCode;

    return res.status(finalStatusCode).json({
        status: "error",
        message: error.message || error
    });
};