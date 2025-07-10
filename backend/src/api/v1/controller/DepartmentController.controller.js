const departmentService = require('../services/department.service');

const { successResponse, errorResponse } = require('../utils/response.utils');
const { ResponseError } = require('../error/ResponseError.error');

class DepartmentController {
    // Tạo phòng ban
    async createDepartment(req, res, next) {
        try {
            const { departmentName, description } = req.body;
            const department = await departmentService.createDepartment(departmentName, description);
            successResponse(res, department, "Create department successfully");
        } catch (error) {
            next(error);
        }
    }

    // Lấy phòng ban
    // Có phân trang
    async getDepartments(req, res, next) {
        try {
            const { page = 0, limit = 0 } = req.query;
            const departments = await departmentService.getDepartments(page, limit);
            successResponse(res, departments, "Get departments successfully");
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DepartmentController();