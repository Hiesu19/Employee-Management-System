import { useState, useEffect } from "react";
import {
	TextField,
	Button,
	Box,
	Typography,
	Alert,
	Paper,
	Container,
} from "@mui/material";

import { login, authenticated } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	console.log("Account demo: root@example.com / 123456@");

	const navigate = useNavigate();

	useEffect(() => {
		const authStatus = authenticated();
		if (authStatus === 1) {
			navigate("/", { replace: true });
		} else if (authStatus === 2) {
			navigate("/must-change-password", { replace: true });
		}
	}, [navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setIsLoading(true);

		try {
			const response = await login(email, password);
			console.log(response);

			if (response.success === "success") {
				setSuccess("Đăng nhập thành công!");

				const authStatus = authenticated();
				if (authStatus === 2) {
					setTimeout(() => navigate("/must-change-password", { replace: true }), 1000);
				} else if (authStatus === 1) {
					setTimeout(() => navigate("/", { replace: true }), 1000);
				}
			} else {
				setError("Đăng nhập thất bại");
			}
		} catch (error) {
			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"Đăng nhập thất bại. Vui lòng thử lại.";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				width: "100vw",
				display: "flex",
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				overflow: "hidden",
			}}
		>
			{/* Bên trái */}
			<Box
				sx={{
					flex: 1,
					display: { xs: "none", md: "flex" },
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					padding: 4,
					color: "white",
					textAlign: "center",
				}}
			>
				<Typography
					variant="h2"
					sx={{
						fontWeight: 700,
						mb: 2,
						textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
					}}
				>
					Hiesu
				</Typography>
				<Typography
					variant="h5"
					sx={{
						mb: 4,
						opacity: 0.9,
						textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
					}}
				>
					Hệ thống quản lý nhân sự
				</Typography>
				<Box
					sx={{
						width: 100,
						height: 4,
						backgroundColor: "rgba(255,255,255,0.3)",
						borderRadius: 2,
					}}
				/>
			</Box>

			{/* Bên phải */}
			<Box
				sx={{
					flex: { xs: 1, md: 0.8 },
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: { xs: 2, md: 4 },
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
							Đăng nhập
						</Typography>

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
								label="Email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
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
								label="Mật khẩu"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
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
							<Button
								type="submit"
								fullWidth
								variant="contained"
								size="large"
								disabled={isLoading}
								sx={{
									mt: 2,
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
								{isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
							</Button>
						</Box>
					</Paper>
				</Container>
			</Box>
		</Box>
	);
}

export default Login;
