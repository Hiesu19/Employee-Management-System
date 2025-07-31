import { useState } from "react";
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
import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Lock as LockIcon,
    Security as SecurityIcon
} from '@mui/icons-material';
import { changePassword, logout } from "../../services/authService";

function ChangePassword() {
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: null, text: null });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
        } else if (passwordData.newPassword.length < 8) {
            newErrors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự";
        } else if (passwordData.newPassword === passwordData.currentPassword) {
            newErrors.newPassword = "Mật khẩu mới không được trùng với mật khẩu hiện tại";
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: null, text: null });

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await changePassword(passwordData.currentPassword, passwordData.newPassword);

            setMessage({
                type: "success",
                text: "Đổi mật khẩu thành công! Đang đăng xuất..."
            });

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setErrors({});
            logout();

        } catch (error) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu"
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
        if (message.text) {
            setMessage({ type: null, text: null });
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const clearMessage = () => {
        setMessage({ type: null, text: null });
    };

    const isFormValid = passwordData.currentPassword &&
        passwordData.newPassword &&
        passwordData.confirmPassword &&
        Object.keys(errors).length === 0;

    return (
        <Box sx={{ maxWidth: 500, mx: 'auto', p: 2 }}>
            <Card elevation={1}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                            Đổi mật khẩu
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Nhập thông tin để thay đổi mật khẩu
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {message.text && (
                        <Alert
                            severity={message.type}
                            sx={{ mb: 3 }}
                            onClose={clearMessage}
                        >
                            {message.text}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                label="Mật khẩu hiện tại"
                                name="currentPassword"
                                type={showPasswords.current ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                error={!!errors.currentPassword}
                                helperText={errors.currentPassword}
                                disabled={loading}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('current')}
                                            edge="end"
                                            disabled={loading}
                                        >
                                            {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    )
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Mật khẩu mới"
                                name="newPassword"
                                type={showPasswords.new ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword || "Tối thiểu 8 ký tự"}
                                disabled={loading}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('new')}
                                            edge="end"
                                            disabled={loading}
                                        >
                                            {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    )
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Xác nhận mật khẩu mới"
                                name="confirmPassword"
                                type={showPasswords.confirm ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                disabled={loading}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            edge="end"
                                            disabled={loading}
                                        >
                                            {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    )
                                }}
                            />
                        </Stack>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                            disabled={loading || !isFormValid}
                            startIcon={loading ? <CircularProgress size={20} /> : <LockIcon />}
                            sx={{
                                mt: 4,
                                py: 1.5,
                                fontWeight: 600
                            }}
                        >
                            {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    Sau khi đổi mật khẩu, bạn sẽ được đăng xuất và cần đăng nhập lại
                </Typography>
            </Box>
        </Box>
    );
}

export default ChangePassword;