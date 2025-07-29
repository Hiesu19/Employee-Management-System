import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Alert,
    CircularProgress,
    TextField,
} from '@mui/material';
import {
    Download as DownloadIcon,
} from '@mui/icons-material';
import { downloadAllEmployeesInDepartment, downloadTotalTimeWorkedByMonth } from '../../../services/reportService';

function ReportManager() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        type: null,
        text: null
    });
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const handleDownloadAllEmployeesInDepartment = async () => {
        try {
            setLoading(true);

            const result = await downloadAllEmployeesInDepartment();

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: 'Tải xuống danh sách nhân viên thành công!'
                });
            }
        } catch (error) {
            console.error('Download error:', error);
            setMessage({
                type: 'error',
                text: 'Có lỗi xảy ra khi tải xuống. Vui lòng thử lại.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTotalTimeWorkedByMonth = async (startDate, endDate) => {
        try {
            setLoading(true);
            const result = await downloadTotalTimeWorkedByMonth(startDate, endDate);

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: 'Tải xuống báo cáo thời gian làm việc thành công!'
                });
            }
        } catch (error) {
            console.error('Download error:', error);
            setMessage({
                type: 'error',
                text: 'Có lỗi xảy ra khi tải xuống. Vui lòng thử lại.'
            });
        } finally {
            setLoading(false);
        }
    }

    const clearMessage = () => {
        setMessage({ type: null, text: null });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                    Xuất báo cáo
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Tải xuống dưới dạng file Excel
                </Typography>
            </Box>

            {message.type && (
                <Alert
                    severity={message.type}
                    sx={{ mb: 3 }}
                    onClose={clearMessage}
                >
                    {message.text}
                </Alert>
            )}

            <Paper
                elevation={1}
                sx={{
                    p: 3,
                    borderRadius: 2,
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Danh sách toàn bộ nhân viên trong phòng ban
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
                        onClick={handleDownloadAllEmployeesInDepartment}
                        disabled={loading}
                        sx={{
                            backgroundColor: '#4CAF50',
                            '&:hover': {
                                backgroundColor: '#45a049',
                            },
                            px: 3,
                            py: 1,
                        }}
                    >
                        {loading ? 'Đang tải...' : 'Tải xuống'}
                    </Button>
                </Box>
                
            </Paper>

            <Paper
                elevation={1}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    mt: 2
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        Báo cáo thời gian làm việc
                    </Typography>

                    <Box>
                        <TextField
                            label="Từ ngày"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <TextField
                            label="Đến ngày"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
                        onClick={() => handleDownloadTotalTimeWorkedByMonth(startDate, endDate)}
                        disabled={loading}
                        sx={{
                            backgroundColor: '#4CAF50',
                            '&:hover': {
                                backgroundColor: '#45a049',
                            },
                            px: 3,
                            py: 1,
                        }}
                    >
                        {loading ? 'Đang tải...' : 'Tải xuống'}
                    </Button>
                </Box>
                
            </Paper>
        </Box>
    );
}

export default ReportManager;
