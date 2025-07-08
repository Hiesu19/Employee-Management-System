const authService = require('../services/auth.service');

const { successResponse, errorResponse } = require('../utils/response.utils');
const { ResponseError } = require('../error/ResponseError.error');
const { v4: uuidv4 } = require('uuid');
const e = require('express');

class AuthController {
    async login(req, res) {
        successResponse(res, "Login successfully");
    }

    async register(req, res, next) {
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
            next(error);
        }

    }
}

module.exports = new AuthController();