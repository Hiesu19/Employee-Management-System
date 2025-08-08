const RequestController = require('../../../src/api/v1/controller/RequestController.controller');
const requestService = require('../../../src/api/v1/services/request.service');

const { successResponse, errorResponse } = require('../../../src/api/v1/utils/response.utils');

jest.mock('../../../src/api/v1/services/request.service');
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

describe('RequestController - Create Request', () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            body: {
                requestType: "leave",
                requestDate: "2021-01-01",
                requestTime: "08:00:00",
                requestDescription: "I need to go find my love"
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

    it('Tạo yêu cầu thành công', async () => {
        requestService.createRequest.mockResolvedValue({
            requestID: "1",
            requestType: "leave",
            requestDate: "2021-01-01",
            requestTime: "08:00:00",
            requestDescription: "I need to go find my love",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await RequestController.createRequest(req, res, next);

        expect(requestService.createRequest).toHaveBeenCalledWith(req.user, req.body);

        expect(successResponse).toHaveBeenCalledWith(res, {
            requestID: "1",
            requestType: "leave",
            requestDate: "2021-01-01",
            requestTime: "08:00:00",
            requestDescription: "I need to go find my love",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        }, "Create request successfully");

        expect(next).not.toHaveBeenCalled();
    })
})

describe('RequestController - Get All Request By Root', () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            query: {
                offset: 0,
                limit: 10,
                dateStart: "2021-01-01",
                dateEnd: "2021-01-01",
                status: "pending"
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

    it('Lấy danh sách yêu cầu thành công', async () => {
        requestService.getAllRequestByRoot.mockResolvedValue({
            requests: [
                {
                    "id": "request001",
                    "userID": "user100",
                    "userEmail": "hieu1@example.com",
                    "type": "sick",
                    "status": "pending",
                    "fromDate": "2025-07-14T00:00:00.000Z",
                    "toDate": "2025-07-15T00:00:00.000Z",
                    "reason": "I have a personal matter to attend to",
                    "reasonReject": null,
                    "checkedAt": null,
                    "checkedBy": null,
                    "createdAt": "2025-08-07T10:00:20.640Z",
                    "updatedAt": "2025-08-07T10:00:20.640Z",
                    "creator": {
                        "userID": "user100",
                        "fullName": "Nguyễn Thái Hiếu",
                        "email": "hieu1@example.com"
                    },
                    "checkedByUser": null
                },
            ],
            count: 2
        });

        await RequestController.getAllRequestByRoot(req, res, next);

        expect(requestService.getAllRequestByRoot)
            .toHaveBeenCalledWith(
                req.query.offset,
                req.query.limit,
                req.query.dateStart,
                req.query.dateEnd,
                req.query.status
            );

        expect(successResponse).toHaveBeenCalledWith(
            res,
            expect.objectContaining({
                requests: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        userID: expect.any(String),
                        userEmail: expect.any(String),
                        type: expect.any(String),
                        status: expect.any(String),
                        fromDate: expect.any(String),
                        toDate: expect.any(String),
                        reason: expect.any(String),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        creator: expect.objectContaining({
                            userID: expect.any(String),
                            fullName: expect.any(String),
                            email: expect.any(String),
                        }),
                    })
                ])
            }),
            "Get all request by root successfully"
        );

        expect(next).not.toHaveBeenCalled();
    })
})
