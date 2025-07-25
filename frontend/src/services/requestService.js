import axios from "./axios";

export const getAllRequestsByRoot = async (offset = 0, limit = 10, dateStart = null, dateEnd = null, status = null) => {
    try {
        const params = { offset, limit };
        if (dateStart) params.dateStart = dateStart;
        if (dateEnd) params.dateEnd = dateEnd;
        if (status) params.status = status;

        const response = await axios.get("/root/request", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateRequestStatusByRoot = async (requestID, status, rejectionReason = null) => {
    try {
        const payload = { status };

        if (status === 'rejected' && rejectionReason) {
            payload.reasonReject = rejectionReason;
        }

        const response = await axios.put(`/root/request/${requestID}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTotalRequestByRoot = async () => {
    try {
        const response = await axios.get("/root/request/total");
        return response.data;
    } catch (error) {
        throw error;
    }
};