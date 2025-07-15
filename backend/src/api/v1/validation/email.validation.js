const { ResponseError } = require('../error/ResponseError.error');

const validateEmail = (email) => {
    const allowedDomains = ['gmail.com', "zinza.com.vn", "example.com"];
    if (!email || typeof email !== 'string') {
        throw new ResponseError(400, "Email is required");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        throw new ResponseError(400, "Invalid email format");
    }

    if (email.length > 254) {
        throw new ResponseError(400, "Email is too long");
    }

    if (allowedDomains.length > 0) {
        const domain = email.split('@')[1].toLowerCase();
        const isAllowed = allowedDomains.some(allowedDomain =>
            domain === allowedDomain.toLowerCase()
        );

        if (!isAllowed) {
            throw new ResponseError(400, `Email domain must be one of: ${allowedDomains.join(', ')}`);
        }
    }
    return true;
};

module.exports = { validateEmail }; 