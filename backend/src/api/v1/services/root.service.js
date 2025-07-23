const { User, Department } = require('../models/index.model');
const { ResponseError } = require('../error/ResponseError.error');
const { Op } = require('sequelize');

const getEmployeeInfo = async (employeeID) => {
    const employeeFound = await User.findOne({
        where: { userID: employeeID },
        attributes: {
            exclude: ['password']
        },
        include: [{
            model: Department,
            attributes: ['departmentName', 'departmentID']
        }]
    });
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
        departmentName: employeeFound.Department?.departmentName || null,
        departmentID: employeeFound.Department?.departmentID || null
    };
}

const getAllEmployeeInfo = async (page, limit) => {
    if (page < 0 || limit < 0) {
        throw new ResponseError(400, "Page and limit must be greater than 0");
    }
    const totalEmployees = await User.count();
    if ((page === 0 && limit === 0) || (page === null || limit === null)) {
        const employees = await User.findAll({
            attributes: {
                exclude: ['password']
            },
            include: [{
                model: Department,
                attributes: ['departmentName', 'departmentID']
            }]
        });
        return { totalEmployees, employees };
    }
    const offset = (page - 1) * limit;
    const employees = await User.findAll({
        offset,
        limit,
        attributes: {
            exclude: ['password']
        },
        include: [{
            model: Department,
            attributes: ['departmentName', 'departmentID']
        }]
    });
    return { totalEmployees, employees };
}

const searchEmployeeByEmailOrName = async (email, name) => {
    validateEmail(email);
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

const updateEmployeeInfo = async (employeeID, fullName, phone) => {
    const employeeFound = await User.findOne({ where: { userID: employeeID } });
    if (!employeeFound) {
        throw new ResponseError(404, "Employee not found");
    }
    if (employeeFound.role === "root") {
        throw new ResponseError(400, "Cannot update root user");
    }
    employeeFound.fullName = fullName || employeeFound.fullName;
    employeeFound.phone = phone || employeeFound.phone;
    await employeeFound.save();
    return {
        userID: employeeFound.userID,
        fullName: employeeFound.fullName,
        phone: employeeFound.phone,
    };
}


const deleteEmployee = async (employeeID) => {
    const employeeFound = await User.findOne({ where: { userID: employeeID } });
    if (!employeeFound) {
        throw new ResponseError(404, "Employee not found");
    }
    if (employeeFound.role === "root") {
        throw new ResponseError(400, "Cannot delete root user");
    }
    await employeeFound.destroy();
}

const changeDepartment = async (employeeID, departmentID, isKick) => {
    if (isKick === "true") {
        const employeeFound = await User.findOne({ where: { userID: employeeID } });
        if (employeeFound.role === "root") {
            throw new ResponseError(400, "Cannot change department of root user");
        }
        if (!employeeFound) {
            throw new ResponseError(404, "Employee not found");
        }
        employeeFound.departmentID = null;
    }
    else {
        const employeeFound = await User.findOne({ where: { userID: employeeID } });
        if (!employeeFound) {
            throw new ResponseError(404, "Employee not found");
        }
        if (employeeFound.role === "root") {
            throw new ResponseError(400, "Cannot change department of root user");
        }

        const departmentFound = await Department.findOne({ where: { departmentID: departmentID } });
        if (!departmentFound) {
            throw new ResponseError(404, "Department not found");
        }

        employeeFound.departmentID = departmentID;
        employeeFound.role = "employee"; // Mới vào phòng thì  là nhân viên
        const updatedEmployee = await employeeFound.save();
        return {
            userID: updatedEmployee.userID,
            fullName: updatedEmployee.fullName,
            email: updatedEmployee.email,
            phone: updatedEmployee.phone,
            departmentID: updatedEmployee.departmentID,
            role: updatedEmployee.role,
            departmentName: departmentFound.departmentName,
        };
    }


}

const changeRole = async (employeeID, role) => {
    const employeeFound = await User.findOne({ where: { userID: employeeID } });
    var departmentName = null;
    if (!employeeFound) {
        throw new ResponseError(404, "Employee not found");
    }
    if (employeeFound.role === "root") {
        throw new ResponseError(400, "Cannot change role of root user");
    }
    if (role !== "root" && role !== "manager" && role !== "employee") {
        throw new ResponseError(400, "Role is not valid");
    }

    if (role === "manager") {
        const departmentFound = await Department.findOne({ where: { departmentID: employeeFound.departmentID } });
        if (!departmentFound) {
            throw new ResponseError(404, "To change role to manager, the employee must be in a department");
        }
        departmentName = departmentFound.departmentName;
    }
    const oldRole = employeeFound.role;

    employeeFound.role = role;
    await employeeFound.save();
    const result = {
        userID: employeeFound.userID,
        fullName: employeeFound.fullName,
        email: employeeFound.email,
        phone: employeeFound.phone,
        departmentID: employeeFound.departmentID,
        departmentName: departmentName,
        role: employeeFound.role,
        oldRole: oldRole,
    }
    return result;
}

module.exports = {
    updateEmployeeInfo,
    deleteEmployee,
    getEmployeeInfo,
    getAllEmployeeInfo,
    searchEmployeeByEmailOrName,
    deleteEmployee,
    changeDepartment,
    changeRole

};