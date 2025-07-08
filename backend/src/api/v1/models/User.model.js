const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/db.config');

const User = sequelize.define('User', {
    userID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('root', 'manager', 'employee'),
        allowNull: false,
        defaultValue: 'employee',
    },
    avatarURL: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'users',
    timestamps: true,
});

module.exports = User;