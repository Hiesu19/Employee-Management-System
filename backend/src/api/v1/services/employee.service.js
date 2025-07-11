const { User, Department } = require('../models/index.model');
const { ResponseError } = require('../error/ResponseError.error');

const getMyInfo = async (userID) => {
    const employee = await User.findOne({
        where: { userID: userID },
        attributes: { exclude: ['password'] }
    });
    if (!employee) {
        throw new ResponseError(404, "Employee not found");
    }
    const department = await Department.findOne({
        where: { departmentID: employee.departmentID },
        attributes: { exclude: ['departmentID'] }
    });

    const result = {
        userID: employee.userID,
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        mustChangePassword: employee.mustChangePassword,
        avatarURL: employee.avatarURL,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
        department: department
    }
    return result;
}

const updateMyInfo = async (userID, fullName, phone) => {
    const employee = await User.findOne({ where: { userID: userID } });
    if (!employee) {
        throw new ResponseError(404, "Employee not found");
    }
    employee.fullName = fullName || employee.fullName;
    employee.phone = phone || employee.phone;
    await employee.save();
    return getMyInfo(userID);
}

module.exports = {
    getMyInfo,
    updateMyInfo
}