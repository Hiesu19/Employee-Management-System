'use strict';
const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("check-in-out", [
      {
        checkID: "checkinout001",
        userID: "user100",
        userEmail: "hieu1@example.com",
        checkInTime: "11:00:00",
        checkOutTime: "17:00:00",
        date: new Date("2025-07-14"),
        createdAt: now
      },
      {
        checkID: "checkinout002",
        userID: "user101",
        userEmail: "hieu2@example.com",
        checkInTime: "11:00:00",
        checkOutTime: "17:00:00",
        date: new Date("2025-07-14"),
        createdAt: now
      },
      {
        checkID: "checkinout003",
        userID: "user102",
        userEmail: "hieu3@example.com",
        checkInTime: "11:00:00",
        checkOutTime: "17:00:00",
        date: new Date("2025-07-14"),
        createdAt: now
      },
      {
        checkID: "checkinout004",
        userID: "user102",
        userEmail: "hieu3@example.com",
        checkInTime: "11:00:00",
        checkOutTime: "17:20:00",
        date: new Date("2025-07-13"),
        createdAt: now
      },
      {
        checkID: "checkinout005",
        userID: "user102",
        userEmail: "hieu3@example.com",
        checkInTime: "09:00:00",
        checkOutTime: "17:20:00",
        date: new Date("2025-07-11"),
        createdAt: now
      },
      {
        checkID: "checkinout006",
        userID: "user102",
        userEmail: "hieu3@example.com",
        checkInTime: "09:00:00",
        checkOutTime: "17:20:00",
        date: new Date("2025-06-14"),
        createdAt: now
      },
      {
        checkID: "checkinout007",
        userID: "user105",
        userEmail: "hieu6@example.com",
        checkInTime: "11:00:00",
        checkOutTime: "17:00:00",
        date: new Date("2025-07-14"),
        createdAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("check-in-out", null, {});
  }
};
