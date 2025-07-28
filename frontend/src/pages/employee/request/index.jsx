import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TablePagination,
    Alert,
    IconButton,
    Tooltip,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    FilterList as FilterIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { getMyRequest } from '../../../services/requestService';
import { formatDate, formatDateTime } from '../../../utils/formatDate';

const statusConfig = {
    pending: { label: 'Chờ duyệt', color: 'warning' },
    approved: { label: 'Đã duyệt', color: 'success' },
    rejected: { label: 'Từ chối', color: 'error' }
};

const typeConfig = {
    sick: 'Nghỉ ốm',
    personal: 'Nghỉ phép',
    other: 'Khác'
};

function MyRequests() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const offset = page * rowsPerPage;
            const responseAll = await getMyRequest(offset, rowsPerPage, null, null, null, true);
            const response = await getMyRequest(
                offset,
                rowsPerPage,
                null,
                null,
                statusFilter,
                true
            );

            setRequests(response.data);
            setTotalPages(Math.ceil(responseAll.data.length / rowsPerPage));

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu yêu cầu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [page, rowsPerPage, statusFilter]);

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(0);
    };

    const clearFilter = () => {
        setStatusFilter('');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4">Yêu cầu</Typography>
                    <Button variant="contained" color="success" onClick={() => navigate('/me/request/add')}>
                        Thêm yêu cầu
                    </Button>
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 3,
                    alignItems: 'center'
                }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Trạng thái"
                            onChange={handleStatusFilterChange}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="pending">Chờ duyệt</MenuItem>
                            <MenuItem value="approved">Đã duyệt</MenuItem>
                            <MenuItem value="rejected">Từ chối</MenuItem>
                        </Select>
                    </FormControl>

                    {statusFilter && (
                        <Tooltip title="Xóa bộ lọc">
                            <IconButton onClick={clearFilter} size="small">
                                <ClearIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'grey.50' }}>
                                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Loại yêu cầu</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Từ ngày</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Đến ngày</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Lý do</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Lý do từ chối</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={10} sx={{ textAlign: 'center' }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : requests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} sx={{ textAlign: 'center' }}>
                                        <Typography variant="body1">Không có dữ liệu</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                requests.map((request) => (
                                    <TableRow
                                        key={request.id}
                                        sx={{
                                            '&:hover': { backgroundColor: 'grey.50' }
                                        }}
                                    >
                                        <TableCell>{request.id}</TableCell>
                                        <TableCell>{formatDateTime(request.createdAt)}</TableCell>
                                        <TableCell>{typeConfig[request.type]}</TableCell>
                                        <TableCell>{formatDate(request.fromDate)}</TableCell>
                                        <TableCell>{formatDate(request.toDate)}</TableCell>
                                        <TableCell>{request.reason || 'Không có lý do'}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={statusConfig[request.status].label}
                                                color={statusConfig[request.status].color}
                                            />
                                        </TableCell>
                                        <TableCell>{request.reasonReject}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                    component="div"
                    count={totalPages}
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

export default MyRequests;
