import axios from "./axios";

export const getDashboardStats = async () => {
    try {
        const response = await axios.get("/root/dashboard");
        return response.data;
    } catch (error) {
        throw error;
    }
}; 