const { Department, User } = require('../models/index.model');
const { ResponseError } = require('../error/ResponseError.error');
const { v4: uuidv4 } = require('uuid');

const createDepartment = async (departmentName, description) => {
    const department = await Department.create({
        departmentID: uuidv4(),
        departmentName,
        description,
    });
    return department;
}

const getDepartments = async (page, limit, all = false) => {
    if (page < 0 || limit < 0) {
        throw new ResponseError(400, "Page and limit must be greater than 0");
    }

    if (all === "true") {
        const departments = await Department.findAll();
        const departmentsWithUserCount = await Promise.all(departments.map(async (department) => {
            const userCount = await User.count({ where: { departmentID: department.departmentID } });

            return {
                ...department.toJSON(),
                userCount,
            };
        }));

        return departmentsWithUserCount;
    }

    const offset = (page - 1) * limit;
    const departments = await Department.findAll({
        offset,
        limit,
    });
    const departmentsWithUserCount = await Promise.all(departments.map(async (department) => {
        const userCount = await User.count({ where: { departmentID: department.departmentID } });
        return { ...department.toJSON(), userCount };
    }));

    return departmentsWithUserCount;
}

const getDepartmentDetails = async (departmentID, page = 1, limit = 10) => {
    const department = await Department.findOne({ where: { departmentID } });
    if (!department) {
        throw new ResponseError(404, "Department not found");
    }

    if (page < 0 || limit < 0) {
        throw new ResponseError(400, "Page and limit must be greater than 0");
    }

    const countEmployees = await User.count({ where: { departmentID } });
    const managers = await User.findAll({ where: { departmentID, role: 'manager' }, attributes: ['userID', 'fullName', 'email', 'role', 'avatarURL'] });

    const offset = (page - 1) * limit;
    const employees = await User.findAll({
        where: { departmentID },
        attributes: ['userID', 'fullName', 'email', 'role', 'avatarURL'],
        offset,
        limit,
    });

    const departmentDetails = { ...department.toJSON(), countEmployees, managers, employees };
    return departmentDetails;
}

const updateDepartmentInfo = async (departmentID, departmentName, description) => {
    const departmentFound = await Department.findOne({ where: { departmentID } });
    if (!departmentFound) {
        throw new ResponseError(404, "Department not found");
    }
    departmentFound.departmentName = departmentName || departmentFound.departmentName;
    departmentFound.description = description || departmentFound.description;
    await departmentFound.save();
    return departmentFound;
}

const deleteDepartment = async (departmentID) => {
    const departmentFound = await Department.findOne({ where: { departmentID } });
    if (!departmentFound) {
        throw new ResponseError(404, "Department not found");
    }
    await departmentFound.destroy();
    return departmentFound;
}

module.exports = { createDepartment, getDepartments, getDepartmentDetails, updateDepartmentInfo, deleteDepartment };