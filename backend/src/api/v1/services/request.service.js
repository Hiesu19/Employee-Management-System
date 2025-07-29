const { Request, User } = require('../models/index.model');
const { checkTimeFromDateBeforeToDate } = require('../validation/time.validation');
const { ResponseError } = require('../error/ResponseError.error');
const { nanoid } = require('nanoid');
const { Op } = require('sequelize');
const { sendEmailHTML } = require('../utils/send-email.utils');
const { genRequestHTML, genRequestHTMLRequestRejected, genRequestHTMLRequestApproved } = require('../utils/gen-requestHTML.utils');

const createRequest = async (user, request) => {
    checkTimeFromDateBeforeToDate(request.fromDate, request.toDate);
    const userFound = await User.findOne({ where: { userID: user.id } });

    if (!userFound) {
        throw new ResponseError(404, "User not found");
    }

    const newRequest = await Request.create({
        id: nanoid(8),
        userID: user.id,
        userEmail: user.email,
        type: request.type,
        status: 'pending',
        fromDate: request.fromDate,
        toDate: request.toDate,
        reason: request.reason,
    });

    const html = genRequestHTML(userFound, newRequest);

    // Gui email cho manager và root trong department
    if (user.role === 'employee') {
        const mailToList = await User.findAll({
            where: {
                role: { [Op.in]: ['manager', 'root'] },
                departmentID: user.departmentID
            },
            attributes: { exclude: ['password'] }
        });

        if (mailToList && mailToList.length > 0) {
            let data = [];
            for (const mail of mailToList) {
                data.push({
                    "toMail": mail.email,
                    "subject": "Yêu cầu nghỉ của " + userFound.fullName + " đã được gửi tới bạn <`" + mail.email + "`>",
                    "htmlBody": html
                });
            }
            if (process.env.MODE === "dev") {
                sendEmailHTML(data, "html-dev");
            } else {
                sendEmailHTML(data, "html");
            }
        }
    } else { // Gui email cho root
        const mailTo = await User.findAll({
            where: { role: 'root' },
            attributes: { exclude: ['password'] }
        });

        if (mailTo && mailTo.length > 0) {
            let data = [];
            for (const mail of mailTo) {
                data.push({
                    "toMail": mail.email,
                    "subject": "Yêu cầu nghỉ của " + userFound.fullName + " đã được gửi tới bạn <`" + mail.email + "`>",
                    "htmlBody": html
                });
            }
            if (process.env.MODE === "dev") {
                sendEmailHTML(data, "html-dev");
            } else {
                sendEmailHTML(data, "html");
            }
        }
    }
    return newRequest;
}

const getMyRequest = async (userID, offset, limit, dateStart, dateEnd, status, isAll = false) => {
    if (!userID) {
        throw new Error("userID is required.");
    }
    if (!dateStart) {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        dateStart = lastYear;
    }

    if (!dateEnd) {
        dateEnd = new Date();
    }

    const whereClause = {
        userID,
        createdAt: {
            [Op.between]: [dateStart, dateEnd],
        },
    };

    if (status !== null && status !== undefined) {
        whereClause.status = status;
    }
    const queryOptions = {
        where: whereClause,
        order: [['createdAt', 'DESC']],
    };

    if (!isAll) {
        queryOptions.offset = offset;
        queryOptions.limit = limit;
    }

    const requests = await Request.findAll(queryOptions);

    return requests;
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

    const count = await Request.count({
        where: { createdAt: { [Op.between]: [dateStart, dateEnd] } }
    });

    if (!status || status === null) {
        const requests = await Request.findAll({
            where: { createdAt: { [Op.between]: [dateStart, dateEnd] } },
            include: [{
                model: User,
                as: 'creator',
                attributes: ['userID', 'fullName', 'email']
            }, {
                model: User,
                as: 'checkedByUser',
                attributes: ['userID', 'fullName', 'email']
            }],
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']]
        });
        return { requests, count };
    } else {
        const requests = await Request.findAll({
            where: { createdAt: { [Op.between]: [dateStart, dateEnd] }, status: status },
            include: [{
                model: User,
                as: 'creator',
                attributes: ['userID', 'fullName', 'email']
            }, {
                model: User,
                as: 'checkedByUser',
                attributes: ['userID', 'fullName', 'email']
            }],
            offset: offset,
            limit: limit,
            order: [['createdAt', 'DESC']]
        });
        return { requests, count };
    }
}

const getTotalRequestByRoot = async () => {
    const totalPending = await Request.count({ where: { status: 'pending' } });
    const totalApproved = await Request.count({ where: { status: 'approved' } });
    const totalRejected = await Request.count({ where: { status: 'rejected' } });
    const total = totalPending + totalApproved + totalRejected;
    return { totalPending, totalApproved, totalRejected, total };
}

const getAllRequestByManager = async (managerID, offset, limit, dateStart, dateEnd, status) => {
    if (!dateStart) {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        dateStart = lastYear;
    }
    if (!dateEnd) dateEnd = new Date();
    if (!offset) offset = 0;
    if (!limit) limit = 10;

    const manager = await User.findOne({ where: { userID: managerID } });
    if (!manager) {
        throw new ResponseError(404, "Manager not found");
    }

    const departmentID = manager.departmentID;

    const requests = await Request.findAll({
        where: {
            createdAt: { [Op.between]: [dateStart, dateEnd] },
            ...(status ? { status } : {})
        },
        include: [
            {
                model: User,
                as: 'creator',
                where: {
                    role: 'employee',
                    departmentID
                },
                attributes: ['userID', 'fullName', 'email']
            },
            {
                model: User,
                as: 'checkedByUser',
                attributes: ['userID', 'fullName', 'email']
            }
        ],
        offset,
        limit,
        order: [['createdAt', 'DESC']]
    });

    return requests;
};


const countRequestsByStatus = async (status, departmentID) => {
    return await Request.count({
        where: { status },
        include: [{
            model: User,
            as: 'creator',
            where: {
                role: 'employee',
                departmentID
            },
        }]
    });
};

const getTotalRequestByManager = async (managerID) => {
    const manager = await User.findOne({ where: { userID: managerID } });
    if (!manager) {
        throw new ResponseError(404, "Manager not found");
    }

    const departmentID = manager.departmentID;

    const [totalPending, totalApproved, totalRejected] = await Promise.all([
        countRequestsByStatus('pending', departmentID),
        countRequestsByStatus('approved', departmentID),
        countRequestsByStatus('rejected', departmentID),
    ]);

    const total = totalPending + totalApproved + totalRejected;

    return { totalPending, totalApproved, totalRejected, total };
};



const editStatusRequestByRoot = async (requestID, user, status, reasonReject = null) => {
    // Kiểm tra request
    const request = await Request.findOne({ where: { id: requestID } });
    if (!request) {
        throw new ResponseError(404, "Request not found");
    }
    if (request.status !== 'pending') {
        throw new ResponseError(400, "Request is not pending");
    }
    if (status === 'rejected') {
        if (!reasonReject) {
            throw new ResponseError(400, "Reason is required");
        }
    }
    if (status === 'approved') {
        if (reasonReject) {
            reasonReject = null;
        }
    }

    request.status = status;
    request.checkedAt = new Date();
    request.checkedBy = user.id;
    request.reasonReject = reasonReject || request.reasonReject;

    // Gui email
    const me = await User.findOne({ where: { userID: user.id }, attributes: ['fullName', 'email'] });

    const userFound = await User.findOne({ where: { userID: request.userID }, attributes: ['fullName', 'email'] });

    const formData = {
        fullName: userFound.fullName,
        email: userFound.email,
        id: request.id,
        type: request.type === "sick" ? "Nghỉ ốm" : request.type === "personal" ? "Nghỉ phép" : "Khác",
        fromDate: request.fromDate,
        toDate: request.toDate,
        checkedByName: me.fullName,
        checkedByEmail: me.email,
        reasonReject: reasonReject,
    }
    if (status === 'rejected') {
        const html = genRequestHTMLRequestRejected(formData);
        const data = [{
            "toMail": userFound.email,
            "subject": "[Hiesu Co.] Yêu cầu " + request.id + " của bạn đã bị từ chối",
            "htmlBody": html
        }];

        if (process.env.MODE === "dev") {
            sendEmailHTML(data, "html-dev");
        } else {
            sendEmailHTML(data, "html");
        }

    } else if (status === 'approved') {
        const html = genRequestHTMLRequestApproved(formData);
        const data = [{
            "toMail": userFound.email,
            "subject": "[Hiesu Co.] Yêu cầu " + request.id + " của bạn đã được phê duyệt",
            "htmlBody": html
        }];

        if (process.env.MODE === "dev") {
            sendEmailHTML(data, "html-dev");
        } else {
            sendEmailHTML(data, "html");
        }
    }
    await request.save();
}

const editStatusRequestByManager = async (requestID, manager, status, reasonReject = null) => {
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
    request.reasonReject = reasonReject || request.reasonReject;

    const me = await User.findOne({ where: { userID: manager.id }, attributes: ['fullName', 'email'] });
    const userFound = await User.findOne({ where: { userID: request.userID }, attributes: ['fullName', 'email'] });

    // Gui email

    const formData = {
        fullName: userFound.fullName,
        email: userFound.email,
        id: request.id,
        type: request.type === "sick" ? "Nghỉ ốm" : request.type === "personal" ? "Nghỉ phép" : "Khác",
        fromDate: request.fromDate,
        toDate: request.toDate,
        checkedByName: me.fullName,
        checkedByEmail: me.email,
        reasonReject: reasonReject,
    }
    if (status === 'rejected') {
        const html = genRequestHTMLRequestRejected(formData);
        const data = [{
            "toMail": userFound.email,
            "subject": "[Hiesu Co.] Yêu cầu " + request.id + " của bạn đã bị từ chối",
            "htmlBody": html
        }];

        if (process.env.MODE === "dev") {
            sendEmailHTML(data, "html-dev");
        } else {
            sendEmailHTML(data, "html");
        }

    } else if (status === 'approved') {
        const html = genRequestHTMLRequestApproved(formData);
        const data = [{
            "toMail": userFound.email,
            "subject": "[Hiesu Co.] Yêu cầu " + request.id + " của bạn đã được phê duyệt",
            "htmlBody": html
        }];

        if (process.env.MODE === "dev") {
            sendEmailHTML(data, "html-dev");
        } else {
            sendEmailHTML(data, "html");
        }
    }
    await request.save();
}


module.exports = {
    createRequest,
    getMyRequest,
    updateMyRequest,
    deleteMyRequest,
    getAllRequestByRoot,
    getTotalRequestByRoot,
    getAllRequestByManager,
    getTotalRequestByManager,
    editStatusRequestByRoot,
    editStatusRequestByManager
}