import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Divider,
    CircularProgress,
    Alert,
    Button,
    Chip,
    Snackbar
} from "@mui/material";
import {
    AccessTime as ClockIcon,
    WbSunny as WeatherIcon,
    Login as CheckInIcon,
    Logout as CheckOutIcon,
    Check,
    Home
} from "@mui/icons-material";
import { getCurrentWeather } from '../../../services/weatherService';
import { getUser } from '../../../services/authService';
import { checkIn, checkOut, getWeeklyCheckInOutStatus } from '../../../services/checkinoutService';

function EmployeeHome() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const [weeklyData, setWeeklyData] = useState([]);
    const [actionLoading, setActionLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const user = getUser();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [weatherData, weekData] = await Promise.all([
                    getCurrentWeather(),
                    getWeeklyCheckInOutStatus()
                ]);
                setWeather(weatherData);
                setWeeklyData(weekData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getGreeting = (name) => {
        const currentTime = new Date();
        const hour = currentTime.getHours();
        let displayName = name || 'Admin';

        if (displayName) {
            const parts = displayName.trim().split(' ');
            displayName = parts[parts.length - 1];

            if (displayName.length > 10) {
                displayName = displayName.substring(0, 10) + '...';
            }
        }

        if (hour < 12) return `🌞 Chào buổi sáng, ${displayName}`;
        if (hour < 18) return `🌄 Chào buổi chiều, ${displayName}`;
        return `🌙 Chào buổi tối, ${displayName}`;
    };

    const handleCheckIn = async () => {
        try {
            setActionLoading(true);
            await checkIn();
            setSnackbar({ open: true, message: 'Check-in thành công!. Chúc bạn có một ngày làm việc tốt lành', severity: 'success' });

            const weekData = await getWeeklyCheckInOutStatus();
            setWeeklyData(weekData);
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi check-in',
                severity: 'error'
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            const confirmed = window.confirm('Bạn có chắc chắn muốn check-out không?');
            if (!confirmed) return;
            setActionLoading(true);
            await checkOut();
            setSnackbar({ open: true, message: 'Check-out thành công! \n Về nhà đi chơi thôi', severity: 'success' });

            const weekData = await getWeeklyCheckInOutStatus();
            setWeeklyData(weekData);
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi check-out',
                severity: 'error'
            });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header Section */}
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    mb: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 3,
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid xs={12} md={8}>
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                            {getGreeting(user?.fullName)}
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            {formatDate(currentTime)}
                        </Typography>
                    </Grid>

                    <Grid xs={12} md={4} sx={{ display: 'flex' }}>
                        <Card
                            sx={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white',
                            }}
                        >
                            <CardContent sx={{ py: 3, px: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    {/* Time Section */}
                                    <Grid xs={5.5}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <ClockIcon sx={{ fontSize: 32, mb: 1 }} />
                                            <Typography variant="h6" component="div" sx={{ fontWeight: 700, fontFamily: 'monospace', mb: 0.5 }}>
                                                {formatTime(currentTime)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.85rem' }}>
                                                Hà Nội
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Vertical Divider */}
                                    <Grid xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                            sx={{
                                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                                height: '60px',
                                                alignSelf: 'center'
                                            }}
                                        />
                                    </Grid>

                                    {/* Weather Section */}
                                    <Grid xs={5.5}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <WeatherIcon sx={{ fontSize: 32, mb: 1 }} />
                                            <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                {weather?.temperature || '--'}°C
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.85rem', mb: 0.3 }}>
                                                {weather?.description || 'Đang tải...'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            <Box >
                <Box sx={{ display: 'flex', gap: 1.5, mt: 3, justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={actionLoading ? <CircularProgress size={14} color="inherit" /> : <CheckInIcon fontSize="small" />}
                        onClick={handleCheckIn}
                        disabled={actionLoading}
                        sx={{ minWidth: 0, px: 2 }}
                    >
                        Check-in
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={actionLoading ? <CircularProgress size={14} color="inherit" /> : <CheckOutIcon fontSize="small" />}
                        onClick={handleCheckOut}
                        disabled={actionLoading}
                        sx={{ minWidth: 0, px: 2 }}
                    >
                        Check-out
                    </Button>
                </Box>

                {/* Lịch check-in/check-out trong tuần này */}
                <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                    <Grid container spacing={1} justifyContent="center">
                        {(() => {
                            const today = new Date();
                            const startOfWeek = new Date(today);
                            const dayOfWeek = today.getDay();
                            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                            startOfWeek.setDate(today.getDate() - daysToMonday);

                            const days = [];
                            for (let i = 0; i < 7; i++) {
                                const d = new Date(startOfWeek);
                                d.setDate(startOfWeek.getDate() + i);
                                days.push(d);
                            }

                            const data = weeklyData?.data || weeklyData || {};

                            return days.map((date) => {
                                const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                                const dayData = data[dateKey] || {};
                                const checkInTime = dayData.checkInTime;
                                const checkOutTime = dayData.checkOutTime;
                                const isToday = (new Date().toDateString() === date.toDateString());

                                return (
                                    <Grid item key={dateKey} >
                                        <Paper
                                            elevation={isToday ? 4 : 1}
                                            sx={{
                                                p: 1.5,
                                                minWidth: 100,
                                                textAlign: 'center',
                                                bgcolor: isToday ? 'primary.light' : 'grey.100',
                                                border: isToday ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][date.getDay() === 0 ? 6 : date.getDay() - 1]}
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
                                                {date.getDate()}/{date.getMonth() + 1}
                                            </Typography>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center', mt: 1 }}>
                                                <Chip
                                                    icon={<Check fontSize="small" />}
                                                    label={checkInTime ? checkInTime.slice(0, 5) : "--:--"}
                                                    size="small"
                                                    color={checkInTime ? "success" : "default"}
                                                    sx={{ fontSize: 10, width: '100%', height: 20 }}
                                                />
                                                <Chip
                                                    icon={<Home fontSize="small" />}
                                                    label={checkOutTime ? checkOutTime.slice(0, 5) : "--:--"}
                                                    size="small"
                                                    color={checkOutTime ? "warning" : "default"}
                                                    sx={{ fontSize: 10, width: '100%', height: 20 }}
                                                />
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            });
                        })()}
                    </Grid>
                </Box>

            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default EmployeeHome;