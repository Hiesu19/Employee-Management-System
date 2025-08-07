const RootController = require('../../src/api/v1/controller/RootController.controller');
const rootService = require('../../src/api/v1/services/root.service');
const resetPasswordService = require('../../src/api/v1/services/reset-password.service');

const { successResponse, errorResponse } = require('../../src/api/v1/utils/response.utils');

jest.mock('../../src/api/v1/services/reset-password.service');
jest.mock('../../src/api/v1/utils/response.utils', () => ({
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

describe('RootController - Reset Password', () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            body: {
                employeeIDArray: ["1", "2", "3"],
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Lấy thông tin root thành công', async () => {
        resetPasswordService.resetPassword.mockResolvedValue({
            message: `Reset password successfully 3/3`,
            emailArraySuccess: ["test1@example.com", "test2@example.com", "test3@example.com"],
            idArrayFailed: []
        });

        await RootController.resetPassword(req, res, next);

        expect(resetPasswordService.resetPassword).toHaveBeenCalledWith(["1", "2", "3"]);

        expect(successResponse).toHaveBeenCalledWith(
            res,
            {
                message: "Reset password successfully 3/3",
                emailArraySuccess: ["test1@example.com", "test2@example.com", "test3@example.com"],
                idArrayFailed: []
            },
            "Reset password successfully");

        expect(next).not.toHaveBeenCalled();
    })
})