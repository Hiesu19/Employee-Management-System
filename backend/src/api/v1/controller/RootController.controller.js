const rootService = require('../services/root.service');
const resetPasswordService = require('../services/reset-password.service');

const { successResponse, errorResponse } = require('../utils/response.utils');

class RootController {
    async getEmployeeInfo(req, res, next) {
        try {
            const { employeeID } = req.params;
            const employee = await rootService.getEmployeeInfo(employeeID);
            successResponse(res, employee, "Get employee info successfully ");
        } catch (error) {
            next(error);
        }
    }

    async getAllEmployeeInfo(req, res, next) {
        try {
            const { page = 0, limit = 0 } = req.query;
            const employees = await rootService.getAllEmployeeInfo(page, limit);
            successResponse(res, employees, "Get all employee info successfully");
        } catch (error) {
            next(error);
        }
    }

    async searchEmployeeByEmailOrName(req, res, next) {

        try {
            const { email, name } = req.query;
            const employees = await rootService.searchEmployeeByEmailOrName(email, name);
            successResponse(res, employees, "Search employee successfully");
        } catch (error) {
            next(error);
        }
    }

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

    async resetPassword(req, res, next) {
        try {
            const { employeeIDArray } = req.body;
            const result = await resetPasswordService.resetPassword(employeeIDArray);
            successResponse(res, result, "Reset password successfully");
        } catch (error) {
            next(error);
        }
    }

    async changeDepartment(req, res, next) {
        try {
            const { employeeID, departmentID } = req.body;
            const result = await rootService.changeDepartment(employeeID, departmentID);
            successResponse(res, result, "Change department successfully");
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new RootController();