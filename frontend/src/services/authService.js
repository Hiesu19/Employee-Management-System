import axios from "./axios";

export const login = async (email, password) => {
    try {
        const response = await axios.post("/auth/login", { email, password });
        if (response.data.success === "success") {
            localStorage.setItem("accessToken", response.data.data.accessToken);
            localStorage.setItem("user", JSON.stringify(response.data.data.user));
        }
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const refreshToken = async () => {
    try {
        const response = await axios.post("/auth/refresh-token", {});

        if (response.data.success === "success") {
            localStorage.setItem("accessToken", response.data.data.accessToken);
            return response.data.data.accessToken;
        }
        throw new Error("Refresh token failed");
    } catch (error) {
        clearLocalStorage();
        throw error;
    }
}

export const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await axios.post("/auth/change-password", { currentPassword, newPassword });
        if (response.data.success === "success") {
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
}

export const logout = () => {

    clearLocalStorage();
}

// 0: Chưa đăng nhập
// 1: Đã đăng nhập
// 2: Cần đổi mật khẩu
export const authenticated = () => {
    try {
        const token = localStorage.getItem("accessToken");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) return 0;

        const user = JSON.parse(userStr);

        if (typeof user !== "object" || user === null) return 0;

        if (user.mustChangePassword === true) return 2;
        return 1;
    } catch (e) {
        clearLocalStorage();
        return 0;
    }
};

export const getUser = () => {
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;

        const user = JSON.parse(userStr);
        return user;
    } catch (e) {
        clearLocalStorage();
        return null;
    }
};

export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
}

export const clearLocalStorage = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
}

