'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('check-in-out', {
      checkID: {
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
        allowNull: true,
      },
      checkInTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      checkOutTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('check-in-out');
  }
}; 