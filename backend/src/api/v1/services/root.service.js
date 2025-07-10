const { User } = require('../models/index.model');
const { ResponseError } = require('../error/ResponseError.error');

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

module.exports = { updateEmployeeInfo, deleteEmployee };