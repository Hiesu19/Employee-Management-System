const ReportController = require('../../../src/api/v1/controller/ReportController.controller');
const reportService = require('../../../src/api/v1/services/report.service');

jest.mock('../../../src/api/v1/services/report.service');

describe('ReportController - Get All Employee In Department', () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            user: {
                id: "1",
                role: "manager"
            }
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            setHeader: jest.fn(),
            send: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Lấy danh sách nhân viên trong phòng ban thành công', async () => {
        reportService.exportAllEmployeeInDepartment.mockResolvedValue(Buffer.from('test-excel'));

        await ReportController.getAllEmployeeInDepartment(req, res, next);

        expect(reportService.exportAllEmployeeInDepartment).toHaveBeenCalledWith(req.user);

        expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        expect(res.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=employees.xlsx');
        expect(res.send).toHaveBeenCalledWith(Buffer.from('test-excel'));

        expect(next).not.toHaveBeenCalled();
    })
})