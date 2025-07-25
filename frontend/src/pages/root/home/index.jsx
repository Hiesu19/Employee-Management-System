import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Chip,
    Divider,
} from '@mui/material';
import {
    People as PeopleIcon,
    SupervisorAccount as SupervisorIcon,
    Business as BusinessIcon,
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    ExitToApp as ExitIcon,
    AccessTime as ClockIcon,
    WbSunny as WeatherIcon,
} from '@mui/icons-material';
import { getDashboardStats } from '../../../services/dashboardService';
import { getCurrentWeather } from '../../../services/weatherService';
import { getUser } from '../../../services/authService';

function RootHome() {
    const [stats, setStats] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

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
                const [statsResponse, weatherData] = await Promise.all([
                    getDashboardStats(),
                    getCurrentWeather()
                ]);
                setStats(statsResponse.data);
                setWeather(weatherData);
            } catch (err) {
                setError('Không thể tải dữ liệu');
                console.error('Dashboard error:', err);
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


    const statsCards = [
        {
            title: 'Nhân viên',
            value: stats?.totalEmployees || 0,
            icon: PeopleIcon,
            color: '#2196F3',
            bgColor: 'rgba(33, 150, 243, 0.1)',
        },
        {
            title: 'Quản lý',
            value: stats?.totalManagers || 0,
            icon: SupervisorIcon,
            color: '#FF9800',
            bgColor: 'rgba(255, 152, 0, 0.1)',
        },
        {
            title: 'Phòng ban',
            value: stats?.countDepartment || 0,
            icon: BusinessIcon,
            color: '#4CAF50',
            bgColor: 'rgba(76, 175, 80, 0.1)',
        },
        {
            title: 'Yêu cầu chờ',
            value: stats?.totalRequestsPending || 0,
            icon: AssignmentIcon,
            color: '#F44336',
            bgColor: 'rgba(244, 67, 54, 0.1)',
        },
        {
            title: 'Check-in hôm nay',
            value: stats?.countCheckInToday || 0,
            icon: ScheduleIcon,
            color: '#9C27B0',
            bgColor: 'rgba(156, 39, 176, 0.1)',
        },
        {
            title: 'Check-out hôm nay',
            value: stats?.countCheckOutToday || 0,
            icon: ExitIcon,
            color: '#607D8B',
            bgColor: 'rgba(96, 125, 139, 0.1)',
        },
    ];

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
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                            {getGreeting(user?.fullName)}
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            {formatDate(currentTime)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
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
                                    <Grid item xs={5.5}>
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
                                    <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
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
                                    <Grid item xs={5.5}>
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

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Stats Section */}
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                📊 Tổng quan hệ thống
            </Typography>

            <Grid container spacing={3}>
                {statsCards.map((card, index) => {
                    const IconComponent = card.icon;
                    return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                backgroundColor: card.bgColor,
                                                mr: 2,
                                            }}
                                        >
                                            <IconComponent sx={{ fontSize: 28, color: card.color }} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: card.color }}>
                                                {card.value.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        {card.title}
                                    </Typography>
                                    {card.title === 'Yêu cầu chờ' && card.value > 0 && (
                                        <Chip
                                            label="Cần xử lý"
                                            color="error"
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}

export default RootHome;
