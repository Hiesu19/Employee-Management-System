const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/db.config');


const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users',
            key: 'userID',
        },
        onDelete: 'CASCADE',
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'refresh_tokens',
    timestamps: true,
    createdAt: 'created_at'
});

module.exports = RefreshToken;