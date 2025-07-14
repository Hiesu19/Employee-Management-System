const { successResponse, errorResponse } = require('../utils/response.utils');
const reportService = require('../services/report.service');

class ReportController {
    async getAllEmployeeInDepartment(req, res, next) {
        try {
            const buffer = await reportService.getAllEmployeeInDepartment(req.user);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=employees.xlsx');

            res.send(buffer);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReportController();