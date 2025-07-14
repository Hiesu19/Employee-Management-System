const { successResponse, errorResponse } = require('../utils/response.utils');
const employeeService = require('../services/employee.service');
const saveImgService = require('../services/save-img.service');

class EmployeeController {
    async getMyInfo(req, res, next) {
        try {
            const userID = req.user.id;
            console.log(req.user);
            console.log(userID);
            const myInfo = await employeeService.getMyInfo(userID);
            successResponse(res, myInfo, "Get my info successfully");
        } catch (error) {
            next(error);
        }
    }

    async updateMyInfo(req, res, next) {
        try {
            const userID = req.user.id;
            const { fullName, phone } = req.body;
            const myInfo = await employeeService.updateMyInfo(userID, fullName, phone);
            successResponse(res, myInfo, "Update my info successfully");
        } catch (error) {
            next(error);
        }
    }

    async updateMyAvatar(req, res, next) {
        try {
            const userID = req.user.id;
            const avatar = req.file;
            const myInfo = await saveImgService.updateAvatarLink(userID, avatar);
            successResponse(res, myInfo, "Update avatar successfully");
        } catch (error) {
            next(error);
        }
    }

    async checkIn(req, res, next) {
        try {
            const role = req.user.role;
            if (role === 'root') {
                errorResponse(res, "You are root, you can't check in", 403);
                return;
            }

            const checkIn = await employeeService.checkIn(req.user);
            successResponse(res, checkIn, "Check in successfully");
        } catch (error) {
            next(error);
        }
    }

    async checkOut(req, res, next) {
        try {
            const role = req.user.role;
            if (role === 'root') {
                errorResponse(res, "You are root, you can't check out", 403);
                return;
            }

            const checkOut = await employeeService.checkOut(req.user);
            successResponse(res, checkOut, "Check out successfully");
        } catch (error) {
            next(error);
        }
    }
    async getMyCheckInOut(req, res, next) {
        try {
            const userID = req.user.id;
            const { offset, limit, dateStart, dateEnd } = req.query;
            const checkInOut = await employeeService.getMyCheckInOut(userID, offset, limit, dateStart, dateEnd);
            successResponse(res, checkInOut, "Get my check in out successfully");
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new EmployeeController();  