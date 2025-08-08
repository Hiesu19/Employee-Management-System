const EmployeeController = require('../../../src/api/v1/controller/EmployeeController.controller');
const employeeService = require('../../../src/api/v1/services/employee.service');
const { ResponseError } = require('../../../src/api/v1/error/ResponseError.error');

const { successResponse, errorResponse } = require('../../../src/api/v1/utils/response.utils');

jest.mock('../../../src/api/v1/services/employee.service');
jest.mock('../../../src/api/v1/utils/response.utils', () => ({
    successResponse: jest.fn().mockImplementation((res, data, message) => {
        res.status(200).json({
            success: "success",
            message,
            data,
        });
    }),
    errorResponse: jest.fn().mockImplementation((res, error, statusCode) => {
        res.status(statusCode).json({
            status: "error",
            message: error.message || error,
        });
    }),
}));

describe('EmployeeController - Check Out', () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            user: {
                id: "1",
                role: "employee"
            }
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Check out thành công', async () => {
        employeeService.checkOut.mockResolvedValue({
            userID: "1",
            checkInTime: "08:00:00",
            checkOutTime: "12:00:00"
        });

        await EmployeeController.checkOut(req, res, next);

        expect(employeeService.checkOut).toHaveBeenCalledWith(req.user);

        expect(successResponse).toHaveBeenCalledWith(res,
            expect.objectContaining({
                userID: expect.any(String),
                checkInTime: expect.any(String),
                checkOutTime: expect.any(String)
            }),
            "Check out successfully"
        );

        expect(next).not.toHaveBeenCalled();
    })

    it('Check out thất bại', async () => {
        employeeService.checkOut.mockRejectedValue(new ResponseError(400, "You have already checked out today"));

        await EmployeeController.checkOut(req, res, next);

        expect(next).toHaveBeenCalledWith(new ResponseError(400, "You have already checked out today"));
    })
})
