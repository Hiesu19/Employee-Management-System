const User = require('../models/User.model');

const createUser = async (user) => {
    try {
        const newUser = await User.create(user);

        const newUserResponse = {
            userID: newUser.userID,
            userName: newUser.userName,
            email: newUser.email,
            phone: newUser.phone,
            avatarURL: newUser.avatarURL,
        }
        return newUserResponse;
    } catch (error) {
        throw error;
    }

}

module.exports = { createUser };