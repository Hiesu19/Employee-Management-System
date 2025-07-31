const { ResponseError } = require("../error/ResponseError.error");

function validatePassword(password) {
    const minLength = 8;
    if (typeof password !== "string") throw new ResponseError(400, "Password must be a string");
    if (password.length < minLength) throw new ResponseError(400, "Password must be at least 8 characters");
    if (!/[A-Z]/.test(password)) throw new ResponseError(400, "Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) throw new ResponseError(400, "Password must contain at least one lowercase letter");
    if (!/[0-9]/.test(password)) throw new ResponseError(400, "Password must contain at least one number");
    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/~`+=;]/.test(password)) throw new ResponseError(400, "Password must contain at least one special character");
    return true;
}

module.exports = { validatePassword };
