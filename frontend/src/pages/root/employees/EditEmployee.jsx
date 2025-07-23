import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    PhotoCamera as PhotoCameraIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import {
    getEmployeeById,
    updateEmployee,
    updateEmployeeAvatar,
    changeDepartment,
    kickEmployee,
    changeRole
} from '../../../services/employeeService';
import { getAllDepartments } from '../../../services/departmentService';
import { validateFullName, validatePhone } from '../../../utils/validation';

export default function EditEmployee() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);
    const [message, setMessage] = useState({
        type: '',
        message: ''
    });

    const { employeeID } = useParams();
    const [employee, setEmployee] = useState(null);
    const [departments, setDepartments] = useState([]);

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        departmentID: ''
    });

    const [roleForm, setRoleForm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setMessage({
                    type: '',
                    message: ''
                });

                const [employee, departments] = await Promise.all([
                    getEmployeeById(employeeID),
                    getAllDepartments()
                ]);

                if (employee.success === 'success') {
                    setEmployee(employee.data);
                    setAvatarPreview(employee.data.avatarURL);
                    setFormData({
                        fullName: employee.data.fullName,
                        phone: employee.data.phone,
                        departmentID: employee.data.departmentID || ''
                    });
                    setRoleForm(employee.data.role);
                }
                if (departments.success === 'success') {
                    setDepartments(departments.data || []);
                }
            } catch (error) {
                setMessage({
                    type: 'error',
                    message: 'Không thể tải dữ liệu'
                });
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [employeeID]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }


    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                setMessage({
                    type: 'error',
                    message: 'Kích thước ảnh không được lớn hơn 3MB'
                });
                return;
            }

            if (!file.type.startsWith('image/')) {
                setMessage({
                    type: 'error',
                    message: 'Định dạng ảnh không hợp lệ'
                });
                return;
            }

            setAvatarFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            }
            reader.readAsDataURL(file);
            setMessage({
                type: '',
                message: ''
            });
        }
    }

    const validateForm = () => {
        const errors = {};

        const fullNameError = validateFullName(formData.fullName);
        if (fullNameError) {
            errors.fullName = fullNameError;
        }

        const phoneError = validatePhone(formData.phone);
        if (phoneError) {
            errors.phone = phoneError;
        }

        setMessage({
            type: Object.keys(errors).length > 0 ? 'error' : '',
            message: Object.values(errors).join('\n')
        });

        return Object.keys(errors).length === 0;
    }

    const handleSubmitInfo = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setSaving('info');
            setMessage({
                type: '',
                message: ''
            });

            if (formData.fullName !== employee.fullName || formData.phone !== employee.phone) {
                const response = await updateEmployee(employeeID, formData);
                if (response.success === 'success') {
                    setMessage({
                        type: 'success',
                        message: 'Cập nhật thông tin thành công'
                    });
                }
            }

            if (formData.departmentID !== employee.departmentID) {
                if (formData.departmentID === '?kick') {
                    const response = await kickEmployee(employeeID);
                    if (response.success === 'success') {
                        setMessage({
                            type: 'success',
                            message: 'Đánh dấu nhân viên đã bị đuổi khỏi phòng ban'
                        });
                    }
                } else {
                    const response = await changeDepartment(employeeID, formData.departmentID);
                    if (response.success === 'success') {
                        setMessage({
                            type: 'success',
                            message: 'Cập nhật phòng ban thành công'
                        });
                    }
                }
            }

            if (roleForm !== employee.role) {
                const response = await changeRole(employeeID, roleForm);
                if (response.success === 'success') {
                    setMessage({
                        type: 'success',
                        message: 'Cập nhật vai trò thành công'
                    });
                }
            }

        } catch (error) {
            setMessage({
                type: 'error',
                message: 'Cập nhật thông tin thất bại'
            });
        } finally {
            setSaving(false);
        }
    }

    const handleSubmitAvatar = async (e) => {
        e.preventDefault();

        try {
            setSaving('avatar');
            setMessage({
                type: '',
                message: ''
            });

            if (avatarFile) {
                const response = await updateEmployeeAvatar(employeeID, avatarFile);
                if (response.success === 'success') {
                    setMessage({
                        type: 'success',
                        message: 'Cập nhật ảnh đại diện thành công'
                    });
                }
            }
        } catch (error) {
            setMessage({
                type: 'error',
                message: 'Cập nhật ảnh đại diện thất bại'
            });
        } finally {
            setSaving(null);
        }
    }

    if (loading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Đang tải thông tin nhân viên...
                </Typography>
            </Box>
        );
    }

    if (!employee) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Alert severity="error">
                    Không tìm thấy thông tin nhân viên
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate('/root/employees')}
                    sx={{ mt: 2 }}
                >
                    Quay lại danh sách
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <IconButton onClick={() => navigate('/root/employees')} color="primary">
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" fontWeight={600}>
                    Chỉnh sửa nhân viên
                </Typography>
            </Stack>

            {message.message && (
                <Alert severity={message.type} sx={{ mb: 3 }}>
                    {message.message}
                </Alert>
            )}

            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Grid container spacing={5} alignItems="flex-start" justifyContent="space-between">

                    <Grid item xs={12} md={8} >
                        <form onSubmit={handleSubmitInfo}>
                            <Stack spacing={3}>
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        Thông tin nhân viên
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                </Box>

                                <TextField
                                    required
                                    fullWidth
                                    name="fullName"
                                    label="Họ và tên"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                />

                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={employee.email}
                                    disabled
                                    helperText="Email không thể thay đổi"
                                />

                                <TextField
                                    required
                                    fullWidth
                                    name="phone"
                                    label="Số điện thoại"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />

                                <FormControl fullWidth>
                                    <InputLabel>Phòng ban</InputLabel>
                                    <Select
                                        name="departmentID"
                                        value={formData.departmentID || ''}
                                        label="Phòng ban"
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="">
                                            <em>Chưa phân phòng ban</em>
                                        </MenuItem>
                                        {departments.map((dept) => (
                                            <MenuItem key={dept.departmentID} value={dept.departmentID}>
                                                {dept.departmentName}

                                            </MenuItem>
                                        ))}
                                        <MenuItem value="?kick">
                                            <em>Để trống</em>
                                        </MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Vai trò</InputLabel>
                                    <Select
                                        name="role"
                                        value={roleForm || ''}
                                        label="Vai trò"
                                        onChange={(e) => setRoleForm(e.target.value)}
                                    >
                                        <MenuItem
                                            value="manager"
                                            disabled={employee.role === 'manager'}

                                        >
                                            Quản lý phòng ban
                                        </MenuItem>
                                        <MenuItem
                                            value="employee"
                                            disabled={employee.role === 'employee'}

                                        >
                                            Nhân viên
                                        </MenuItem>
                                    </Select>
                                </FormControl>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={saving === 'info'}
                                        startIcon={saving === 'info' ? <CircularProgress size={20} /> : <SaveIcon />}
                                    >
                                        {saving === 'info' ? 'Đang lưu...' : 'Lưu thông tin'}
                                    </Button>
                                </Box>
                            </Stack>
                        </form>
                    </Grid>


                    <Grid item xs={12} md={4} >
                        <Card
                            elevation={1}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                borderRadius: 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start'
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 3 }}>
                                Ảnh đại diện
                            </Typography>

                            <Avatar
                                src={avatarPreview}
                                sx={{
                                    width: 150,
                                    height: 150,
                                    mx: 'auto',
                                    mb: 3,
                                    fontSize: 60,
                                    border: '4px solid #f0f0f0'
                                }}
                            >
                                {employee.fullName?.charAt(0)}
                            </Avatar>

                            <form onSubmit={handleSubmitAvatar}>
                                <Stack spacing={2}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="avatar-upload"
                                        type="file"
                                        onChange={handleAvatarChange}
                                    />
                                    <label htmlFor="avatar-upload">
                                        <Button
                                            variant="outlined"
                                            component="span"
                                            startIcon={<PhotoCameraIcon />}
                                            fullWidth
                                        >
                                            Chọn ảnh
                                        </Button>
                                    </label>

                                    {avatarFile && (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="success"
                                            disabled={saving === 'avatar'}
                                            startIcon={saving === 'avatar' ? <CircularProgress size={20} /> : <SaveIcon />}
                                            fullWidth
                                        >
                                            {saving === 'avatar' ? 'Đang lưu...' : 'Lưu ảnh'}
                                        </Button>
                                    )}
                                </Stack>
                            </form>

                            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                                Định dạng: JPG, PNG<br />
                                Kích thước tối đa: 3MB
                                {avatarFile && (
                                    <>
                                        <br />
                                        <strong>Đã chọn:</strong> {avatarFile.name}
                                    </>
                                )}
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 3 }}>
                    <Alert severity="info">
                        <Typography variant="body2">
                            <strong>Lưu ý:</strong>
                            <br />
                            • Phòng ban có thể để trống
                            <br />
                            • Vai trò có thể đổi sau khi tạo
                            <br />
                            • Khi chuyển phòng ban mới, tự động sẽ về vai trò nhân viên

                        </Typography>
                    </Alert>
                </Grid>
            </Paper>
        </Box>
    );

}
