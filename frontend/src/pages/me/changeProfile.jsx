import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    Box,
    Stack,
    IconButton,
    CircularProgress,
    Divider
} from "@mui/material";
import { updateMyProfile, getMyProfile, updateMyAvatar } from "../../services/meService";
import AvatarUploader from "../../components/AvatarUploader";

function ChangeProfile() {
    const [profileData, setProfileData] = useState({
        fullName: "",
        phone: ""
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ type: null, text: null });
    const [loading, setLoading] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await getMyProfile();
            setProfileData(response.data);
            setCurrentAvatar(response.data.avatarURL);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleSaveAvatar = async (avatar) => {
        try {
            const response = await updateMyAvatar(avatar);
            if (response.success === "success") {
                setMessage({ type: "success", text: "Cập nhật ảnh đại diện thành công" });
                fetchProfile();
            } else {
                setMessage({ type: "error", text: response.message });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            const response = await updateMyProfile(profileData);
            if (response.success === "success") {
                setMessage({ type: "success", text: "Cập nhật thông tin thành công" });
                fetchProfile();
            } else {
                setMessage({ type: "error", text: response.message });
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <>
            {message.type && (
                <Alert severity={message.type} onClose={() => setMessage({ type: null, text: null })}>
                    {message.text}
                </Alert>
            )}
            <Box sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Cập nhật thông tin cá nhân
                </Typography>
                <Stack
                    direction="row"
                    spacing={4}
                    alignItems="flex-start"
                    justifyContent="center"
                >
                    <Box sx={{ xs: 12, width: "60%" }}>
                        <Typography variant="h6" gutterBottom>
                            Thông tin cá nhân
                        </Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Typography variant="body1" gutterBottom>Họ và tên</Typography>
                            <TextField
                                fullWidth
                                value={profileData.fullName}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, fullName: e.target.value })
                                }
                            />
                            <Typography variant="body1" gutterBottom>Số điện thoại</Typography>
                            <TextField
                                fullWidth
                                value={profileData.phone}
                                onChange={(e) =>
                                    setProfileData({ ...profileData, phone: e.target.value })
                                }
                            />
                        </Stack>

                        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSaveProfile}>
                            Lưu thông tin
                        </Button>
                    </Box>

                    <Box sx={{ xs: 12, width: "40%" }}>
                        <AvatarUploader
                            currentAvatar={currentAvatar}
                            onSave={handleSaveAvatar}
                            loading={loading}
                            size={150}
                            showFileInfo={true}
                        />
                    </Box>
                </Stack>
            </Box>
        </>
    );

}

export default ChangeProfile;