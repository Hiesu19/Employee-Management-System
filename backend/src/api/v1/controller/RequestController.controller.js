const { successResponse, errorResponse } = require('../utils/response.utils');
const requestService = require('../services/request.service');

class RequestController {
    async createRequest(req, res, next) {
        try {
            const request = await requestService.createRequest(req.user, req.body);
            successResponse(res, request, "Create request successfully");
        } catch (error) {
            next(error);
        }
    }

    async getMyRequest(req, res, next) {
        try {
            const { offset, limit, dateStart, dateEnd } = req.query;
            const userID = req.user.id;
            const request = await requestService.getMyRequest(userID, offset, limit, dateStart, dateEnd);
            successResponse(res, request, "Get my request successfully");
        } catch (error) {
            next(error);
        }
    }

    async updateMyRequest(req, res, next) {
        try {
            const { requestID } = req.params;
            const userID = req.user.id;
            const request = await requestService.updateMyRequest(requestID, userID, req.body);
            successResponse(res, request, "Update my request successfully");
        } catch (error) {
            next(error);
        }
    }

    async deleteMyRequest(req, res, next) {
        try {
            const { requestID } = req.params;
            const userID = req.user.id;
            const request = await requestService.deleteMyRequest(requestID, userID);
            successResponse(res, request, "Delete my request successfully");
        } catch (error) {
            next(error);
        }
    }

    async getAllRequestByRoot(req, res, next) {
        try {
            const { offset, limit, dateStart, dateEnd, status } = req.query;
            const requests = await requestService.getAllRequestByRoot(offset, limit, dateStart, dateEnd, status);
            successResponse(res, requests, "Get all request by root successfully");
        } catch (error) {
            next(error);
        }
    }

    async getAllRequestByManager(req, res, next) {
        try {
            const { offset, limit, dateStart, dateEnd, status } = req.query;
            const requests = await requestService.getAllRequestByManager(req.user.id, offset, limit, dateStart, dateEnd, status);
            successResponse(res, requests, "Get all request by manager successfully");
        } catch (error) {
            next(error);
        }
    }

    async editStatusRequestByRoot(req, res, next) {
        try {
            const { requestID } = req.params;
            const { status, reasonReject } = req.body;
            const request = await requestService.editStatusRequestByRoot(requestID, req.user, status, reasonReject);
            successResponse(res, request, "Edit status request successfully");
        } catch (error) {
            next(error);
        }
    }

    async editStatusRequestByManager(req, res, next) {
        try {
            const { requestID } = req.params;
            const { status } = req.body;
            const request = await requestService.editStatusRequestByManager(requestID, req.user, status);
            successResponse(res, request, "Edit status request successfully");
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new RequestController();