import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getDepartments, createDepartment, deleteDepartment } from "../../../services/departmentService";
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import {
    Info as InfoIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Close as CloseIcon,
} from "@mui/icons-material";

function Department() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [totalDepartments, setTotalDepartments] = useState(0);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [message, setMessage] = useState({
        type: "",
        message: "",
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [departmentName, setDepartmentName] = useState("");
    const [description, setDescription] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);

    const clearMessage = () => {
        setMessage({ type: "", message: "" });
    };

    const fetchDepartments = useCallback(async (pageNumber, limit) => {
        try {
            setLoading(true);
            clearMessage();

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
            setMessage({
                type: "error",
                message: "Không thể tải danh sách phòng ban"
            });
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

    const handleDelete = async (departmentID) => {
        try {
            if (window.confirm("Bạn có chắc chắn muốn xóa phòng ban này không?")) {
                await deleteDepartment(departmentID);
                await fetchDepartments(page, rowsPerPage);
            }
            setMessage({
                type: "success",
                message: `Phòng ban đã được xóa thành công!`
            });

            setTimeout(() => {
                clearMessage();
            }, 5000);

        } catch (err) {
            console.error('Error deleting department:', err);
            setMessage({
                type: "error",
                message: err.response?.data?.message || 'Không thể xóa phòng ban'
            });
        } finally {
            
        }
    };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setDepartmentName("");
        setDescription("");
        setSubmitLoading(false);
    };

    const handleSubmit = async () => {
        if (!departmentName.trim()) {
            setMessage({
                type: "error",
                message: "Tên phòng ban không được để trống"
            });
            return;
        }

        try {
            setSubmitLoading(true);

            await createDepartment({
                departmentName: departmentName.trim(),
                description: description.trim() || null
            });

            await fetchDepartments(page, rowsPerPage);

            setMessage({
                type: "success",
                message: `Phòng ban "${departmentName.trim()}" đã được tạo thành công!`
            });

            handleCloseDialog();


            setTimeout(() => {
                clearMessage();
            }, 5000);

        } catch (err) {
            console.error('Error creating department:', err);
            setMessage({
                type: "error",
                message: err.response?.data?.message || 'Không thể tạo phòng ban'
            });
        } finally {
            setSubmitLoading(false);
        }
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Quản lý phòng ban
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                    sx={{ borderRadius: 2 }}
                >
                    Thêm phòng ban
                </Button>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>
                Tổng số phòng ban: {totalDepartments}
            </Typography>

            {message.type === "error" && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={clearMessage}
                >
                    {message.message}
                </Alert>
            )}
            {message.type === "success" && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={clearMessage}
                >
                    {message.message}
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

            {/* Dialog Tạo phòng ban */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Thêm phòng ban mới
                    </Typography>
                    <IconButton
                        onClick={handleCloseDialog}
                        sx={{ color: 'white' }}
                        size="small"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <TextField
                            label="Tên phòng ban"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            fullWidth
                            required
                            error={!departmentName.trim() && submitLoading}
                            helperText={!departmentName.trim() && submitLoading ? "Tên phòng ban không được để trống" : ""}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        />

                        <TextField
                            label="Mô tả"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Nhập mô tả cho phòng ban (tùy chọn)"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
                    <Button
                        onClick={handleCloseDialog}
                        variant="outlined"
                        disabled={submitLoading}
                        sx={{ borderRadius: 2 }}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={submitLoading || !departmentName.trim()}
                        sx={{ borderRadius: 2 }}
                    >
                        {submitLoading ? <CircularProgress size={20} /> : "Tạo phòng ban"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Department;