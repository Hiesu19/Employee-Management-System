const authService = require('../services/auth.service');

const { successResponse, errorResponse } = require('../utils/response.utils');
const { ResponseError } = require('../error/ResponseError.error');

class AuthController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { userResponse, accessToken, refreshToken } = await authService.login(email, password);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 2 * 24 * 60 * 60 * 1000
            });

            successResponse(res, { user: userResponse, accessToken }, "Login successfully");
        } catch (error) {
            next(error);
        }
    }

    async register(req, res, next) {
        try {
            const { fullName, email, phone, password, avatarURL } = req.body;
            const user = {
                fullName,
                email,
                phone,
                password,
                avatarURL: avatarURL || null,
            }

            const userResponse = await authService.createUser(user);
            successResponse(res, userResponse, "User created successfully");
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const cookie = req.cookies;

            if (!cookie?.refreshToken) {
                return errorResponse(res, new ResponseError(401, "Refresh token not found"));
            }
            const refreshToken = cookie.refreshToken;
            const accessToken = await authService.refreshTokenHandler(refreshToken);

            successResponse(res, { accessToken }, "Refresh token successfully");
        }
        catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();