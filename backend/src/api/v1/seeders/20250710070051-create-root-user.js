'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash(process.env.ROOT_PASSWORD, 10);
    const ROOT_EMAIL = process.env.ROOT_EMAIL || 'root@example.com';

    await queryInterface.bulkInsert('users', [
      {
        userID: uuidv4(),
        fullName: 'Root Admin',
        email: ROOT_EMAIL,
        phone: '0800000000',
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
      email: ROOT_EMAIL,
    });
  }
};
