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

export const getEmployeeById = async (employeeID) => {
    try {
        const response = await axios.get(`/root/employee/${employeeID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateEmployee = async (employeeID, employeeData) => {
    try {
        const response = await axios.put(`/root/employee/${employeeID}`, employeeData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateEmployeeAvatar = async (employeeID, file) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await axios.post(`/root/employee/${employeeID}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changeDepartment = async (employeeID, departmentID) => {
    try {
        const response = await axios.put("/root/employee/change-department", {
            employeeID,
            departmentID
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const kickEmployee = async (employeeID) => {
    try {
        const response = await axios.put("/root/employee/change-department", {
            employeeID,
            departmentID: null
        }, {
            params: { isKick: "true" }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changeRole = async (employeeID, role) => {
    try {
        const response = await axios.put("/root/employee/change-role", {
            employeeID,
            role
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteEmployee = async (employeeID) => {
    try {
        const response = await axios.delete(`/root/employee/${employeeID}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const searchEmployeeByEmailOrNameOrPhone = async (keyword) => {
    try {
        const response = await axios.get("/root/employee/search", {
            params: { keyword }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

