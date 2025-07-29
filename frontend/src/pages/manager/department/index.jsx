import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Chip,
    Box,
    TablePagination,
    CircularProgress,
    Alert,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    IconButton
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { getMyDepartment, getMyInfo, getMyDepartmentDetailEmployee } from "../../../services/managerService";
import { formatDate, formatDateTime } from "../../../utils/formatDate";

function DepartmentManager() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employeeList, setEmployeeList] = useState([]);
    const [departmentInfo, setDepartmentInfo] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeDetailLoading, setEmployeeDetailLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const offset = page * rowsPerPage;

            const [departmentRes, userInfoRes] = await Promise.all([
                getMyDepartment(offset, rowsPerPage),
                getMyInfo()
            ]);

            setEmployeeList(departmentRes.data.result);
            setTotal(departmentRes.data.count);
            setDepartmentInfo(userInfoRes.data.department);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    const handleEmployeeClick = async (employee) => {
        try {
            setEmployeeDetailLoading(true);
            setDialogOpen(true);

            const response = await getMyDepartmentDetailEmployee(employee.userID);
            setSelectedEmployee(response.data);
        } finally {
            setEmployeeDetailLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedEmployee(null);
    };

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const getRoleLabel = (role) => {
        switch (role) {
            case 'employee':
                return 'Nhân viên';
            case 'manager':
                return 'Quản lý';
            case 'root':
                return 'Admin';
            default:
                return role;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'employee':
                return 'primary';
            case 'manager':
                return 'warning';
            case 'root':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Alert severity="error">
                    Có lỗi xảy ra: {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            {departmentInfo && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Quản lý phòng ban
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ borderLeft: 4, borderColor: 'primary.main', pl: 2 }}>
                            <Typography variant="h5" color="primary" gutterBottom>
                                {departmentInfo.departmentName}
                            </Typography>
                            {departmentInfo.description && (
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    {departmentInfo.description}
                                </Typography>
                            )}
                            <Typography variant="body2" color="text.secondary">
                                Tổng số nhân viên: <strong>{total}</strong>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Danh sách nhân viên
                    </Typography>

                    {employeeList.length === 0 && !loading ? (
                        <Box textAlign="center" py={4}>
                            <Typography variant="body1" color="text.secondary">
                                Không có nhân viên nào trong phòng ban
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ảnh đại diện</TableCell>
                                            <TableCell>Họ và tên</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Số điện thoại</TableCell>
                                            <TableCell>Phòng ban</TableCell>
                                            <TableCell>Vai trò</TableCell>
                                            <TableCell>Ngày tạo</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {employeeList.map((employee) => (
                                            <TableRow
                                                key={employee.userID}
                                                hover
                                                sx={{
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => handleEmployeeClick(employee)}
                                            >
                                                <TableCell>
                                                    <Avatar
                                                        src={employee.avatarURL}
                                                        alt={employee.fullName}
                                                        sx={{ width: 40, height: 40 }}
                                                    >
                                                        {employee.fullName?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {employee.fullName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {employee.email}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {employee.phone || "Chưa cập nhật"}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {employee.department}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={getRoleLabel(employee.role)}
                                                        color={getRoleColor(employee.role)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDate(employee.createdAt)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                component="div"
                                count={total}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                labelRowsPerPage="Số hàng mỗi trang:"
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}–${to} trong tổng số ${count !== -1 ? count : `hơn ${to}`}`
                                }
                                sx={{ borderTop: 1, borderColor: 'divider' }}
                            />
                        </>
                    )}
                </CardContent>
            </Card>

            {/*  Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            Thông tin chi tiết nhân viên
                        </Typography>
                        <IconButton onClick={handleCloseDialog} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    {employeeDetailLoading ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : selectedEmployee ? (
                        <Grid container spacing={3}>
                            {/* Avatar - Cột trái */}
                            <Grid item xs={12} md={8} sx={{ ml: 2, mt: 2, mr: 10 }}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Avatar
                                        src={selectedEmployee.avatarURL}
                                        alt={selectedEmployee.fullName}
                                        sx={{ width: 120, height: 120 }}
                                    >
                                        {selectedEmployee.fullName?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </Box>

                                <Box mb={2}>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedEmployee.fullName}
                                    </Typography>
                                    <Chip
                                        label={getRoleLabel(selectedEmployee.role)}
                                        color={getRoleColor(selectedEmployee.role)}
                                        size="small"
                                    />
                                </Box>
                            </Grid>

                            {/* Thông tin chi tiết - Cột phải */}
                            <Grid item xs={12} md={4}>
                                <Box display="flex" flexDirection="column" spacing={2}>
                                    <Box mb={2}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Mã nhân viên:
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedEmployee.userID}
                                        </Typography>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Email:
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedEmployee.email}
                                        </Typography>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Số điện thoại:
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedEmployee.phone || "Chưa cập nhật"}
                                        </Typography>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Phòng ban:
                                        </Typography>
                                        <Typography variant="body1">
                                            {selectedEmployee.department || selectedEmployee.departmentID}
                                        </Typography>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Ngày tạo:
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDateTime(selectedEmployee.createdAt)}
                                        </Typography>
                                    </Box>

                                    <Box mb={2}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Cập nhật lần cuối:
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDateTime(selectedEmployee.updatedAt)}
                                        </Typography>
                                    </Box>

                                    {selectedEmployee.mustChangePassword !== undefined && (
                                        <Box mb={2} display="flex" alignItems="center">
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>
                                                Trạng thái:
                                            </Typography>
                                            <Chip
                                                label={selectedEmployee.mustChangePassword ? "Cần đổi mật khẩu" : "Bình thường"}
                                                color={selectedEmployee.mustChangePassword ? "warning" : "success"}
                                                size="small"
                                            />
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    ) : null}
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default DepartmentManager;