const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/db.config');

const Request = sequelize.define('Request', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    userID: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'users',
            key: 'userID',
        },
        onDelete: 'SET NULL',
    },
    type: {
        type: DataTypes.ENUM('sick', 'personal', 'other'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
    },
    fromDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    toDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    approvalDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    approvalBy: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'users',
            key: 'userID',
        },
        onDelete: 'SET NULL',
    },
}, {
    tableName: 'requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Request;