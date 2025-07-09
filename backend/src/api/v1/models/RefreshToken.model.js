const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/db.config');


const RefreshToken = sequelize.define('RefreshToken', {
    userID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'users',
            key: 'userID',
        },
        onDelete: 'CASCADE',
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'refresh_tokens',
    timestamps: true,
    createdAt: 'created_at'
});

module.exports = RefreshToken;