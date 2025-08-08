const RootController = require('../../../src/api/v1/controller/RootController.controller');
const rootService = require('../../../src/api/v1/services/root.service');
const resetPasswordService = require('../../../src/api/v1/services/reset-password.service');
const saveImgService = require('../../../src/api/v1/services/save-img.service');
const { ResponseError } = require('../../../src/api/v1/error/ResponseError.error');

const { successResponse, errorResponse } = require('../../../src/api/v1/utils/response.utils');

jest.mock('../../../src/api/v1/services/reset-password.service');
jest.mock('../../../src/api/v1/services/root.service');
jest.mock('../../../src/api/v1/services/save-img.service');
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

describe('RootController - Get All Employee Info', () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            query: {
                page: 1,
                limit: 10,
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

    it('Lấy tất cả thông tin nhân viên thành công', async () => {
        rootService.getAllEmployeeInfo.mockResolvedValue({
            message: "Get all employee info successfully",
            data: []
        });

        await RootController.getAllEmployeeInfo(req, res, next);

        expect(rootService.getAllEmployeeInfo).toHaveBeenCalledWith(1, 10);

        expect(successResponse).toHaveBeenCalledWith(
            res,
            {
                message: "Get all employee info successfully",
                data: []
            },
            "Get all employee info successfully"
        );
    })

    it('Lấy tất cả thông tin nhân viên thất bại', async () => {
        rootService.getAllEmployeeInfo.mockRejectedValue(new ResponseError(400, "Get all employee info failed"));

        await RootController.getAllEmployeeInfo(req, res, next);

        expect(rootService.getAllEmployeeInfo).toHaveBeenCalledWith(1, 10);

        expect(next).toHaveBeenCalledWith(new ResponseError(400, "Get all employee info failed"));
    })
})

describe("RootController - Change Avatar for Employee", () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            params: {
                employeeID: "1"
            },
            file: {
                fieldname: "avatar",
                originalname: "test.jpg",
                encoding: "7bit",
                mimetype: "image/jpeg",
            }
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it('Cập nhật ảnh đại diện thành công', async () => {
        saveImgService.updateAvatarLink.mockResolvedValue({
            userID: "1",
            fullName: "John Doe",
            email: "john.doe@example.com",
            phone: "1234567890",
            role: "employee",
            mustChangePassword: false,
            avatarURL: "https://example.com/avatar.jpg",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await RootController.updateEmployeeAvatar(req, res, next);

        expect(saveImgService.updateAvatarLink).toHaveBeenCalledWith("1", req.file);

        expect(successResponse).toHaveBeenCalledWith(res,

            expect.objectContaining({
                userID: expect.any(String),
                fullName: expect.any(String),
                email: expect.any(String),
                phone: expect.any(String),
                role: expect.any(String),
                mustChangePassword: expect.any(Boolean),
                avatarURL: expect.any(String),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            }),
            "Update employee avatar successfully"
        );

        expect(next).not.toHaveBeenCalled();
    })
})
