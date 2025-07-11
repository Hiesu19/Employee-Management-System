const { User, Department, CheckInOut } = require('../models/index.model');
const { ResponseError } = require('../error/ResponseError.error');
const { v4: uuidv4 } = require('uuid');

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

const checkIn = async (user) => {
    const checkInToday = await CheckInOut.findOne({
        where: {
            userID: user.id,
            date: new Date(),
        },
    });
    if (checkInToday) {
        throw new ResponseError(400, "You have already checked in today");
    }

    const checkIn = await CheckInOut.create({
        checkID: uuidv4(),
        userID: user.id,
        userEmail: user.email,
        checkInTime: new Date().toTimeString().slice(0, 8),
        checkOutTime: null,
        date: new Date(),
    });
    return checkIn;
}

const checkOut = async (user) => {
    const checkInToday = await CheckInOut.findOne({
        where: {
            userID: user.id,
            date: new Date(),
        },
    });
    if (checkInToday) {
        if (checkInToday.checkOutTime) {
            throw new ResponseError(400, "You have already checked out today");
        }
        checkInToday.checkOutTime = new Date().toTimeString().slice(0, 8);
        await checkInToday.save();
        return checkInToday;
    } else {
        throw new ResponseError(400, "You haven't checked in today");
    }
}

module.exports = {
    getMyInfo,
    updateMyInfo,
    checkIn,
    checkOut
}