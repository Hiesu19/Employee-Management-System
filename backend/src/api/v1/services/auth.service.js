const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User.model');
const RefreshToken = require('../models/RefreshToken.model');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt-token.utils');
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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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

    await saveRefreshToken(user.userID, refreshToken);
    return { userResponse, accessToken, refreshToken };

}

const saveRefreshToken = async (userID, refreshToken) => {
    try {
        const newRefreshToken = {
            userID,
            refreshToken,
        }
        await RefreshToken.create(newRefreshToken);
    } catch (error) {
        throw error;
    }
}

const refreshTokenHandler = async (refreshToken) => {
    try {
        const res = await RefreshToken.findOne({ where: { refreshToken } });
        if (!res) {
            throw new ResponseError(400, "Invalid refresh token");
        }

        const user = await User.findOne({ where: { userID: res.userID } });
        if (!user) {
            throw new ResponseError(400, "User not found");
        }

        const accessToken = generateAccessToken(user);
        return accessToken;
    }
    catch (error) {
        throw error;
    }
}

const logout = async (refreshToken) => {
    try {
        const res = await RefreshToken.findOne({ where: { refreshToken } });
        if (!res) {
            throw new ResponseError(400, "Invalid refresh token");
        }
        await RefreshToken.destroy({ where: { userID: res.userID } });
    }
    catch (error) {
        throw error;
    }
}

module.exports = { createUser, login, saveRefreshToken, refreshTokenHandler, logout };