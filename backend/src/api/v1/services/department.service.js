const { Department } = require('../models/index.model');
const { v4: uuidv4 } = require('uuid');

const createDepartment = async (departmentName) => {
    const department = await Department.create({
        departmentID: uuidv4(),
        departmentName,
    });
    return department;
}

module.exports = { createDepartment };