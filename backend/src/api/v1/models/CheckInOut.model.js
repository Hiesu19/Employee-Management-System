const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/db.config');

const CheckInOut = sequelize.define('CheckInOut', {
    checkID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'users',
            key: 'userID',
        },
        onDelete: 'SET NULL',
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    checkInTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    checkOutTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'check-in-out',
    timestamps: false,
});

module.exports = CheckInOut;
