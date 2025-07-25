const { successResponse, errorResponse } = require('../utils/response.utils');
const reportService = require('../services/report.service');

class ReportController {
    async getAllEmployeeInDepartment(req, res, next) {
        try {
            const buffer = await reportService.exportAllEmployeeInDepartment(req.user);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=employees.xlsx');

            res.send(buffer);
        } catch (error) {
            next(error);
        }
    }

    async getAllEmployeeInCompany(req, res, next) {
        try {
            const buffer = await reportService.exportAllEmployeeInCompany(req.user);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=employees.xlsx');

            res.send(buffer);
        } catch (error) {
            next(error);
        }
    }

    async getWorkTimeReport(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const buffer = await reportService.exportTotalTimeWorkedByMonth(req.user, startDate, endDate);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=work_time_report.xlsx');

            res.send(buffer);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReportController();