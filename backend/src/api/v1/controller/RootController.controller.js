const rootService = require('../services/root.service');

const { successResponse, errorResponse } = require('../utils/response.utils');
const { ResponseError } = require('../error/ResponseError.error');

class RootController {
    async updateEmployeeInfo(req, res, next) {
        try {
            const { employeeID } = req.params;
            const { fullName, email, phone } = req.body;
            const employee = await rootService.updateEmployeeInfo(employeeID, fullName, email, phone);
            successResponse(res, employee, "Update employee info successfully");
        } catch (error) {
            next(error);
        }
    }

    async deleteEmployee(req, res, next) {
        try {
            const { employeeID } = req.params;
            await rootService.deleteEmployee(employeeID);
            successResponse(res, { "message": "Delete employee successfully" }, "Delete employee successfully");
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RootController();