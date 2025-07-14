'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("departments", [
      {
        departmentID: "1",
        departmentName: "D1",
        description: "Division 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        departmentID: "2",
        departmentName: "D2",
        description: "Division 2",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("departments", null, {});
  }
};
