import axios from "./axios";

export const getDepartments = async (page = 0, limit = 0, all = false) => {
    try {
        const response = await axios.get(`/departments?page=${page}&limit=${limit}&all=${all}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDepartmentDetails = async (departmentID, page = 1, limit = 10) => {
    try {
        const response = await axios.get(`/departments/${departmentID}?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createDepartment = async (departmentData) => {
    try {
        const response = await axios.post("/departments/add-department", departmentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteDepartment = async (departmentID) => {
    try {
        const response = await axios.delete(`/departments/${departmentID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
