const departmentService = require('../services/department.service');

const { successResponse, errorResponse } = require('../utils/response.utils');
const { ResponseError } = require('../error/ResponseError.error');

class DepartmentController {
    // Tạo phòng ban
    async createDepartment(req, res, next) {
        try {
            const { departmentName } = req.body;
            const department = await departmentService.createDepartment(departmentName);
            successResponse(res, department, "Create department successfully");
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DepartmentController();