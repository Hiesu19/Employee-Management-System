import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearLocalStorage, authenticated } from "../../services/authService";
import {
    Box,
    Container,
    Paper,
    Typography,
    Alert,
    TextField,
    Button
} from "@mui/material";

function ChangePassword() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!currentPassword || !password || !confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }
        if (password !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
            return;
        }
        if (password.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        setIsLoading(true);
        try {
            // TODO: Gọi API đổi mật khẩu thực tế
            // const response = await changePassword(currentPassword, password, confirmPassword);

            // Mock response để test
            const response = { success: "success" };

            if (response.success === "success") {
                setSuccess("Đổi mật khẩu thành công! Đang đăng xuất...");
                clearLocalStorage();
                setTimeout(() => navigate("/login", { replace: true }), 2000);
            } else {
                setError("Đổi mật khẩu thất bại");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Đổi mật khẩu thất bại. Vui lòng thử lại.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Chỉ cho phép hủy nếu không bắt buộc đổi mật khẩu
        const authStatus = authenticated();
        if (authStatus === 1) {
            navigate("/", { replace: true });
        }
    };

    const authStatus = authenticated();
    const isMustChange = authStatus === 2;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={24}
                    sx={{
                        padding: { xs: 3, md: 5 },
                        borderRadius: 3,
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            color: "#333",
                            mb: 3,
                        }}
                    >
                        Đổi mật khẩu
                    </Typography>

                    {isMustChange && (
                        <Alert
                            severity="info"
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                            }}
                        >
                            Bạn cần đổi mật khẩu để tiếp tục sử dụng hệ thống.
                        </Alert>
                    )}

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Mật khẩu hiện tại"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            margin="normal"
                            required
                            disabled={isLoading}
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Mật khẩu mới"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            disabled={isLoading}
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                            required
                            disabled={isLoading}
                            sx={{
                                mb: 3,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                },
                            }}
                        />

                        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                            {/* Chỉ hiển thị nút Hủy nếu không bắt buộc đổi mật khẩu */}
                            {!isMustChange && (
                                <Button
                                    variant="outlined"
                                    size="large"
                                    fullWidth
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    sx={{
                                        py: 1.5,
                                        fontWeight: 600,
                                        fontSize: "1.1rem",
                                        textTransform: "none",
                                        borderRadius: 2,
                                        borderColor: "#667eea",
                                        color: "#667eea",
                                        "&:hover": {
                                            borderColor: "#5a6fd8",
                                            backgroundColor: "rgba(102, 126, 234, 0.1)",
                                        },
                                        "&:disabled": {
                                            borderColor: "rgba(102, 126, 234, 0.3)",
                                            color: "rgba(102, 126, 234, 0.3)",
                                        },
                                    }}
                                >
                                    Hủy
                                </Button>
                            )}
                            <Button
                                type="submit"
                                fullWidth={isMustChange}
                                variant="contained"
                                size="large"
                                disabled={isLoading}
                                sx={{
                                    py: 1.5,
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: "1.1rem",
                                    textTransform: "none",
                                    borderRadius: 2,
                                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                                        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                                        transform: "translateY(-2px)",
                                    },
                                    "&:disabled": {
                                        background: "rgba(102, 126, 234, 0.5)",
                                        color: "rgba(255, 255, 255, 0.7)",
                                    },
                                }}
                            >
                                {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default ChangePassword;