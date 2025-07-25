'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('requests', {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            userID: {
                type: Sequelize.STRING,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'userID',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            userEmail: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM('sick', 'personal', 'other'),
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('pending', 'approved', 'rejected'),
                allowNull: false,
            },
            fromDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            toDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            reason: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            reasonReject: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            checkedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            checkedBy: {
                type: Sequelize.STRING,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'userID',
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
        await queryInterface.dropTable('requests');
    }
}; 