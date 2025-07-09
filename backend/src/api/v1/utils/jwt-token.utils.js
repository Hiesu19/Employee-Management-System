const jwt = require('jsonwebtoken');

// Tạo access token
exports.generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.userID,
            role: user.role,
            email: user.email,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "2h" }
    );
}

// Tạo refresh token
exports.generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.userID,
            role: user.role,
            email: user.email,
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "7d" }
    );
}

