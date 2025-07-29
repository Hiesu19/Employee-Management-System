import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Chip, IconButton } from '@mui/material';
import { Check, Home, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { getMyCheckInOut } from '../../../services/checkinoutService';

function CheckInOut() {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [dataCheckInOut, setDataCheckInOut] = useState([]);


    const generateDays = (year, month) => {
        const startOfMonth = new Date(year, month, 1);
        const dayOfWeek = startOfMonth.getDay();
        const startOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const startDate = new Date(startOfMonth);
        startDate.setDate(startOfMonth.getDate() - startOffset);

        const days = [];
        for (let i = 0; i < 35; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const days = generateDays(currentYear, currentMonth);

    const fetchData = async () => {
        try {
            const response = await getMyCheckInOut(0, 35, days[0], days[34]);
            setDataCheckInOut(response.data.checkInOut || []);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu chấm công:', error);
            setDataCheckInOut([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentYear, currentMonth]);

    const dataMapping = dataCheckInOut.reduce((acc, item) => {
        acc[item.date] = item;
        return acc;
    }, {});

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentYear(currentYear - 1);
            setCurrentMonth(11);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentYear(currentYear + 1);
            setCurrentMonth(0);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    return (
        <Box sx={{
            mt: 4,
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
            overflowX: 'auto',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Box sx={{
                minWidth: 920,
                width: 'fit-content'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    px: 2
                }}>
                    <IconButton
                        onClick={handlePreviousMonth}
                        sx={{
                            bgcolor: 'primary.light',
                            color: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white'
                            }
                        }}
                    >
                        <ChevronLeft />
                    </IconButton>

                    <Typography variant="h5" sx={{
                        fontWeight: 600,
                        color: 'primary.main',
                        textAlign: 'center'
                    }}>
                        {monthNames[currentMonth]} {currentYear}
                    </Typography>

                    <IconButton
                        onClick={handleNextMonth}
                        sx={{
                            bgcolor: 'primary.light',
                            color: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.main',
                                color: 'white'
                            }
                        }}
                    >
                        <ChevronRight />
                    </IconButton>
                </Box>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 125px)',
                    gap: '12px',
                    mb: 2
                }}>
                    {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day, index) => (
                        <Box key={index} sx={{ textAlign: 'center', py: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {day}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 125px)',
                    gridTemplateRows: 'repeat(5, 130px)',
                    gap: '12px'
                }}>
                    {days.map((date) => {
                        const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                        const dayData = dataMapping[dateKey] || {};
                        const checkInTime = dayData.checkInTime;
                        const checkOutTime = dayData.checkOutTime;
                        const isToday = (new Date().toDateString() === date.toDateString());
                        const isCurrentMonth = date.getMonth() === currentMonth;

                        return (
                            <Paper
                                key={dateKey}
                                elevation={isToday ? 4 : 1}
                                sx={{
                                    p: 1.5,
                                    width: 125,
                                    height: 130,
                                    textAlign: 'center',
                                    bgcolor: isToday ? 'primary.light' : (isCurrentMonth ? 'grey.100' : 'grey.50'),
                                    border: isToday ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                    borderRadius: 2,
                                    opacity: isCurrentMonth ? 1 : 0.4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][date.getDay() === 0 ? 6 : date.getDay() - 1]}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
                                        {date.getDate()}/{date.getMonth() + 1}
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.8,
                                    alignItems: 'center'
                                }}>
                                    <Chip
                                        icon={<Check fontSize="small" />}
                                        label={checkInTime ? checkInTime.slice(0, 5) : "--:--"}
                                        size="small"
                                        color={checkInTime ? "success" : "default"}
                                        sx={{
                                            fontSize: 10,
                                            width: '100%',
                                            maxWidth: '100px',
                                            height: 22
                                        }}
                                    />
                                    <Chip
                                        icon={<Home fontSize="small" />}
                                        label={checkOutTime ? checkOutTime.slice(0, 5) : "--:--"}
                                        size="small"
                                        color={checkOutTime ? "warning" : "default"}
                                        sx={{
                                            fontSize: 10,
                                            width: '100%',
                                            maxWidth: '100px',
                                            height: 22
                                        }}
                                    />
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
}

export default CheckInOut;
