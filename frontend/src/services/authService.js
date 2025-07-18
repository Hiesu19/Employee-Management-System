import axios from "./axios";

export const login = async (email, password) => {
    try {
        const response = await axios.post("/auth/login", { email, password });

        // Lưu token và user vào localStorage
        if (response.data.success === "success") {
            localStorage.setItem("accessToken", response.data.data.accessToken);
            localStorage.setItem("user", JSON.stringify(response.data.data.user));
        }

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const isAuthenticated = () => {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (token && user) {
        return true;
    }
    return false;
}
