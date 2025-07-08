const authService = require('../services/auth.service');

const { successResponse, errorResponse } = require('../utils/response.utils');

class AuthController {
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { userResponse, token } = await authService.login(email, password);
            successResponse(res, { user: userResponse, accessToken: token }, "Login successfully");
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
}

module.exports = new AuthController();