import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Grid,
    Alert,
    CircularProgress,
    IconButton,
    Stack
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { createEmployee } from '../../../services/employeeService';
import { validateEmployeeForm, isFormValid } from '../../../utils/validation';

export default function AddEmployee() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [errors, setErrors] = useState({});

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = validateEmployeeForm(formData);
        setErrors(newErrors);
        return isFormValid(newErrors);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const employeeData = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim().replace(/\s/g, '')
            };

            const response = await createEmployee(employeeData);

            if (response.success === 'success') {
                setSuccess(true);

                setTimeout(() => {
                    navigate('/root/employees');
                }, 2000);
            }
        } catch (err) {
            setError("Lỗi tạo nhân viên");
        } finally {
            setLoading(false);
        }
    };



    if (success) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Alert severity="success" sx={{ mb: 3 }}>
                    Tạo nhân viên thành công! Đang chuyển hướng...
                </Alert>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <IconButton
                    onClick={() => navigate('/root/employees')}
                    color="primary"
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Thêm nhân viên mới
                </Typography>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Họ và tên"
                                value={formData.fullName}
                                onChange={handleChange('fullName')}
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                type="email"
                                label="Email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Số điện thoại"
                                value={formData.phone}
                                onChange={handleChange('phone')}
                                error={!!errors.phone}
                                helperText={errors.phone}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading && <CircularProgress size={20} />}
                                >
                                    {loading ? 'Đang tạo...' : 'Tạo nhân viên'}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
                <Grid item xs={12} sx={{ mt: 3 }}>
                    <Alert severity="info">
                        <Typography variant="body2">
                            <strong>Lưu ý:</strong>
                            <br />
                            • Mật khẩu sẽ được tạo tự động và gửi qua email
                            <br />
                            • Nhân viên sẽ phải đổi mật khẩu khi đăng nhập lần đầu
                            <br />
                            • Vai trò mặc định là "Nhân viên"
                            <br />
                            • Có thể phân phòng ban sau khi tạo

                        </Typography>
                    </Alert>
                </Grid>
            </Paper>
        </Box>
    );
}
