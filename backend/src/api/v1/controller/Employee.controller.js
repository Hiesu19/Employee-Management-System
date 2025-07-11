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
}

module.exports = new EmployeeController();  