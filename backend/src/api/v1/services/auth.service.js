const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User.model');
const { generateAccessToken } = require('../utils/jwt-token.utils');
const { ResponseError } = require('../error/ResponseError.error');

const createUser = async (user) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        const newUser = {
            userID: uuidv4(),
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            password: hashedPassword,
            avatarURL: user.avatarURL,
        }

        const newUserResponse = await User.create(newUser);

        const newUserResponseWithoutPassword = {
            userID: newUserResponse.userID,
            fullName: newUserResponse.fullName,
            email: newUserResponse.email,
            phone: newUserResponse.phone,
            avatarURL: newUserResponse.avatarURL,
            role: newUserResponse.role,
            createdAt: newUserResponse.createdAt,
            updatedAt: newUserResponse.updatedAt,
        }
        return newUserResponseWithoutPassword;
    } catch (error) {
        throw error;
    }

}

const login = async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ResponseError(400, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(400, "Invalid password");
    }

    const token = generateAccessToken(user);
    const userResponse = {
        userID: user.userID,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarURL: user.avatarURL,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
    return { userResponse, token };

}

module.exports = { createUser, login };