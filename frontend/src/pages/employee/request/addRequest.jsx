import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Alert,
    Grid,
    Stack,
    IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { createRequest } from '../../../services/requestService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const typeOptions = [
    { value: 'sick', label: 'Nghỉ bệnh' },
    { value: 'personal', label: 'Nghỉ phép' },
    { value: 'other', label: 'Khác' }
];

function AddRequest() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: '',
        fromDate: null,
        toDate: null,
        reason: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.type) {
            newErrors.type = 'Vui lòng chọn loại yêu cầu';
        }

        if (!formData.fromDate) {
            newErrors.fromDate = 'Vui lòng chọn ngày bắt đầu';
        }

        if (!formData.toDate) {
            newErrors.toDate = 'Vui lòng chọn ngày kết thúc';
        }

        if (formData.fromDate && formData.toDate) {
            if (dayjs(formData.toDate).isBefore(dayjs(formData.fromDate))) {
                newErrors.toDate = 'Ngày kết thúc phải sau ngày bắt đầu';
            }
        }

        if (!formData.reason.trim()) {
            newErrors.reason = 'Vui lòng nhập lý do';
        } else if (formData.reason.trim().length < 10) {
            newErrors.reason = 'Lý do phải có ít nhất 10 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSubmitError('');

        try {
            const requestData = {
                type: formData.type,
                fromDate: dayjs(formData.fromDate).format('YYYY-MM-DD'),
                toDate: dayjs(formData.toDate).format('YYYY-MM-DD'),
                reason: formData.reason.trim()
            };

            await createRequest(requestData);

            navigate('/me/request', {
                state: { message: 'Yêu cầu đã được tạo thành công!' }
            });

        } catch (error) {
            console.error('Lỗi khi tạo yêu cầu:', error);
            setSubmitError(
                error.response?.data?.message ||
                'Có lỗi xảy ra khi tạo yêu cầu. Vui lòng thử lại.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/me/request');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <IconButton
                    onClick={() => navigate('/me/request')}
                    color="primary"
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    Tạo yêu cầu
                </Typography>
            </Stack>

            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="Ngày bắt đầu"
                                value={formData.fromDate}
                                onChange={(value) => handleInputChange('fromDate', value)}
                                fullWidth
                                required
                                error={!!errors.fromDate}
                                helperText={errors.fromDate}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="Ngày kết thúc"
                                value={formData.toDate}
                                onChange={(value) => handleInputChange('toDate', value)}
                                fullWidth
                                required
                                error={!!errors.toDate}
                                helperText={errors.toDate}
                            />
                        </Grid>

                    </Grid>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <FormControl required error={!!errors.type} sx={{ minWidth: 200 }}>
                        <Select
                            labelId="type-label"
                            id="type"
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            sx={{ minHeight: 40, fontSize: 16 }}
                        >
                            {typeOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value} sx={{ fontSize: 16 }}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.type && (
                            <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                                {errors.type}
                            </Typography>
                        )}
                    </FormControl>

                    <Typography variant="body1" sx={{ minWidth: 120 }}>
                        Loại yêu cầu
                    </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Lý do"
                        value={formData.reason}
                        onChange={(e) => handleInputChange('reason', e.target.value)}
                        fullWidth
                        required
                        multiline
                        minRows={3}
                        error={!!errors.reason}
                        helperText={errors.reason}
                    />
                </Box>



                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Tạo yêu cầu
                    </Button>
                </Box>
            </Paper>
        </LocalizationProvider>
    );
}

export default AddRequest;
