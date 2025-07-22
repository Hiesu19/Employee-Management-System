import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    Chip,
    Avatar,
    IconButton,
    Alert,
    CircularProgress,
    Stack
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { getAllEmployees } from '../../../services/employeeService';

const getRoleColor = (role) => {
    switch (role) {
        case 'root': return 'error';
        case 'manager': return 'warning';
        case 'employee': return 'primary';
        default: return 'default';
    }
};

const getRoleLabel = (role) => {
    switch (role) {
        case 'root': return 'Quản trị viên';
        case 'manager': return 'Quản lý';
        case 'employee': return 'Nhân viên';
        default: return role;
    }
};

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalEmployees, setTotalEmployees] = useState(0);

    const fetchEmployees = async (pageNumber = 1, limit = 10) => {
        try {
            setLoading(true);
            setError(null);

            const response = await getAllEmployees(pageNumber, limit);

            if (response.success === 'success') {
                setEmployees(response.data.employees || []);
                setTotalEmployees(response.data.totalEmployees || 0);
            }
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError('Không thể tải danh sách nhân viên');
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        fetchEmployees(newPage + 1, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        fetchEmployees(1, newRowsPerPage);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    useEffect(() => {
        fetchEmployees(1, rowsPerPage);
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                Quản lý nhân viên
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Loading */}
            {loading && (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            )}

            {/*Table */}
            {!loading && (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: '70vh' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>
                                        Nhân viên
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>
                                        Email
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>
                                        Điện thoại
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>
                                        Vai trò
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>
                                        Ngày tạo
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>
                                        Thao tác
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">
                                                Chưa có nhân viên nào
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employees.map((employee) => (
                                        <TableRow key={employee.userID} hover>
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Avatar
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            bgcolor: '#667eea'
                                                        }}
                                                    >
                                                        {employee.fullName?.charAt(0)?.toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {employee.fullName}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell>{employee.email}</TableCell>
                                            <TableCell>{employee.phone}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getRoleLabel(employee.role)}
                                                    color={getRoleColor(employee.role)}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(employee.createdAt)}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        title="Xóa"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <TablePagination
                        component="div"
                        count={totalEmployees}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        labelRowsPerPage="Số dòng mỗi trang:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}-${to} trong ${count !== -1 ? count : `hơn ${to}`}`
                        }
                        sx={{
                            borderTop: '1px solid rgba(224, 224, 224, 1)',
                            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                mb: 0,
                            },
                        }}
                    />
                </Paper>
            )}
        </Box>
    );
}