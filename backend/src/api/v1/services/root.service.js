const { User, Department } = require('../models/index.model');
const { ResponseError } = require('../error/ResponseError.error');
const { Op } = require('sequelize');

const getEmployeeInfo = async (employeeID) => {
    const employeeFound = await User.findOne({ where: { userID: employeeID } });
    if (!employeeFound) {
        throw new ResponseError(404, "Employee not found");
    }
    return {
        userID: employeeFound.userID,
        fullName: employeeFound.fullName,
        email: employeeFound.email,
        phone: employeeFound.phone,
        role: employeeFound.role,
        avatarURL: employeeFound.avatarURL,
        createdAt: employeeFound.createdAt,
        updatedAt: employeeFound.updatedAt,
    };
}

const getAllEmployeeInfo = async (page, limit) => {
    if (page < 0 || limit < 0) {
        throw new ResponseError(400, "Page and limit must be greater than 0");
    }
    if ((page === 0 && limit === 0) || (page === null || limit === null)) {
        const employees = await User.findAll({
            attributes: {
                exclude: ['password']
            }
        });
        return employees;
    }
    const offset = (page - 1) * limit;
    const employees = await User.findAll({
        offset,
        limit,
        attributes: {
            exclude: ['password']
        }
    });
    return employees;
}

const searchEmployeeByEmailOrName = async (email, name) => {
    const whereConditions = [];

    if (email) {
        whereConditions.push({ email: { [Op.like]: `%${email}%` } });
    }

    if (name) {
        whereConditions.push({ fullName: { [Op.like]: `%${name}%` } });
    }

    if (whereConditions.length === 0) {
        throw new ResponseError(400, "Please provide either email or name to search");
    }

    const employees = await User.findAll({
        where: {
            [Op.or]: whereConditions
        },
        attributes: {
            exclude: ['password']
        }
    });
    return employees;
}

const updateEmployeeInfo = async (employeeID, fullName, email, phone) => {
    const employeeFound = await User.findOne({ where: { userID: employeeID } });
    if (!employeeFound) {
        throw new ResponseError(404, "Employee not found");
    }
    employeeFound.fullName = fullName || employeeFound.fullName;
    employeeFound.email = email || employeeFound.email;
    employeeFound.phone = phone || employeeFound.phone;
    await employeeFound.save();
    return {
        userID: employeeFound.userID,
        fullName: employeeFound.fullName,
        email: employeeFound.email,
        phone: employeeFound.phone,
    };
}

const deleteEmployee = async (employeeID) => {
    const employeeFound = await User.findOne({ where: { userID: employeeID } });
    if (!employeeFound) {
        throw new ResponseError(404, "Employee not found");
    }
    await employeeFound.destroy();
}

const changeDepartment = async (employeeID, departmentID) => {
    const employeeFound = await User.findOne({ where: { userID: employeeID } });
    if (!employeeFound) {
        throw new ResponseError(404, "Employee not found");
    }

    const departmentFound = await Department.findOne({ where: { departmentID: departmentID } });
    if (!departmentFound) {
        throw new ResponseError(404, "Department not found");
    }

    employeeFound.departmentID = departmentID;
    const updatedEmployee = await employeeFound.save();
    return {
        userID: updatedEmployee.userID,
        fullName: updatedEmployee.fullName,
        email: updatedEmployee.email,
        phone: updatedEmployee.phone,
        departmentID: updatedEmployee.departmentID,
        departmentName: departmentFound.departmentName,
    };
}

module.exports = {
    updateEmployeeInfo,
    deleteEmployee,
    getEmployeeInfo,
    getAllEmployeeInfo,
    searchEmployeeByEmailOrName,
    deleteEmployee,
    changeDepartment

};