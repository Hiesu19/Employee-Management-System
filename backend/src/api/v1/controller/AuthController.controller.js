const authService = require('../services/auth.service');
const { v4: uuidv4 } = require('uuid');

class AuthController {
    async login(req, res) {
        res.status(200).json({
            success: true,
            message: 'Login successfully',
        });
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
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }

    }
}

module.exports = new AuthController();