'use strict';
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashPassword = (pw) => bcrypt.hashSync(pw, 10);

    await queryInterface.bulkInsert("users", [
      {
        userID: "user100",
        fullName: "Nguyễn Thái Hiếu",
        email: "hieu1@example.com",
        phone: "0900000000",
        password: hashPassword("123456@"),
        role: "employee",
        departmentID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userID: "user101",
        fullName: "Nguyễn Thái Hiếu",
        email: "hieu2@example.com",
        phone: "0900000001",
        password: hashPassword("123456@"),
        role: "employee",
        departmentID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userID: "user102",
        fullName: "Nguyễn Thái Hiếu",
        email: "hieu3@example.com",
        phone: "0900000002",
        password: hashPassword("123456@"),
        role: "employee",
        departmentID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userID: "user103",
        fullName: "Nguyễn Thái Hiếu",
        email: "hieu4@example.com",
        phone: "0900000003",
        password: hashPassword("123456@"),
        role: "employee",
        departmentID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userID: "user104",
        fullName: "Nguyễn Thái Hiếu",
        email: "hieu5@example.com",
        phone: "0900000004",
        password: hashPassword("123456@"),
        role: "employee",
        departmentID: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userID: "user105",
        fullName: "Nguyễn Thái Hiếu",
        email: "hieu6@example.com",
        phone: "0900000005",
        password: hashPassword("123456@"),
        role: "manager",
        departmentID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userID: "user106",
        fullName: "Nguyễn Thái Hiếu",
        email: "hieu7@example.com",
        phone: "0900000006",
        password: hashPassword("123456@"),
        role: "manager",
        departmentID: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  }
};
