const { User, Department, CheckInOut } = require('../models/index.model');
const { ResponseError } = require('../error/ResponseError.error');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const getMyInfo = async (userID) => {
    const employee = await User.findOne({
        where: { userID: userID },
        attributes: { exclude: ['password'] },
        include: {
            model: Department,
            attributes: { exclude: ['departmentID'] },
        }
    });
    if (!employee) {
        throw new ResponseError(404, "Employee not found");
    }

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
        department: employee.Department ? employee.Department.departmentName : null
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

const getMyCheckInOut = async (userID, offset, limit, dateStart, dateEnd) => {
    if (!dateStart || dateStart === null) {
        dateStart = new Date(1970, 1, 1);
    }
    if (!dateEnd || dateEnd === null) {
        dateEnd = new Date(9999, 12, 31);
    }
    if (!offset || offset === null) {
        offset = 0;
    }
    if (!limit || limit === null) {
        limit = 10;
    }

    const checkInOutFound = await CheckInOut.findAll({
        where: { userID: userID, date: { [Op.between]: [dateStart, dateEnd] } },
        offset: offset,
        limit: limit,
        order: [['date', 'DESC']],
        attributes: {
            exclude: ['userID', 'userEmail', 'checkID']
        }
    });

    var totalTimeWork = 0;
    const checkInOut = checkInOutFound.map(record => {
        const plainRecord = record.toJSON();
        const checkInTime = new Date(`1970-01-01T${plainRecord.checkInTime}`);
        const checkOutTime = new Date(`1970-01-01T${plainRecord.checkOutTime}`);
        const timeWork = (checkOutTime.getTime() - checkInTime.getTime()) / 1000 || 0;
        totalTimeWork += timeWork;
        return { ...plainRecord, timeWork };
    });

    return {
        total: checkInOut.length,
        totalTimeWork: totalTimeWork,
        checkInOut
    };
};

const getMyDepartment = async (user, offset, limit) => {
    const countEmployees = await User.count({
        where: { departmentID: user.departmentID, role: { [Op.or]: ['employee'] } }
    });

    const employees = await User.findAll({
        where: { departmentID: user.departmentID, role: { [Op.or]: ['employee'] } },
        attributes: { exclude: ['password'] },
        include: {
            model: Department,
            attributes: { exclude: ['departmentID'] }
        },
        offset: offset || 0,
        limit: limit || 10
    });
    const result = employees.map(employee => {
        return {
            userID: employee.userID,
            fullName: employee.fullName,
            email: employee.email,
            phone: employee.phone,
            role: employee.role,
            department: employee.Department.departmentName,
            avatarURL: employee.avatarURL,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt,

        }
    });
    return { count: countEmployees, result };
}

const getMyDepartmentEmployee = async (manager, employeeID) => {
    const employee = await User.findOne({ where: { userID: employeeID }, attributes: { exclude: ['password'] } });
    if (!employee) {
        throw new ResponseError(404, "Employee not found");
    }
    if (employee.departmentID !== manager.departmentID) {
        throw new ResponseError(403, "You are not allowed to access this employee");
    }
    return employee;
}
module.exports = {
    getMyInfo,
    updateMyInfo,
    checkIn,
    checkOut,
    getMyCheckInOut,
    getMyDepartment,
    getMyDepartmentEmployee
}