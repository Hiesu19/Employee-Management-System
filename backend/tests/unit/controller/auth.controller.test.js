const AuthController = require('../../../src/api/v1/controller/AuthController.controller');
const authService = require('../../../src/api/v1/services/auth.service');
const { ResponseError } = require('../../../src/api/v1/error/ResponseError.error');

const { successResponse, errorResponse } = require('../../../src/api/v1/utils/response.utils');

jest.mock('../../../src/api/v1/services/auth.service');
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

describe('AuthController - changePassword', () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            body: {
                currentPassword: 'oldPassword',
                newPassword: 'newPassword',
            },
            user: {
                id: 1,
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

    it('Đổi mật khẩu thành công', async () => {
        authService.changePassword.mockResolvedValue(true);

        await AuthController.changePassword(req, res, next);

        expect(authService.changePassword).toHaveBeenCalledWith(
            'oldPassword',
            'newPassword',
            1
        );

        expect(successResponse).toHaveBeenCalledWith(
            res,
            { data: 'Change password successfully' },
            'Change password successfully'
        );

        expect(next).not.toHaveBeenCalled();
    });
});

describe('AuthController - login', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'password',
            },
        };
        res = {
            cookie: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Đăng nhập thành công', async () => {
        authService.login.mockResolvedValue({
            userResponse: { id: 1, email: 'test@example.com' },
            accessToken: 'access-token-test',
            refreshToken: 'refresh-token-test',
        });

        await AuthController.login(req, res, next);

        expect(authService.login).toHaveBeenCalledWith(
            'test@example.com',
            'password'
        );

        expect(res.cookie).toHaveBeenCalledWith(
            'refreshToken',
            'refresh-token-test',
            expect.objectContaining({
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: expect.any(Number),
            })
        );

        expect(successResponse).toHaveBeenCalledWith(
            res,
            {
                user: { id: 1, email: 'test@example.com' },
                accessToken: 'access-token-test',
            },
            'Login successfully'
        );

        expect(next).not.toHaveBeenCalled();
    });
});

describe('AuthController - refreshToken', () => {
    let req, res, next;
    beforeEach(() => {
        req = {
            cookies: {
                refreshToken: 'refresh-token-test',
            },
        };
        res = {
            cookie: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Refresh token thành công', async () => {
        authService.refreshTokenHandler.mockResolvedValue('access-token-test');

        await AuthController.refreshToken(req, res, next);

        expect(authService.refreshTokenHandler).toHaveBeenCalledWith('refresh-token-test');

        expect(successResponse).toHaveBeenCalledWith(
            res,
            { accessToken: 'access-token-test' },
            'Refresh token successfully'
        );

        expect(next).not.toHaveBeenCalled();

    })

    it('Refresh token thất bại', async () => {
        authService.refreshTokenHandler.mockRejectedValue(new ResponseError(400, "Invalid refresh token"));

        await AuthController.refreshToken(req, res, next);

        expect(authService.refreshTokenHandler).toHaveBeenCalledWith('refresh-token-test');

        expect(next).toHaveBeenCalledWith(new ResponseError(400, "Invalid refresh token"));
    })
})
