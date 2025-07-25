import { useState, useEffect } from 'react';
import { getAllRequestsByRoot, updateRequestStatusByRoot, getTotalRequestByRoot } from '../../../services/requestService';
import {
    Box,
    Typography,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Paper,
    Tabs,
    Tab,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Tooltip,
    Divider,
} from '@mui/material';

import {
    Visibility as VisibilityIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';

function Request() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState({
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        total: 0
    });
    const [message, setMessage] = useState({
        type: null,
        message: null
    });

    const [page, setPage] = useState(0);
    const [tab, setTab] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    //Dialog
    const [openDialog, setOpenDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [dialogType, setDialogType] = useState('');

    const getStatusFromTab = (tabIndex) => {
        switch (tabIndex) {
            case 1: return 'pending';
            case 2: return 'approved';
            case 3: return 'rejected';
            default: return null;
        }
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const status = getStatusFromTab(tab);
            const offset = page * rowsPerPage;

            const response = await getAllRequestsByRoot(offset, rowsPerPage, null, null, status);
            setRequests(response.data.requests || []);
            setTotalCount(response.data.count || 0);

        } catch (error) {
            setMessage({
                type: 'error',
                message: 'Có lỗi xảy ra khi tải dữ liệu'
            });
            setRequests([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchTotal = async () => {
        try {
            const response = await getTotalRequestByRoot();
            setTotal(response.data || {
                totalPending: 0,
                totalApproved: 0,
                totalRejected: 0,
                total: 0
            });
        } catch (error) {
            console.error('Error fetching total:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [page, tab, rowsPerPage]);

    useEffect(() => {
        fetchTotal();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusUpdate = (request) => {
        setSelectedRequest(request);
        setNewStatus('');
        setRejectionReason('');
        setOpenDialog(true);
    };

    const handleViewRequest = (request) => {
        setSelectedRequest(request);
        setOpenViewDialog(true);
    };

    const handleApproveRequest = async (request) => {
        try {
            await updateRequestStatusByRoot(request.id, 'approved');
            setMessage({
                type: 'success',
                message: 'Đã phê duyệt yêu cầu thành công'
            });
            fetchRequests();
            fetchTotal();
        } catch (error) {
            setMessage({
                type: 'error',
                message: 'Có lỗi xảy ra khi phê duyệt yêu cầu'
            });
        }
    };

    const handleRejectRequest = (request) => {
        setSelectedRequest(request);
        setNewStatus('rejected');
        setRejectionReason('');
        setDialogType('reject');
        setOpenDialog(true);
    };

    const handleConfirmStatusUpdate = async () => {
        try {
            await updateRequestStatusByRoot(selectedRequest.id, newStatus, rejectionReason);
            setMessage({
                type: 'success',
                message: newStatus === 'approved' ? 'Đã phê duyệt yêu cầu thành công' : 'Đã từ chối yêu cầu thành công'
            });
            setOpenDialog(false);
            fetchRequests();
            fetchTotal();
        } catch (error) {
            setMessage({
                type: 'error',
                message: 'Có lỗi xảy ra khi cập nhật trạng thái'
            });
        }
    };

    const clearMessage = () => {
        setMessage({ type: null, message: null });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xác nhận';
            case 'approved': return 'Đã phê duyệt';
            case 'rejected': return 'Đã từ chối';
            default: return status;
        }
    };

    const getTypeText = (type) => {
        switch (type) {
            case 'sick': return 'Nghỉ ốm';
            case 'personal': return 'Nghỉ phép';
            case 'other': return 'Khác';
            default: return type;
        }
    };

    const getTabLabel = (index) => {
        switch (index) {
            case 0: return `Tất cả (${total.total})`;
            case 1: return `Chờ xác nhận (${total.totalPending})`;
            case 2: return `Đã phê duyệt (${total.totalApproved})`;
            case 3: return `Đã từ chối (${total.totalRejected})`;
            default: return '';
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                Quản lý yêu cầu
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
                {/* Tabs */}
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
                >
                    <Tab label={getTabLabel(0)} />
                    <Tab label={getTabLabel(1)} />
                    <Tab label={getTabLabel(2)} />
                    <Tab label={getTabLabel(3)} />
                </Tabs>

                {/* Table */}
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nhân viên</TableCell>
                                <TableCell>Loại yêu cầu</TableCell>
                                <TableCell>Từ ngày</TableCell>
                                <TableCell>Đến ngày</TableCell>
                                <TableCell>Lý do</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Ngày tạo</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((request) => (
                                <TableRow key={request.id} hover>
                                    <TableCell>{request.id}</TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>
                                                {request.userEmail}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{getTypeText(request.type)}</TableCell>
                                    <TableCell>{formatDate(request.fromDate)}</TableCell>
                                    <TableCell>{formatDate(request.toDate)}</TableCell>
                                    <TableCell sx={{ maxWidth: 200 }}>
                                        <Typography variant="body2" noWrap>
                                            {request.reason}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getStatusText(request.status)}
                                            color={getStatusColor(request.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            {/* View Button */}
                                            <Tooltip title="Xem chi tiết">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleViewRequest(request)}
                                                    color="primary"
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>


                                            {request.status === 'pending' && (
                                                <Tooltip title="Phê duyệt">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleApproveRequest(request)}
                                                        color="success"
                                                    >
                                                        <CheckCircleIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {request.status === 'pending' && (
                                                <Tooltip title="Từ chối">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRejectRequest(request)}
                                                        color="error"
                                                    >
                                                        <CancelIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {requests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <Typography variant="body2" color="text.secondary">
                                            Không có dữ liệu
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={totalCount}
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

            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết yêu cầu</DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Box sx={{ pt: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin yêu cầu #{selectedRequest.id}
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Nhân viên
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedRequest.userEmail}
                                    </Typography>
                                </Box>
                                
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Loại yêu cầu
                                    </Typography>
                                    <Typography variant="body1">
                                        {getTypeText(selectedRequest.type)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Trạng thái
                                    </Typography>
                                    <Chip
                                        label={getStatusText(selectedRequest.status)}
                                        color={getStatusColor(selectedRequest.status)}
                                        size="small"
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Từ ngày
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(selectedRequest.fromDate)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Đến ngày
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(selectedRequest.toDate)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Ngày tạo
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDate(selectedRequest.createdAt)}
                                    </Typography>
                                </Box>
                                {selectedRequest.checkedAt && (
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Ngày xử lý
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(selectedRequest.checkedAt)}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Lý do nghỉ
                                </Typography>
                                <Typography variant="body1">
                                    {selectedRequest.reason}
                                </Typography>
                            </Box>

                            {selectedRequest.reasonReject && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Lý do từ chối
                                    </Typography>
                                    <Typography variant="body1" color="error.main">
                                        {selectedRequest.reasonReject}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenViewDialog(false)}>Đóng</Button>
                    {selectedRequest && selectedRequest.status === 'pending' && (
                        <>
                            <Button
                                onClick={() => {
                                    setOpenViewDialog(false);
                                    handleApproveRequest(selectedRequest);
                                }}
                                variant="contained"
                                color="success"
                            >
                                Phê duyệt
                            </Button>
                            <Button
                                onClick={() => {
                                    setOpenViewDialog(false);
                                    handleRejectRequest(selectedRequest);
                                }}
                                variant="contained"
                                color="error"
                            >
                                Từ chối
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Từ chối yêu cầu</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField
                            fullWidth
                            label="Lý do từ chối *"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            multiline
                            rows={4}
                            placeholder="Vui lòng nhập lý do từ chối yêu cầu..."
                            required
                        />

                        {selectedRequest && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Thông tin yêu cầu:
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Nhân viên:</strong> {selectedRequest.userEmail}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Loại:</strong> {getTypeText(selectedRequest.type)}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Thời gian:</strong> {formatDate(selectedRequest.fromDate)} - {formatDate(selectedRequest.toDate)}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Lý do:</strong> {selectedRequest.reason}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button
                        onClick={handleConfirmStatusUpdate}
                        variant="contained"
                        color="error"
                        disabled={!rejectionReason.trim()}
                    >
                        Xác nhận từ chối
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Request;