'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            userID: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            fullName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            role: {
                type: Sequelize.ENUM('root', 'manager', 'employee'),
                allowNull: false,
                defaultValue: 'employee',
            },
            avatarURL: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            mustChangePassword: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            departmentID: {
                type: Sequelize.STRING,
                allowNull: true,
                references: {
                    model: 'departments',
                    key: 'departmentID',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
}; 