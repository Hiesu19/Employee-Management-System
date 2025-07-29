import axios from "./axios";

export const getMyDepartment = async (offset = 0, limit = 10) => {
    const response = await axios.get("/me/manager/my-department", {
        params: { offset, limit }
    });
    return response.data;
};

export const getMyDepartmentDetailEmployee = async (employeeID) => {
    const response = await axios.get(`/me/manager/employee/${employeeID}`);
    return response.data;
};

export const getMyInfo = async () => {
    const response = await axios.get("/me");
    return response.data;
};
