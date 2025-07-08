const User = require('../models/User.model');

const createUser = async (user) => {
    try {
        const newUser = await User.create(user);
        return newUser;
    } catch (error) {
        throw error;
    }
}

module.exports = { createUser };