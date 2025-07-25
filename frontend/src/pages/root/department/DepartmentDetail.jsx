import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDepartmentDetails } from "../../../services/departmentService";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Button,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider,
    Grid,
    Avatar,
    TablePagination,
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    Email as EmailIcon,
    Person as PersonIcon,
    Group as GroupIcon,
    CalendarToday as CalendarIcon,
} from "@mui/icons-material";

function DepartmentDetail() {
    const { departmentID } = useParams();
    const navigate = useNavigate();

    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employeePage, setEmployeePage] = useState(1);
    const [employeeRowsPerPage, setEmployeeRowsPerPage] = useState(10);

    const fetchDepartmentDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getDepartmentDetails(departmentID, employeePage, employeeRowsPerPage);
            setDepartment(response.data);
        } catch (err) {
            console.error('Error fetching department details:', err);
            setError('Không thể tải thông tin chi tiết phòng ban');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleEmployeePageChange = (event, newPage) => {
        setEmployeePage(newPage + 1);
    };

    const handleEmployeeRowsPerPageChange = (event) => {
        setEmployeeRowsPerPage(parseInt(event.target.value, 10));
        setEmployeePage(1);
    };

    const handleEmployeeClick = (userID) => {
        navigate(`/root/employees/edit/${userID}`);
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'root':
                return 'error';
            case 'manager':
                return 'warning';
            case 'employee':
                return 'success';
            default:
                return 'default';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'root':
                return 'Root';
            case 'manager':
                return 'Quản lý';
            case 'employee':
                return 'Nhân viên';
            default:
                return role;
        }
    };

    useEffect(() => {
        if (departmentID) {
            fetchDepartmentDetails();
        }
    }, [departmentID, employeePage, employeeRowsPerPage]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/root/department')}
                >
                    Quay lại danh sách phòng ban
                </Button>
            </Box>
        );
    }

    if (!department) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Không tìm thấy thông tin phòng ban
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/root/department')}
                >
                    Quay lại danh sách phòng ban
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/root/department')}
                >
                    Quay lại
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Chi tiết phòng ban: {department.departmentName}
                </Typography>
            </Box>

            <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Thông tin cơ bản */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Thông tin cơ bản
                        </Typography>

                        <Paper elevation={2} sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2, mb: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Tên phòng ban
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {department.departmentName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Mô tả
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {department.description || 'Không có mô tả'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Tổng số nhân viên
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {department.countEmployees || 0}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Số lượng quản lý
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {department.managers.length || 0}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                        Ngày tạo
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {formatDate(department.createdAt)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Danh sách nhân viên */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                            <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Danh sách nhân viên ({department.countEmployees || 0})
                        </Typography>

                        <List sx={{ bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
                            {(department.employees || []).map((employee, index) => (
                                <div key={employee.userID}>
                                    <ListItem
                                        button
                                        onClick={() => handleEmployeeClick(employee.userID)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <Avatar
                                                src={employee.avatarURL}
                                                alt={employee.fullName}
                                                sx={{ width: 40, height: 40, mr: 2 }}
                                            />
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            {employee.fullName}
                                                        </Typography>
                                                        <Chip
                                                            label={getRoleLabel(employee.role)}
                                                            color={getRoleColor(employee.role)}
                                                            size="small"
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                        <EmailIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {employee.email}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </Box>
                                    </ListItem>
                                    {index < (department.employees.length - 1) && <Divider />}
                                </div>
                            ))}
                        </List>

                        {/* Phân trang nhân viên */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <TablePagination
                                component="div"
                                count={department.countEmployees || 0}
                                page={employeePage - 1}
                                onPageChange={handleEmployeePageChange}
                                rowsPerPage={employeeRowsPerPage}
                                onRowsPerPageChange={handleEmployeeRowsPerPageChange}
                                rowsPerPageOptions={[5, 10, 25]}
                                labelRowsPerPage="Số dòng mỗi trang:"
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} trong ${count !== -1 ? count : `hơn ${to}`}`
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}

export default DepartmentDetail; 