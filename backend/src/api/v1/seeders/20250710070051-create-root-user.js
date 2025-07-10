'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash(process.env.ROOT_PASSWORD, 10);

    await queryInterface.bulkInsert('users', [
      {
        userID: uuidv4(),
        fullName: 'Root Admin',
        email: 'root@example.com',
        phone: '0900000000',
        password: hashedPassword,
        role: 'root',
        avatarURL: null,
        departmentID: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: 'root@example.com',
    });
  }
};
