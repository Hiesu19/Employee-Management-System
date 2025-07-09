const jwt = require("jsonwebtoken");
const { ResponseError } = require("../error/ResponseError.error");

// Verify access token
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return next(new ResponseError(401, "Access token is required"));
        }

        if (!token.startsWith('Bearer ')) {
            return next(new ResponseError(401, "Invalid token format. Use 'Bearer <token>'"));
        }

        const accessToken = token.split(" ")[1];

        if (!accessToken) {
            return next(new ResponseError(401, "Access token is required"));
        }

        jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
            if (err) {
                return next(new ResponseError(401, "Invalid access token"));

            }
            if (!user) {
                return next(new ResponseError(401, "Invalid token payload"));
            }

            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
}

// Verify access token và kiểm tra role
const verifyTokenAndCheckRole = (roles) => {
    return (req, res, next) => {
        verifyToken(req, res, (err) => {
            if (err) return next(err);

            if (!roles.includes(req.user.role)) {
                return next(new ResponseError(403, `You are not allowed <${roles.join(", ")}>`));
            }

            next();
        });
    };
}
module.exports = { verifyToken, verifyTokenAndCheckRole };