const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../config/db.config');

const Department = sequelize.define('Department', {
    departmentID: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    departmentName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'departments',
    timestamps: true,
});

module.exports = Department;