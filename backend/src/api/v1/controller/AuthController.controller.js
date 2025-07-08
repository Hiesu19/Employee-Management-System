const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/respone.utils');
const { v4: uuidv4 } = require('uuid');

class AuthController {
    async login(req, res) {
        try {
            successResponse(res, "Login successfully");
        } catch (error) {
            errorResponse(res, error);
        }
    }

    async register(req, res) {
        try {
            const { userName, email, phone, password, avatarURL } = req.body;
            const newUser = {
                userID: uuidv4(),
                userName,
                email,
                phone,
                password,
                avatarURL: avatarURL || null,
            }

            const user = await authService.createUser(newUser);
            successResponse(res, user, "User created successfully");
        } catch (error) {
            errorResponse(res, error);
        }

    }
}

module.exports = new AuthController();