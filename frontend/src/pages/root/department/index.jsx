import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getDepartments } from "../../../services/departmentService";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Stack,
    IconButton,
    TablePagination,
    CircularProgress,
    Alert,
} from "@mui/material";
import {
    Info as InfoIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";

function Department() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [totalDepartments, setTotalDepartments] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchDepartments = useCallback(async (pageNumber, limit) => {
        try {
            setLoading(true);
            setError(null);

            const response = await getDepartments(pageNumber + 1, limit, false);

            if (response.success === 'success') {
                if (response.data.departments && response.data.totalDepartments !== undefined) {
                    setDepartments(response.data.departments);
                    setTotalDepartments(response.data.totalDepartments);
                } else {
                    const allDepartmentsResponse = await getDepartments(0, 0, true);
                    setDepartments(response.data);
                    setTotalDepartments(allDepartmentsResponse.data.length);
                }
            }
        } catch (err) {
            console.error('Error fetching departments:', err);
            setError('Không thể tải danh sách phòng ban');
            setDepartments([]);
            setTotalDepartments(0);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const handleInfo = (departmentID) => {
        navigate(`/root/department/${departmentID}`);
    };

    const handleDelete = (departmentID) => {
        console.log("Delete clicked for department:", departmentID);
    };



    useEffect(() => {
        fetchDepartments(page, rowsPerPage);
    }, [page, rowsPerPage, fetchDepartments]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                Quản lý phòng ban
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
                Tổng số phòng ban: {totalDepartments}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: '70vh' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>
                                    Tên phòng ban
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>
                                    Mô tả
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>
                                    Số nhân viên
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, bgcolor: '#f8f9fa' }}>
                                    Hành động
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                        <Typography color="text.secondary">
                                            Chưa có phòng ban nào
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                departments.map((department) => (
                                    <TableRow key={department.departmentID} hover>
                                        <TableCell>{department.departmentName}</TableCell>
                                        <TableCell>{department.description || "Không có mô tả"}</TableCell>
                                        <TableCell>{department.userCount || 0}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    title="Chi tiết"
                                                    onClick={() => handleInfo(department.departmentID)}
                                                >
                                                    <InfoIcon />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    title="Xóa"
                                                    onClick={() => handleDelete(department.departmentID)}
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

                <TablePagination
                    component="div"
                    count={totalDepartments}
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
        </Box>
    );
}

export default Department;