const { Request, User } = require('../models/index.model');
const { checkTimeFromDateBeforeToDate } = require('../validation/time.validation');
const { ResponseError } = require('../error/ResponseError.error');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const createRequest = async (user, request) => {
    checkTimeFromDateBeforeToDate(request.fromDate, request.toDate);

    const newRequest = await Request.create({
        id: uuidv4(),
        userID: user.id,
        userEmail: user.email,
        type: request.type,
        status: 'pending',
        fromDate: request.fromDate,
        toDate: request.toDate,
        reason: request.reason,
    });

    // Gui email ()
    if (user.role === 'employee') {
        const mailTo = await User.findOne({ where: { role: 'manager' || 'root', departmentID: user.departmentID } });
    } else {
        const mailTo = await User.findOne({ where: { role: 'root' } });
    }
    ;
    return newRequest;
}

const getMyRequest = async (userID, offset, limit, dateStart, dateEnd) => {
    if (!dateStart || dateStart === null) {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        dateStart = lastYear;
    }
    if (!dateEnd || dateEnd === null) {
        dateEnd = new Date();
    }
    if (!offset || offset === null) {
        offset = 0;
    }
    if (!limit || limit === null) {
        limit = 10;
    }
    const request = await Request.findAll({
        where: { userID: userID, createdAt: { [Op.between]: [dateStart, dateEnd] } },
        offset: offset,
        limit: limit,
        order: [['createdAt', 'DESC']]
    });
    return request;
}

const updateMyRequest = async (requestID, userID, newRequest) => {
    checkTimeFromDateBeforeToDate(newRequest.fromDate, newRequest.toDate);

    const request = await Request.findOne({ where: { id: requestID } });
    if (!request) {
        throw new ResponseError(404, "Request not found");
    }
    if (request.userID !== userID) {
        throw new ResponseError(403, "You are not allowed to update this request");
    }
    if (request.status !== 'pending') {
        throw new ResponseError(400, "Request is not pending");
    }
    request.type = newRequest.type || request.type;
    request.fromDate = newRequest.fromDate || request.fromDate;
    request.toDate = newRequest.toDate || request.toDate;
    request.reason = newRequest.reason || request.reason;

    await request.save();
    return request;
}

const deleteMyRequest = async (requestID, userID) => {
    const request = await Request.findOne({ where: { id: requestID } });
    if (!request) {
        throw new ResponseError(404, "Request not found");
    }
    if (request.userID !== userID) {
        throw new ResponseError(403, "You are not allowed to delete this request");
    }
    if (request.status !== 'pending') {
        throw new ResponseError(400, "Request is not pending");
    }
    await request.destroy();
    return request;
}

const getAllRequestByRoot = async (offset, limit, dateStart, dateEnd, status) => {
    if (!dateStart || dateStart === null) {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        dateStart = lastYear;
    }
    if (!dateEnd || dateEnd === null) {
        dateEnd = new Date();
    }

    if (!offset || offset === null) {
        offset = 0;
    }
    if (!limit || limit === null) {
        limit = 10;
    }

    if (!status || status === null) {
        const requests = await Request.findAll({
            where: { createdAt: { [Op.between]: [dateStart, dateEnd] } },
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']]
        });
        return requests;
    } else {
        const requests = await Request.findAll({
            where: { createdAt: { [Op.between]: [dateStart, dateEnd] }, status: status },
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']]
        });
        return requests;
    }
}

const getAllRequestByManager = async (managerID, offset, limit, dateStart, dateEnd, status) => {
    if (!dateStart || dateStart === null) {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        dateStart = lastYear;
    }
    if (!dateEnd || dateEnd === null) {
        dateEnd = new Date();
    }

    if (!offset || offset === null) {
        offset = 0;
    }
    if (!limit || limit === null) {
        limit = 10;
    }

    const manager = await User.findOne({ where: { userID: managerID } });
    if (!manager) {
        throw new ResponseError(404, "Manager not found");
    }
    const departmentID = manager.departmentID;

    const requests = await Request.findAll({
        where: {
            createdAt: { [Op.between]: [dateStart, dateEnd] },
            ...(status ? { status: status } : {})
        },
        include: [{
            model: User,
            where: {
                role: 'employee',
                departmentID: departmentID
            },
            attributes: ['userID', 'fullName', 'email']
        }],
        offset: offset,
        limit: limit,
        order: [['createdAt', 'DESC']]
    });
    return requests;
}

const editStatusRequestByRoot = async (requestID, user, status) => {
    const request = await Request.findOne({ where: { id: requestID } });
    if (!request) {
        throw new ResponseError(404, "Request not found");
    }
    if (request.status !== 'pending') {
        throw new ResponseError(400, "Request is not pending");
    }
    request.status = status;
    request.checkedAt = new Date();
    request.checkedBy = user.id;
    request.checkedByEmail = user.email;

    // Gui email
    const user = await User.findOne({
        where: { userID: request.userID },
        attributes: ['email']
    });
    const mailTo = user?.email;


    await request.save();
}

const editStatusRequestByManager = async (requestID, manager, status) => {
    if (status !== 'approved' && status !== 'rejected') {
        throw new ResponseError(400, "Invalid status");
    }

    // Kiểm tra request
    const request = await Request.findOne({ where: { id: requestID } });
    if (!request) {
        throw new ResponseError(404, "Request not found");
    }
    if (request.status !== 'pending') {
        throw new ResponseError(400, "Request is not pending");
    }

    // Kiểm tra user
    const user = await User.findOne({ where: { userID: request.userID } });
    if (!user) {
        throw new ResponseError(404, "User not found");
    }
    if (user.role !== 'employee') {
        throw new ResponseError(400, "User is not an employee");
    }

    // Kiểm tra manager có cùng department với user không
    const managerFound = await User.findOne({ where: { userID: manager.id } });
    if (!managerFound) {
        throw new ResponseError(404, "Manager not found");
    }
    if (managerFound.departmentID !== user.departmentID) {
        throw new ResponseError(400, "Manager is not in the same department as the user");
    }
    request.status = status;
    request.checkedAt = new Date();
    request.checkedBy = manager.id;
    request.checkedByEmail = manager.email;

    // Gui email
    const mailTo = user.email;

    await request.save();
}


module.exports = {
    createRequest,
    getMyRequest,
    updateMyRequest,
    deleteMyRequest,
    getAllRequestByRoot,
    getAllRequestByManager,
    editStatusRequestByRoot,
    editStatusRequestByManager
}