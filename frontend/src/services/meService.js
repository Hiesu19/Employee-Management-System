import axios from "./axios";
import { getUser } from "./authService";

export const getMyProfile = async () => {
    try {
        const response = await axios.get("/me");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateMyProfile = async (data) => {
    try {
        const response = await axios.put("/me", data);
        const user = getUser();
        user.fullName = response.data.data.fullName;
        user.phone = response.data.data.phone;
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await axios.post("/auth/change-password", { currentPassword, newPassword });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateMyAvatar = async (avatar) => {
    try {
        const formData = new FormData();
        formData.append('avatar', avatar);

        const response = await axios.post("/me/avatar", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const user = getUser();
        user.avatarURL = response.data.data.avatarURL;
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
    } catch (error) {
        throw error;
    }
}
