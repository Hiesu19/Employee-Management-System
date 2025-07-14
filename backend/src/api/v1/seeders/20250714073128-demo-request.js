'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert("requests", [
      {
        id: "request001",
        userID: "user100",
        userEmail: "hieu1@example.com",
        type: "sick",
        status: "pending",
        fromDate: new Date("2025-07-14"),
        toDate: new Date("2025-07-15"),
        reason: "I have a personal matter to attend to",
        approvedAt: null,
        approvedBy: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "request002",
        userID: "user104",
        userEmail: "hieu5@example.com",
        type: "personal",
        status: "pending",
        fromDate: new Date("2025-07-14"),
        toDate: new Date("2025-07-15"),
        reason: "I have a personal matter to attend to",
        approvedAt: null,
        approvedBy: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "request003",
        userID: "user106",
        userEmail: "hieu7@example.com",
        type: "other",
        status: "pending",
        fromDate: new Date("2025-07-14"),
        toDate: new Date("2025-07-15"),
        reason: "I have a personal matter to attend to",
        approvedAt: null,
        approvedBy: null,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("requests", null, {});
  }
};
