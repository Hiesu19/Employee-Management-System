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

export const createEmployee = async (employeeData) => {
    try {
        const response = await axios.post("/auth/register", employeeData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (userIDs) => {
    try {
        const response = await axios.put("/root/employee/reset-password", {
            employeeIDArray: userIDs
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
