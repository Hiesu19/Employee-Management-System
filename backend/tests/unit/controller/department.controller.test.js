const DepartmentController = require('../../../src/api/v1/controller/DepartmentController.controller');
const departmentService = require('../../../src/api/v1/services/department.service');
const { ResponseError } = require('../../../src/api/v1/error/ResponseError.error');

const { successResponse, errorResponse } = require('../../../src/api/v1/utils/response.utils');

jest.mock('../../../src/api/v1/services/department.service');
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

describe('DepartmentController - Get All Departments', () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            query: {
                page: 1,
                limit: 10,
                all: "false"
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

    it('Lấy danh sách phòng ban thành công', async () => {
        departmentService.getDepartments.mockResolvedValue([
            {
                departmentID: "1",
                departmentName: "Phòng 1",
                description: "Phòng 1",
                createdAt: new Date(),
                updatedAt: new Date(),
                userCount: 2
            },
            {
                departmentID: "2",
                departmentName: "Phòng 2",
                description: "Phòng 2",
                createdAt: new Date(),
                updatedAt: new Date(),
                userCount: 2
            }
        ]);


        await DepartmentController.getDepartments(req, res, next);

        expect(departmentService.getDepartments).toHaveBeenCalledWith(1, 10, "false");

        expect(successResponse).toHaveBeenCalledWith(
            res,
            expect.arrayContaining([
                expect.objectContaining({
                    departmentID: expect.any(String),
                    departmentName: expect.any(String),
                    description: expect.any(String),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                    userCount: expect.any(Number)
                }),
                expect.objectContaining({
                    departmentID: expect.any(String),
                    departmentName: expect.any(String),
                    description: expect.any(String),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                    userCount: expect.any(Number)
                })
            ]),
            "Get departments successfully"
        );

    })
})

describe('DepartmentController - Delete Department', () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            params: {
                departmentID: "1"
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

    it('Xóa phòng ban thành công', async () => {
        departmentService.deleteDepartment.mockResolvedValue({
            departmentID: "1",
            departmentName: "Phòng 1",
            description: "Phòng 1",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await DepartmentController.deleteDepartment(req, res, next);

        expect(departmentService.deleteDepartment).toHaveBeenCalledWith("1");

        expect(successResponse).toHaveBeenCalledWith(
            res,
            expect.objectContaining({
                departmentID: "1",
                departmentName: "Phòng 1",
                description: "Phòng 1",
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            }),
            "Delete department successfully"
        );
    })

    it('Xóa phòng ban', async () => {
        departmentService.deleteDepartment.mockRejectedValue(new ResponseError(404, "Phòng ban không tồn tại"));

        await DepartmentController.deleteDepartment(req, res, next);

        expect(next).toHaveBeenCalledWith(new ResponseError(404, "Phòng ban không tồn tại"));
    })
})