import axios from "./axios";

export const getAllEmployees = async (page = 1, limit = 10) => {
    try {
        const response = await axios.get("/root/employee", {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (listUserID) => {
    try {
        const response = await axios.put("/root/employee/reset-password", { employeeIDArray: listUserID });
        return response.data;
    } catch (error) {
        throw error;
    }
};
