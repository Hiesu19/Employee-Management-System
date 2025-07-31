function validatePassword(password) {
    const minLength = 8;
    if (typeof password !== "string") return false;
    if (password.length < minLength) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/~`+=;]/.test(password)) return false;
    return true;
}

module.exports = { validatePassword };
