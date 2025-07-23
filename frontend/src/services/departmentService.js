import axios from "./axios";

export const getAllDepartments = async () => {
    try {
        const response = await axios.get("/departments");
        return response.data;
    } catch (error) {
        throw error;
    }
};
